
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select'; 
import StepIndicator from '../../ui/StepIndicator'; 
import useStepForm from '../../useStepForm'; 
import { MOCK_CHANNELS, MOCK_ITEM_NAMES } from '../../constants';
import { Channel, ItemConfig } from '../../types'; // ItemConfig would need to be fully defined
import { PlusCircle, Trash2, Save, PackageCheck, Timer, AlertCircle } from 'lucide-react';

// Define a more complete ItemConfig if necessary, for now using a basic structure
interface FullItemConfig extends ItemConfig {
  itemDropRates: { [itemName: string]: number }; // Example: { "Pokeball": 50, "Potion": 30 }
  itemQuantities: { [itemName: string]: { min: number, max: number } };
  cooldownPeriod: number; // minutes
  isEnabled?: boolean; // if this feature has an enable/disable state
}

const itemConfigSteps = [
  { id: 'channels', name: 'Channels' },
  { id: 'items', name: 'Items & Rates' },
  { id: 'quantities', name: 'Quantities' },
  { id: 'timing', name: 'Timing/Cooldown' },
  { id: 'finalize', name: 'Finalize & Save' },
];

const InitialItemConfigState: FullItemConfig = {
  name: '',
  selectedChannelIds: [],
  itemDropRates: MOCK_ITEM_NAMES.slice(0,5).reduce((acc, item) => ({ ...acc, [item]: 10 }), {}), // Default 10% for first 5 items
  itemQuantities: MOCK_ITEM_NAMES.slice(0,5).reduce((acc, item) => ({ ...acc, [item]: { min: 1, max: 3 } }), {}),
  cooldownPeriod: 60, // minutes
  isEnabled: true, 
};


