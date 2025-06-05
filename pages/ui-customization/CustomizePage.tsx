
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Select from '../../ui/Select'; // Updated import path
import Input from '../../ui/Input';
import { Save, Settings, Type, Columns, Rows } from 'lucide-react';

interface UICustomizationSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'base' | 'lg';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  primaryColor: string; // hex
  showTooltips: boolean;
}

const CustomizePage: React.FC = () => {
  const [settings, setSettings] = useState<UICustomizationSettings>({
    theme: 'system',
    fontSize: 'base',
    layoutDensity: 'comfortable',
    primaryColor: '#3b82f6', // Default Tailwind blue-500
    showTooltips: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
    // Live change for some settings could be implemented here via useEffect or directly changing CSS variables
  };
  
  // Example: Apply theme immediately (simplified)
  React.useEffect(() => {
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else if (settings.theme === 'light') document.documentElement.classList.remove('dark');
    else { // system
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
  }, [settings.theme]);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving to backend or localStorage
    setTimeout(() => {
      console.log("Saving UI Customization Settings:", settings);
      localStorage.setItem('uiCustomizationSettings', JSON.stringify(settings));
      alert("UI settings saved! Some changes may require a refresh to fully apply.");
      setIsSaving(false);
    }, 1000);
  };

  // Load settings from localStorage on initial mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('uiCustomizationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);


  return (
    <Card title="Customize Dashboard Appearance">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Personalize the look and feel of your dashboard. Changes here affect your viewing experience.
      </p>

      <div className="space-y-6">
        <Card title="General Theme & Layout" className="bg-neutral-50 dark:bg-neutral-750">
          <div className="grid md:grid-cols-2 gap-6 p-4">
            <Select
              label="Theme"
              name="theme"
              options={[
                { value: 'light', label: 'Light Mode' },
                { value: 'dark', label: 'Dark Mode' },
                { value: 'system', label: 'System Preference' },
              ]}
              value={settings.theme}
              onChange={handleInputChange}
              leftIcon={<Settings size={16} className="mr-2"/>}
            />
            <Select
              label="Font Size"
              name="fontSize"
              options={[
                { value: 'sm', label: 'Small' },
                { value: 'base', label: 'Medium (Default)' },
                { value: 'lg', label: 'Large' },
              ]}
              value={settings.fontSize}
              onChange={handleInputChange}
              leftIcon={<Type size={16} className="mr-2"/>}
            />
            <Select
              label="Layout Density"
              name="layoutDensity"
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable (Default)' },
                { value: 'spacious', label: 'Spacious' },
              ]}
              value={settings.layoutDensity}
              onChange={handleInputChange}
              leftIcon={<Rows size={16} className="mr-2"/>}
            />
             <Input
              label="Primary Color Accent"
              name="primaryColor"
              type="color"
              value={settings.primaryColor}
              onChange={handleInputChange}
              // No icon prop for Input, handle styling if needed.
            />
             <div className="flex items-center mt-2 md:mt-8">
                <input
                    id="showTooltips"
                    name="showTooltips"
                    type="checkbox"
                    checked={settings.showTooltips}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="showTooltips" className="ml-2 block text-sm text-neutral-900 dark:text-neutral-100">
                    Show contextual tooltips
                </label>
            </div>
          </div>
        </Card>
        
        {/* Example of how settings would apply live for preview */}
        <Card title="Live Preview Area" className="mt-6">
            <div className={`p-4 border rounded-md ${settings.theme === 'dark' ? 'dark bg-neutral-800 text-white' : 'bg-white text-black'}`} style={{fontSize: settings.fontSize === 'sm' ? '0.875rem' : settings.fontSize === 'lg' ? '1.125rem' : '1rem'}}>
                <h3 className="text-lg font-semibold" style={{color: settings.primaryColor}}>Sample Title</h3>
                <p className={`my-2 ${settings.layoutDensity === 'compact' ? 'py-0.5' : settings.layoutDensity === 'spacious' ? 'py-2' : 'py-1'}`}>
                    This is some sample text to demonstrate the current UI settings. The quick brown fox jumps over the lazy dog.
                </p>
                <Button style={{backgroundColor: settings.primaryColor}} className="text-white">Sample Button</Button>
            </div>
        </Card>

      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 text-right">
        <Button onClick={handleSaveSettings} leftIcon={<Save size={16} />} isLoading={isSaving}>
          {isSaving ? 'Saving...' : 'Save Customizations'}
        </Button>
      </div>
    </Card>
  );
};

export default CustomizePage;
