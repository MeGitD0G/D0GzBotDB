
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Palette, Save, RefreshCw } from 'lucide-react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  // ... add more as needed, e.g., success, error, warning
}

// Function to generate shades (simplified example)
const generateShades = (hexColor: string, count: number = 9): { [key: number]: string } => {
  // This is a very naive implementation. A real one would use HSL manipulation.
  const shades: { [key: number]: string } = {};
  try {
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    for (let i = 0; i < count; i++) {
      const factor = (i - Math.floor(count / 2)) * 0.1; // Adjust factor for more/less variance
      const shadeR = Math.max(0, Math.min(255, Math.round(r * (1 + factor))));
      const shadeG = Math.max(0, Math.min(255, Math.round(g * (1 + factor))));
      const shadeB = Math.max(0, Math.min(255, Math.round(b * (1 + factor))));
      shades[(i + 1) * 100] = `#${shadeR.toString(16).padStart(2, '0')}${shadeG.toString(16).padStart(2, '0')}${shadeB.toString(16).padStart(2, '0')}`;
    }
  } catch (error) {
    console.error("Error generating shades:", error);
    // Return a default if error
    for (let i = 0; i < count; i++) shades[(i + 1) * 100] = hexColor;
  }
  return shades;
};


const ColorfyPage: React.FC = () => {
  const initialPalette: ColorPalette = {
    primary: '#3b82f6',    // blue-500
    secondary: '#64748b',  // slate-500
    accent: '#10b981',     // emerald-500
    background: '#f3f4f6', // neutral-100 (light) or #1f2937 (gray-800 dark)
    text: '#111827',       // gray-900 (light) or #f9fafb (gray-50 dark)
  };

  const [palette, setPalette] = useState<ColorPalette>(initialPalette);
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // For preview

  useEffect(() => {
     // Initialize darkMode based on system preference or localStorage
     const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
     const localTheme = localStorage.getItem('theme');
     setDarkMode(localTheme === 'dark' || (!localTheme && isSystemDark));

     // Load saved palette from local storage
     const savedPalette = localStorage.getItem('colorfyPalette');
     if (savedPalette) {
       setPalette(JSON.parse(savedPalette));
     } else {
       // Set initial background/text based on current theme if no saved palette
       setPalette(prev => ({
         ...prev,
         background: isSystemDark ? '#0f172a' : '#f8fafc', // Tailwind neutral-900 / neutral-50
         text: isSystemDark ? '#f1f5f9' : '#0f172a' // Tailwind neutral-100 / neutral-900
       }));
     }
  }, []);
  
  // Update CSS variables whenever palette changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(palette).forEach(([name, value]) => {
      root.style.setProperty(`--color-${name}`, value);

      // Example for generating and setting shades for primary color
      if (name === 'primary') {
        const shades = generateShades(value);
        Object.entries(shades).forEach(([shadeKey, shadeValue]) => {
          root.style.setProperty(`--color-${name}-${shadeKey}`, shadeValue);
        });
      }
    });
    // Update tailwind.config.js dynamically (advanced, requires build step or specific setup)
    // For this demo, we rely on CSS variables for dynamic parts. Pre-defined primary in tailwind.config will be overridden by --color-primary if elements use var(--color-primary).
  }, [palette]);


  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPalette(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePalette = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saving Color Palette:", palette);
      localStorage.setItem('colorfyPalette', JSON.stringify(palette));
      alert("Color palette saved! This might require a page refresh or specific CSS setup to fully apply to all Tailwind components.");
      setIsSaving(false);
    }, 1000);
  };

  const handleResetPalette = () => {
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultBg = isSystemDark ? '#0f172a' : '#f8fafc';
    const defaultText = isSystemDark ? '#f1f5f9' : '#0f172a';
    setPalette({...initialPalette, background: defaultBg, text: defaultText});
  };
  
  const colorInputs: Array<{ name: keyof ColorPalette; label: string }> = [
    { name: 'primary', label: 'Primary Color' },
    { name: 'secondary', label: 'Secondary Color' },
    { name: 'accent', label: 'Accent Color' },
    { name: 'background', label: 'Background Color' },
    { name: 'text', label: 'Text Color' },
  ];

  return (
    <Card title="Colorfy - Customize Your Theme Colors">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Define a custom color palette for the dashboard. These colors will be applied globally where possible.
        Note: Full dynamic theming of all Tailwind components requires advanced setup. This primarily sets CSS variables.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {colorInputs.map(input => (
          <div key={input.name}>
            <label htmlFor={input.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {input.label}
            </label>
            <div className="flex items-center space-x-2">
              <Input
                id={input.name}
                name={input.name}
                type="color"
                value={palette[input.name]}
                onChange={handleColorChange}
                inputClassName="p-0 h-10 w-10 rounded-md border-0 cursor-pointer" // Basic styling for color input
                containerClassName="mb-0"
              />
              <Input
                type="text"
                value={palette[input.name]}
                onChange={handleColorChange}
                name={input.name} // Ensure name is passed for text input to also update palette
                inputClassName="flex-grow"
                containerClassName="mb-0 flex-grow"
              />
            </div>
          </div>
        ))}
      </div>

      <Card title="Live Preview" className="mt-8">
        <div style={{ 
            backgroundColor: darkMode ? palette.background : palette.background, // Use palette.background directly
            color: darkMode ? palette.text : palette.text, // Use palette.text directly
            padding: '20px', 
            borderRadius: '8px',
            border: `1px solid ${palette.secondary}` 
        }}>
          <h3 style={{ color: palette.primary, fontSize: '1.5rem', marginBottom: '10px' }}>Preview Title Text</h3>
          <p style={{ marginBottom: '15px' }}>
            This is a paragraph demonstrating the text color on the chosen background. Links will use the <a href="#" style={{ color: palette.accent, textDecoration: 'underline' }}>accent color</a>.
          </p>
          <Button style={{ backgroundColor: palette.primary, color: generateShades(palette.primary)[100] || '#FFFFFF' }} className="mr-2">Primary Button</Button>
          <Button style={{ backgroundColor: palette.secondary, color: generateShades(palette.secondary)[100] || '#FFFFFF'  }}>Secondary Button</Button>
          <div className="mt-4 p-2 rounded" style={{backgroundColor: palette.accent, color: generateShades(palette.accent)[100] || '#FFFFFF' }}>
            This is an accent box.
          </div>
        </div>
        <div className="mt-2 text-right">
          <Button onClick={() => setDarkMode(!darkMode)} variant="outline" size="sm">
            Toggle Preview Dark Mode: {darkMode ? "ON" : "OFF"}
          </Button>
        </div>
      </Card>


      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3">
        <Button variant="outline" onClick={handleResetPalette} leftIcon={<RefreshCw size={16}/>}>
            Reset to Defaults
        </Button>
        <Button onClick={handleSavePalette} leftIcon={<Save size={16} />} isLoading={isSaving}>
          {isSaving ? 'Saving...' : 'Save Color Palette'}
        </Button>
      </div>
    </Card>
  );
};

export default ColorfyPage;
    