const ItemsConfigPage: React.FC = () => {
  const [config, setConfig] = useState<FullItemConfig>(InitialItemConfigState);
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep } = useStepForm({ totalSteps: itemConfigSteps.length });
  const [loadedChannels, setLoadedChannels] = useState<Channel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const handleLoadChannels = () => {
    setIsLoadingChannels(true);
    // Simulate API call
    setTimeout(() => {
      setLoadedChannels(MOCK_CHANNELS);
      setIsLoadingChannels(false);
    }, 1000);
  };

  const handleChannelSelection = (channelId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedChannelIds: prev.selectedChannelIds.includes(channelId)
        ? prev.selectedChannelIds.filter(id => id !== channelId)
        : [...prev.selectedChannelIds, channelId]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setConfig(prev => ({ ...prev, [name]: checked }));
    } else {
        const isNumber = type === 'number';
        setConfig(prev => ({ ...prev, [name]: isNumber ? parseInt(value) : value }));
    }
  };
  
  const handleItemRateChange = (itemName: string, rate: string) => {
    setConfig(prev => ({
      ...prev,
      itemDropRates: { ...prev.itemDropRates, [itemName]: Math.max(0, Math.min(100, parseInt(rate) || 0)) }
    }));
  };

  const handleItemQuantityChange = (itemName: string, type: 'min' | 'max', value: string) => {
    setConfig(prev => ({
      ...prev,
      itemQuantities: {
        ...prev.itemQuantities,
        [itemName]: {
          ...(prev.itemQuantities[itemName] || { min:1, max:1 }),
          [type]: Math.max(1, parseInt(value) || 1)
        }
      }
    }));
  };
  
  const handleAddItemToList = (newItemName: string) => {
    if (!newItemName.trim() || config.itemDropRates.hasOwnProperty(newItemName)) return;
    setConfig(prev => ({
      ...prev,
      itemDropRates: {...prev.itemDropRates, [newItemName]: 10 }, // default 10%
      itemQuantities: {...prev.itemQuantities, [newItemName]: {min: 1, max: 1} }
    }));
  };

  const handleRemoveItemFromList = (itemName: string) => {
    const newRates = {...config.itemDropRates};
    delete newRates[itemName];
    const newQuantities = {...config.itemQuantities};
    delete newQuantities[itemName];
    setConfig(prev => ({
      ...prev,
      itemDropRates: newRates,
      itemQuantities: newQuantities,
    }));
  };

  const totalDropRate = Object.values(config.itemDropRates).reduce((sum, rate) => sum + rate, 0);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setSaveStatus(null);
    console.log("Attempting to save item config (mock):", config);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      // Mock success
      setSaveStatus({ type: 'success', message: `Item Configuration "${config.name}" saved successfully (mock)!` });
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: `Error saving item configuration (mock): ${error.message}` });
    } finally {
      setIsSavingConfig(false);
    }
  };
  
  const currentStepIsValid = () => {
    switch(currentStep) {
      case 0: return loadedChannels.length > 0 && config.selectedChannelIds.length > 0;
      case 1: return Object.keys(config.itemDropRates).length > 0 && totalDropRate > 0; 
      case 2: return Object.values(config.itemQuantities).every(q => q.min <= q.max && q.min > 0);
      case 3: return config.cooldownPeriod > 0;
      case 4: return config.name.trim() !== '';
      default: return true;
    }
  };


  const [itemInput, setItemInput] = React.useState('');

  return (
    <Card title="Item Chest/Drop Configuration">
      <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm">
        This process is similar to Pokémon Spawn Configuration. Set up how items are distributed or found.
      </p>
      <StepIndicator steps={itemConfigSteps} currentStep={currentStep} onStepClick={goToStep} />

      {saveStatus && (
        <div className={`my-4 p-3 rounded-md text-sm flex items-center ${saveStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
          {saveStatus.type === 'error' && <AlertCircle size={18} className="mr-2"/>}
          {saveStatus.message}
        </div>
      )}

      <div className="mt-6 min-h-[300px]">
        {currentStep === 0 && (
           <div>
            <h3 className="text-lg font-medium mb-2">Step 1: Select Channels</h3>
            {!loadedChannels.length && !isLoadingChannels ? (
              <Button onClick={handleLoadChannels} isLoading={isLoadingChannels} leftIcon={<PlusCircle size={16}/>}>
                Load Discord Channels
              </Button>
            ) : isLoadingChannels ? (
                 <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500 mr-2"></div>
                    Loading channels...
                </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Select channels for this item configuration:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md dark:border-neutral-700">
                {loadedChannels.map(channel => (
                  <label key={channel.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 focus:ring-primary-500"
                      checked={config.selectedChannelIds.includes(channel.id)}
                      onChange={() => handleChannelSelection(channel.id)}
                      aria-labelledby={`channel-item-label-${channel.id}`}
                    />
                    <span id={`channel-item-label-${channel.id}`}>{channel.name}</span>
                  </label>
                ))}
                </div>
                 {config.selectedChannelIds.length === 0 && <p className="text-red-500 text-sm mt-1">Please select at least one channel.</p>}
              </div>
            )}
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Step 2: Items & Drop Rates</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Add items and their chance to drop. Total can exceed 100% if multiple items can drop from one event, or be less if there's a chance nothing drops.</p>
            <div className="flex gap-2 mb-3 items-end">
                <Select
                    label="Item Name"
                    options={MOCK_ITEM_NAMES.filter(name => !config.itemDropRates.hasOwnProperty(name)).map(name => ({label: name, value: name}))}
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    placeholder="Select or type item name"
                    containerClassName="flex-grow mb-0"
                    selectClassName="dark:bg-neutral-600"
                />
                <Button onClick={() => { handleAddItemToList(itemInput); setItemInput('');}} leftIcon={<PlusCircle size={16}/>} variant="secondary" disabled={!itemInput.trim()}>Add Item</Button>
            </div>
            <p className={`text-md font-semibold mb-3 ${totalDropRate > 100 && Object.keys(config.itemDropRates).length > 1 ? 'text-yellow-500' : 'text-green-500'}`}> 
              Total Drop Rate Sum: {totalDropRate}%
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Object.entries(config.itemDropRates).map(([itemName, rate]) => (
                <div key={itemName} className="flex items-center gap-2 p-2 border rounded-md dark:border-neutral-700">
                  <span className="flex-grow text-neutral-700 dark:text-neutral-300">{itemName}</span>
                  <Input label={`Rate for ${itemName}`} aria-label={`Drop rate for ${itemName}`} type="number" value={rate} onChange={e => handleItemRateChange(itemName, e.target.value)} min="0" max="100" containerClassName="mb-0 w-24" inputClassName="text-right" />
                  <span className="text-neutral-500 dark:text-neutral-400">%</span>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveItemFromList(itemName)} className="p-1" aria-label={`Remove ${itemName}`}>
                    <Trash2 size={14} className="text-red-500 hover:text-red-700" />
                  </Button>
                </div>
              ))}
            </div>
            {Object.keys(config.itemDropRates).length === 0 && <p className="text-red-500 text-sm mt-2">Please add at least one item.</p>}
             {totalDropRate === 0 && Object.keys(config.itemDropRates).length > 0 && <p className="text-red-500 text-sm mt-2">Total drop rate sum must be greater than 0 if items are listed.</p>}
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Step 3: Item Quantities</h3>
             <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Define the minimum and maximum quantity for each item when it drops.</p>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Object.keys(config.itemQuantities).map(itemName => (
                 (config.itemDropRates[itemName] !== undefined) && // Only show quantity if item is in drop rates
                <div key={itemName} className="grid grid-cols-1 sm:grid-cols-3 items-end gap-2 p-2 border rounded-md dark:border-neutral-700">
                  <span className="text-neutral-700 dark:text-neutral-300 col-span-1 sm:col-span-1">{itemName}</span>
                  <Input label={`Min Qty for ${itemName}`} aria-label={`Minimum quantity for ${itemName}`} type="number" value={config.itemQuantities[itemName]?.min || 1} onChange={e => handleItemQuantityChange(itemName, 'min', e.target.value)} min="1" containerClassName="mb-0" />
                  <Input label={`Max Qty for ${itemName}`} aria-label={`Maximum quantity for ${itemName}`} type="number" value={config.itemQuantities[itemName]?.max || 1} onChange={e => handleItemQuantityChange(itemName, 'max', e.target.value)} min={config.itemQuantities[itemName]?.min || 1} containerClassName="mb-0" />
                </div>
              ))}
            </div>
            {!Object.entries(config.itemQuantities).filter(([name]) => config.itemDropRates[name] !== undefined).every(([,q]) => q.min <= q.max && q.min > 0) && <p className="text-red-500 text-sm mt-2">Min quantity must be greater than 0 and less than or equal to Max quantity for all listed items.</p>}
          </div>
        )}
         {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Step 4: Timing / Cooldown</h3>
            <Input label="Cooldown Period (minutes)" type="number" name="cooldownPeriod" value={config.cooldownPeriod} onChange={handleInputChange} min="1" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Time before this item drop event can occur again in the selected channels.</p>
          </div>
        )}
        {currentStep === 4 && (
           <div>
            <h3 className="text-lg font-medium mb-2">Step 5: Finalize and Save Configuration</h3>
            <Input label="Configuration Name" type="text" name="name" value={config.name} onChange={handleInputChange} placeholder="e.g., Daily Login Bonus Chest" />
            <div className="mt-4">
                <label className="flex items-center">
                    <input type="checkbox" name="isEnabled" checked={config.isEnabled === undefined ? true : config.isEnabled} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Enable this item configuration</span>
                </label>
            </div>
             {!config.name.trim() && <p className="text-red-500 text-sm mt-2">Configuration name is required.</p>}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={prevStep} disabled={isFirstStep || isSavingConfig} variant="outline">
          Previous
        </Button>
        {!isLastStep ? (
          <Button onClick={nextStep} disabled={!currentStepIsValid() || isSavingConfig}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSaveConfig} 
            leftIcon={isSavingConfig ? undefined : <Save size={16}/>} 
            disabled={!currentStepIsValid() || isSavingConfig}
            isLoading={isSavingConfig}
            variant="primary"
          >
            {isSavingConfig ? 'Saving...' : 'Save Item Config'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ItemsConfigPage;
