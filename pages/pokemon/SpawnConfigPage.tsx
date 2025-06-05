
import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import StepIndicator from '../../ui/StepIndicator';
import useStepForm from '../../useStepForm';
import { MOCK_CHANNELS, DEFAULT_SHINY_CHANCE, POKEMON_RARITIES, MOCK_POKEMON_NAMES } from '../../constants';
import { Channel, SpawnConfig } from '../../types';
import { PlusCircle, Trash2, Save, Play, Timer, AlertCircle, Percent, Hash, Edit3, Star } from 'lucide-react';

const spawnConfigSteps = [
  { id: 'channels', name: 'Channels' },
  { id: 'timing', name: 'Timing' },
  { id: 'shiny', name: 'Shiny Chance' },
  { id: 'roster', name: 'Pokémon Roster' },
  { id: 'percentages', name: 'Rarity %' },
  { id: 'finalize', name: 'Finalize & Save' },
];

const InitialSpawnConfigState: SpawnConfig = {
  name: '',
  selectedChannelIds: [],
  timeBetweenSpawns: 30, // minutes
  timeToFlee: 15, // minutes
  shinyChance: DEFAULT_SHINY_CHANCE,
  pokemonRoster: POKEMON_RARITIES.reduce((acc, rarity) => ({ ...acc, [rarity]: [] }), {}),
  rarityPercentages: POKEMON_RARITIES.reduce((acc, rarity) => ({ ...acc, [rarity]: 0 }), {}),
  isEnabled: true,
};

