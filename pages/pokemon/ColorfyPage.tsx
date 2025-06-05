
import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Palette, Save, RefreshCw } from 'lucide-react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const generateShades = (hexColor: string, count: number = 9): { [key: number]: string } => {
  const shades: { [key: number]: string } = {};
  try {
    if (!hexColor || !hexColor.startsWith('#') || (hexColor.length !== 4 && hexColor.length !== 7)) {
      console.warn("Invalid hexColor for generateShades:", hexColor);
      for (let i = 0; i < count; i++) shades[(i + 1) * 100] = '#808080';
      return shades;
    }

    let rStr, gStr, bStr;
    if (hexColor.length === 4) { 
      rStr = hexColor[1] + hexColor[1];
      gStr = hexColor[2] + hexColor[2];
      bStr = hexColor[3] + hexColor[3];
    } else { 
      rStr = hexColor.slice(1, 3);
      gStr = hexColor.slice(3, 5);
      bStr = hexColor.slice(5, 7);
    }
    
    let r = parseInt(rStr, 16);
    let g = parseInt(gStr, 16);
    let b = parseInt(bStr, 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new Error("Parsed non-numeric RGB values.");
    }

    for (let i = 0; i < count; i++) {
      const factor = (i - Math.floor(count / 2)) * 0.15; 
      const shadeR = Math.max(0, Math.min(255, Math.round(r * (1 - factor)))); 
      const shadeG = Math.max(0, Math.min(255, Math.round(g * (1 - factor))));
      const shadeB = Math.max(0, Math.min(255, Math.round(b * (1 - factor))));
      shades[(i + 1) * 100] = `#${shadeR.toString(16).padStart(2, '0')}${shadeG.toString(16).padStart(2, '0')}${shadeB.toString(16).padStart(2, '0')}`;
    }
  } catch (error) {
    console.error("Error generating shades for:", hexColor, error);
    for (let i = 0; i < count; i++) shades[(i + 1) * 100] = hexColor || '#808080'; 
  }
  return shades;
};


const ColorfyPage: React.FC = () => {
  const initialPalette: ColorPalette = {
    primary: '#3b82f6',    
    secondary: '#64748b',  
    accent: '#10b981',     
    background: '#f3f4f6', 
    text: '#111827',       
  };

  const [palette, setPalette] = useState<ColorPalette>(initialPalette);
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 

  useEffect(() => {
     const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
     const localTheme = localStorage.getItem('theme');
     const currentIsDark = localTheme === 'dark' || (!localTheme && isSystemDark);
     setDarkMode(currentIsDark);

     const savedPalette = localStorage.getItem('colorfyPalette');
     if (savedPalette) {
       setPalette(JSON.parse(savedPalette));
     } else {
       setPalette(prev => ({
         ...prev,
         background: currentIsDark ? '#0f172a' : '#f8fafc', 
         text: currentIsDark ? '#f1f5f9' : '#0f172a' 
       }));
     }
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(palette).forEach(([name, value]) => {
      if(value) { 
        root.style.setProperty(`--color-${name}`, value);
        if (name === 'primary' || name === 'secondary' || name === 'accent') {
          const shades = generateShades(value);
          Object.entries(shades).forEach(([shadeKey, shadeValue]) => {
            root.style.setProperty(`--color-${name}-${shadeKey}`, shadeValue);
          });
        }
      }
    });
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
    const localTheme = localStorage.getItem('theme');
    const currentIsDark = localTheme === 'dark' || (!localTheme && isSystemDark);
    setPalette({
        ...initialPalette, 
        background: currentIsDark ? '#0f172a' : '#f8fafc', 
        text: currentIsDark ? '#f1f5f9' : '#0f172a'
    });
  };
  
  const colorInputs: Array<{ name: keyof ColorPalette; label: string }> = [
    { name: 'primary', label: 'Primary Color' },
    { name: 'secondary', label: 'Secondary Color' },
    { name: 'accent', label: 'Accent Color' },
    { name: 'background', label: 'Background Color' },
    { name: 'text', label: 'Text Color' },
  ];
  
  const getContrastingTextColor = (bgColor: string): string => {
    if (!bgColor || !bgColor.startsWith('#')) return darkMode ? palette.text : palette.text; 
    try {
        let r, g, b;
        if (bgColor.length === 4) {
            r = parseInt(bgColor[1] + bgColor[1], 16);
            g = parseInt(bgColor[2] + bgColor[2], 16);
            b = parseInt(bgColor[3] + bgColor[3], 16);
        } else if (bgColor.length === 7) {
            r = parseInt(bgColor.slice(1, 3), 16);
            g = parseInt(bgColor.slice(3, 5), 16);
            b = parseInt(bgColor.slice(5, 7), 16);
        } else {
             return darkMode ? palette.text : palette.text; 
        }

        if (isNaN(r) || isNaN(g) || isNaN(b)) return darkMode ? palette.text : palette.text;

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF'; 
    } catch (e) {
        console.error("Error in getContrastingTextColor for", bgColor, e);
        return darkMode ? palette.text : palette.text; 
    }
  };


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
                inputClassName="p-0 h-10 w-10 rounded-md border-0 cursor-pointer" 
                containerClassName="mb-0"
              />
              <Input
                type="text"
                value={palette[input.name]}
                onChange={handleColorChange}
                name={input.name} 
                inputClassName="flex-grow"
                containerClassName="mb-0 flex-grow"
              />
            </div>
          </div>
        ))}
      </div>

      <Card title="Live Preview" className="mt-8">
        <div style={{ 
            backgroundColor: palette.background, 
            color: palette.text, 
            padding: '20px', 
            borderRadius: '8px',
            border: `1px solid ${palette.secondary}` 
        }}>
          <h3 style={{ color: palette.primary, fontSize: '1.5rem', marginBottom: '10px' }}>Preview Title Text</h3>
          <p style={{ marginBottom: '15px' }}>
            This is a paragraph demonstrating the text color on the chosen background. Links will use the <a href="#" style={{ color: palette.accent, textDecoration: 'underline' }}>accent color</a>.
          </p>
          <Button style={{ backgroundColor: palette.primary, color: getContrastingTextColor(palette.primary) }} className="mr-2">Primary Button</Button>
          <Button style={{ backgroundColor: palette.secondary, color: getContrastingTextColor(palette.secondary)  }}>Secondary Button</Button>
          <div className="mt-4 p-2 rounded" style={{backgroundColor: palette.accent, color: getContrastingTextColor(palette.accent) }}>
            This is an accent box.
          </div>
        </div>
        <div className="mt-2 text-right">
          <Button onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              if (!localStorage.getItem('colorfyPalette')) {
                  setPalette(prev => ({
                      ...prev,
                      background: newMode ? '#0f172a' : '#f8fafc',
                      text: newMode ? '#f1f5f9' : '#0f172a'
                  }));
              }
          }} variant="outline" size="sm">
            Toggle Preview Dark/Light: {darkMode ? "Dark" : "Light"}
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