const SpawnConfigPage: React.FC = () => {
  const [config, setConfig] = useState<SpawnConfig>(InitialSpawnConfigState);
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep } = useStepForm({ totalSteps: spawnConfigSteps.length });
  const [loadedChannels, setLoadedChannels] = useState<Channel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pokemonInput, setPokemonInput] = useState('');
  const [selectedRarityForInput, setSelectedRarityForInput] = useState(POKEMON_RARITIES[0]);

  useEffect(() => {
    // Pre-load channels if needed, or when a specific step is reached.
  }, []);

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
    const isNumber = type === 'number';
    if (name === 'isEnabled') {
        const { checked } = e.target as HTMLInputElement;
        setConfig(prev => ({ ...prev, isEnabled: checked }));
    } else {
        setConfig(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) : value }));
    }
  };

  const handlePokemonAddToRoster = () => {
    if (!pokemonInput.trim() || !selectedRarityForInput) return;
    setConfig(prev => ({
      ...prev,
      pokemonRoster: {
        ...prev.pokemonRoster,
        [selectedRarityForInput]: [...new Set([...(prev.pokemonRoster[selectedRarityForInput] || []), pokemonInput.trim()])],
      }
    }));
    setPokemonInput(''); // Clear input after adding
  };

  const handlePokemonRemoveFromRoster = (rarity: string, pokemonName: string) => {
    setConfig(prev => ({
      ...prev,
      pokemonRoster: {
        ...prev.pokemonRoster,
        [rarity]: (prev.pokemonRoster[rarity] || []).filter(p => p !== pokemonName),
      }
    }));
  };

  const handleRarityPercentageChange = (rarity: string, percentage: string) => {
    const numPercentage = parseInt(percentage, 10) || 0;
    setConfig(prev => ({
      ...prev,
      rarityPercentages: {
        ...prev.rarityPercentages,
        [rarity]: Math.max(0, Math.min(100, numPercentage)),
      }
    }));
  };
  
  const totalRarityPercentage = useMemo(() => {
    return Object.values(config.rarityPercentages).reduce((sum, p) => sum + (p || 0), 0);
  }, [config.rarityPercentages]);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setSaveStatus(null);
    console.log("Attempting to save config (mock):", config);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      // Mock success
      setSaveStatus({ type: 'success', message: `Configuration "${config.name}" saved successfully (mock)!` });
      // Optionally, reset form or navigate away
      // setConfig(InitialSpawnConfigState);
      // goToStep(0);
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: `Error saving configuration (mock): ${error.message}` });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const currentStepIsValid = () => {
    switch(currentStep) {
      case 0: return loadedChannels.length > 0 && config.selectedChannelIds.length > 0;
      case 1: return config.timeBetweenSpawns > 0 && config.timeToFlee > 0;
      case 2: return config.shinyChance.trim() !== '' && /^\d+\s*\/\s*\d+$/.test(config.shinyChance); 
      case 3: return POKEMON_RARITIES.some(r => config.pokemonRoster[r] && config.pokemonRoster[r].length > 0); 
      case 4: return totalRarityPercentage === 100; 
      case 5: return config.name.trim() !== '';
      default: return true;
    }
  };

  return (
    <Card title="Pokémon Spawn Configuration">
      <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm">
        Configure how and where Pokémon appear for users. Follow the steps to create or edit a spawn setting.
      </p>
      <StepIndicator steps={spawnConfigSteps} currentStep={currentStep} onStepClick={goToStep} />

      {saveStatus && (
        <div className={`my-4 p-3 rounded-md text-sm flex items-center ${saveStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
          {saveStatus.type === 'error' && <AlertCircle size={18} className="mr-2"/>}
          {saveStatus.message}
        </div>
      )}

      <div className="mt-6 min-h-[350px]">
        {currentStep === 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Hash size={20} className="mr-2 text-primary-500"/>Step 1: Select Channels</h3>
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
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Select channels for this spawn configuration:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md dark:border-neutral-700">
                {loadedChannels.map(channel => (
                  <label key={channel.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 focus:ring-primary-500"
                      checked={config.selectedChannelIds.includes(channel.id)}
                      onChange={() => handleChannelSelection(channel.id)}
                      aria-labelledby={`channel-label-${channel.id}`}
                    />
                    <span id={`channel-label-${channel.id}`}>{channel.name}</span>
                  </label>
                ))}
                </div>
                {config.selectedChannelIds.length === 0 && <p className="text-red-500 dark:text-red-400 text-sm mt-1">Please select at least one channel.</p>}
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Timer size={20} className="mr-2 text-primary-500"/>Step 2: Timing Settings</h3>
            <Input label="Time Between Spawns (minutes)" type="number" name="timeBetweenSpawns" value={config.timeBetweenSpawns} onChange={handleInputChange} min="1" />
            <Input label="Time To Flee (minutes)" type="number" name="timeToFlee" value={config.timeToFlee} onChange={handleInputChange} min="1" />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Star size={20} className="mr-2 text-primary-500"/>Step 3: Shiny Chance</h3>
            <Input label="Shiny Chance (e.g., 1/4096)" type="text" name="shinyChance" value={config.shinyChance} onChange={handleInputChange} placeholder="e.g., 1/4096 or 1 / 4096" />
             {!/^\d+\s*\/\s*\d+$/.test(config.shinyChance) && config.shinyChance.trim() !== '' && <p className="text-red-500 dark:text-red-400 text-sm mt-1">Format must be 'number/number'.</p>}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Edit3 size={20} className="mr-2 text-primary-500"/>Step 4: Pokémon Roster</h3>
            <div className="flex gap-2 mb-4 items-end">
              <Select
                label="Rarity Tier"
                options={POKEMON_RARITIES.map(r => ({ label: r, value: r }))}
                value={selectedRarityForInput}
                onChange={(e) => setSelectedRarityForInput(e.target.value)}
                containerClassName="flex-grow mb-0"
              />
              <Input
                label="Pokémon Name"
                type="text"
                value={pokemonInput}
                onChange={(e) => setPokemonInput(e.target.value)}
                placeholder="Enter Pokémon name"
                list="pokemon-names-datalist"
                containerClassName="flex-grow mb-0"
              />
              <datalist id="pokemon-names-datalist">
                {MOCK_POKEMON_NAMES.map(name => <option key={name} value={name} />)}
              </datalist>
              <Button onClick={handlePokemonAddToRoster} leftIcon={<PlusCircle size={16} />} disabled={!pokemonInput.trim()}>Add</Button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {POKEMON_RARITIES.map(rarity => (
                (config.pokemonRoster[rarity] && config.pokemonRoster[rarity].length > 0) && (
                  <div key={rarity}>
                    <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mb-1">{rarity}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {config.pokemonRoster[rarity].map(pokemon => (
                        <li key={`${rarity}-${pokemon}`} className="flex justify-between items-center text-sm">
                          <span>{pokemon}</span>
                          <Button variant="ghost" size="sm" onClick={() => handlePokemonRemoveFromRoster(rarity, pokemon)} aria-label={`Remove ${pokemon}`}>
                            <Trash2 size={14} className="text-red-500 hover:text-red-700"/>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
            {!POKEMON_RARITIES.some(r => config.pokemonRoster[r] && config.pokemonRoster[r].length > 0) && <p className="text-red-500 dark:text-red-400 text-sm mt-1">Please add at least one Pokémon to the roster.</p>}
          </div>
        )}
        
        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Percent size={20} className="mr-2 text-primary-500"/>Step 5: Rarity Percentages</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Assign spawn percentages for each rarity. Total must be 100%.</p>
            <div className="space-y-2">
              {POKEMON_RARITIES.map(rarity => (
                <div key={rarity} className="flex items-center gap-2">
                  <label htmlFor={`rarity-${rarity}`} className="w-28 text-sm text-neutral-700 dark:text-neutral-300">{rarity}:</label>
                  <Input id={`rarity-${rarity}`} type="number" value={config.rarityPercentages[rarity] || 0} onChange={e => handleRarityPercentageChange(rarity, e.target.value)} min="0" max="100" containerClassName="flex-grow mb-0" inputClassName="text-right"/>
                  <span className="text-neutral-500 dark:text-neutral-400">%</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 font-semibold text-right ${totalRarityPercentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              Total: {totalRarityPercentage}%
            </div>
            {totalRarityPercentage !== 100 && <p className="text-red-500 dark:text-red-400 text-sm mt-1 text-right">Total percentage must be exactly 100%.</p>}
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center"><Save size={20} className="mr-2 text-primary-500"/>Step 6: Finalize & Save</h3>
            <Input label="Configuration Name" type="text" name="name" value={config.name} onChange={handleInputChange} placeholder="e.g., Viridian Forest Spawns" />
            {!config.name.trim() && <p className="text-red-500 dark:text-red-400 text-sm mt-1">Configuration name is required.</p>}
            <div className="mt-4">
                <label className="flex items-center">
                    <input type="checkbox" name="isEnabled" checked={config.isEnabled} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Enable this spawn configuration</span>
                </label>
            </div>
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
            leftIcon={isSavingConfig ? undefined : <Play size={16}/>} 
            disabled={!currentStepIsValid() || isSavingConfig}
            isLoading={isSavingConfig}
            variant="primary"
          >
            {isSavingConfig ? 'Saving...' : 'Save & Activate Config'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SpawnConfigPage;
