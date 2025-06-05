
import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select'; 
import useStepForm from '../../useStepForm'; 
import StepIndicator from '../../ui/StepIndicator'; 
import { MOCK_CHANNELS, AI_DIFFICULTY_LEVELS, MOCK_POKEMON_NAMES, MOCK_NPC_NAMES, POKEMON_TYPES, MOCK_ITEM_NAMES } from '../../constants';
import { Channel, AIConfig, AIDifficulty, AIPokemonSlot, BattleUISettings, AIRewardItem } from '../../types';
import { PlusCircle, Trash2, Save, Palette, Zap, Clock, UserPlus, ShieldCheck, ChevronRight, ChevronLeft, Bot, Image as ImageIconProp, DollarSign, Gift, AlertCircle, HelpCircle } from 'lucide-react';

const cpuSetupSteps = [
  { id: 'ui', name: 'Battle UI' },
  { id: 'aiList', name: 'AI Battlers' },
];

const initialBattleUISettings: BattleUISettings = {
  backgroundColor: '#F3F4F6', 
  accentColor: '#3B82F6', 
  battleSpeed: 1,
  turnTimeLimit: 30,
};

const initialNewAIConfig: Omit<AIConfig, 'id'> = {
  aiName: '',
  avatarUrl: '',
  pokemonSlots: Array(6).fill(null).map(() => ({ pokemonName: '', isRandom: false })), 
  difficulty: AIDifficulty.BEGINNER,
  itemRewards: [],
  minGoldReward: 10,
  maxGoldReward: 50,
  allowedChannelIds: [],
};

interface AiBattlerFormProps {
  aiConfig: AIConfig | Omit<AIConfig, 'id'>;
  onSave: (config: AIConfig | Omit<AIConfig, 'id'>) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSavingAI: boolean;
}

const AiBattlerForm: React.FC<AiBattlerFormProps> = ({ aiConfig, onSave, onCancel, isEditing, isSavingAI }) => {
  const [currentAI, setCurrentAI] = useState({...aiConfig}); 
  const [pokemonSprites, setPokemonSprites] = useState<(string | null)[]>(Array(6).fill(null));
  
  const fetchPokemonSprite = async (pokemonName: string): Promise<string | null> => {
    if (!pokemonName || typeof pokemonName !== 'string' || pokemonName.trim() === '') return null;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`);
      if (!response.ok) {
        console.warn(`Sprite not found for ${pokemonName}`);
        return null;
      }
      const data = await response.json();
      return data.sprites?.front_default || null;
    } catch (error) {
      console.error(`Error fetching sprite for ${pokemonName}:`, error);
      return null;
    }
  };

  useEffect(() => { 
    setCurrentAI({...aiConfig});
    const loadInitialSprites = async () => {
      if (aiConfig.pokemonSlots) {
        const newSprites = await Promise.all(
          aiConfig.pokemonSlots.map(slot => 
            slot.isRandom || !slot.pokemonName ? null : fetchPokemonSprite(slot.pokemonName)
          )
        );
        setPokemonSprites(newSprites);
      }
    };
    loadInitialSprites();
  }, [aiConfig]);

  const aiFormSteps = [
    { id: 'details', name: 'Details' },
    { id: 'pokemon', name: 'Pokémon Team' },
    { id: 'rewards', name: 'Rewards & Channels' },
  ];
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep, goToStep } = useStepForm({ totalSteps: aiFormSteps.length });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'difficulty') {
      setCurrentAI(prev => ({ ...prev, difficulty: value as AIDifficulty }));
    } else if (name === 'minGoldReward' || name === 'maxGoldReward') {
       setCurrentAI(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    }
    else {
      setCurrentAI(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePokemonSlotChange = async (index: number, field: keyof AIPokemonSlot, value: string | boolean) => {
    const newSlots = [...currentAI.pokemonSlots];
    const currentSlot = { ...newSlots[index] };
  
    if (field === 'pokemonName' && typeof value === 'string') {
      currentSlot.pokemonName = value;
      if (value.trim() && !currentSlot.isRandom) {
        const sprite = await fetchPokemonSprite(value);
        setPokemonSprites(prevSprites => {
          const updatedSprites = [...prevSprites];
          updatedSprites[index] = sprite;
          return updatedSprites;
        });
      } else {
        setPokemonSprites(prevSprites => {
          const updatedSprites = [...prevSprites];
          updatedSprites[index] = null;
          return updatedSprites;
        });
      }
    } else if (field === 'isRandom' && typeof value === 'boolean') {
      currentSlot.isRandom = value;
      if (value) { // If random is checked, clear specific Pokémon and its sprite
        currentSlot.pokemonName = '';
        setPokemonSprites(prevSprites => {
          const updatedSprites = [...prevSprites];
          updatedSprites[index] = null;
          return updatedSprites;
        });
      } else if (currentSlot.pokemonName.trim()) { // If unchecking random and a name exists, try to fetch sprite
          const sprite = await fetchPokemonSprite(currentSlot.pokemonName);
          setPokemonSprites(prevSprites => {
              const updatedSprites = [...prevSprites];
              updatedSprites[index] = sprite;
              return updatedSprites;
          });
      }
    }
  
    newSlots[index] = currentSlot;
    setCurrentAI(prev => ({ ...prev, pokemonSlots: newSlots }));
  };
  
  const handleChannelSelection = (channelId: string) => {
    setCurrentAI(prev => ({
      ...prev,
      allowedChannelIds: prev.allowedChannelIds.includes(channelId)
        ? prev.allowedChannelIds.filter(id => id !== channelId)
        : [...prev.allowedChannelIds, channelId]
    }));
  };

  const handleItemRewardChange = (index: number, field: keyof AIRewardItem, value: string | number) => {
    const newRewards = currentAI.itemRewards.map((reward, i) =>
        i === index ? { ...reward, [field]: field === 'itemName' ? value : Number(value) } : reward
    );
    setCurrentAI(prev => ({...prev, itemRewards: newRewards}));
  };

  const addItemReward = () => {
    setCurrentAI(prev => ({...prev, itemRewards: [...prev.itemRewards, {itemName: MOCK_ITEM_NAMES[0], minAmount: 1, maxAmount:1}]}));
  };
  const removeItemReward = (index: number) => {
    setCurrentAI(prev => ({...prev, itemRewards: prev.itemRewards.filter((_, i) => i !== index)}));
  };


  const currentAIStepIsValid = () => {
    switch(currentStep) {
      case 0: return currentAI.aiName.trim() !== '' && currentAI.avatarUrl.trim() !== '' && /^https?:\/\/.+\..+/.test(currentAI.avatarUrl); // Basic URL validation
      case 1: return currentAI.pokemonSlots.some(s => s.pokemonName.trim() !== '' || s.isRandom); 
      case 2: return currentAI.minGoldReward <= currentAI.maxGoldReward && currentAI.allowedChannelIds.length > 0 && currentAI.itemRewards.every(r => r.itemName && r.minAmount > 0 && r.maxAmount >= r.minAmount);
      default: return true;
    }
  }


  return (
    <Card title={isEditing ? `Edit ${currentAI.aiName || 'AI'}` : "Add New AI Battler"} className="mt-4 border border-primary-500 dark:border-primary-700">
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 p-3 bg-neutral-100 dark:bg-neutral-750 rounded-lg shadow">
          {currentAI.avatarUrl ? (
            <img src={currentAI.avatarUrl} alt={currentAI.aiName || 'AI Avatar'} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-primary-500 shadow-md" />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center text-neutral-400 dark:text-neutral-500 border-2 border-neutral-300 dark:border-neutral-500 shadow-md">
              <ImageIconProp size={40} />
            </div>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-1 items-center">
            {currentAI.pokemonSlots.map((slot, index) => (
              <div 
                key={`slot-preview-${index}`} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center border border-neutral-300 dark:border-neutral-500 shadow-sm"
                title={slot.isRandom ? "Random Pokémon" : slot.pokemonName || `Empty Slot ${index+1}`}
                >
                {slot.isRandom ? (
                  <HelpCircle size={24} className="text-neutral-500 dark:text-neutral-400"/>
                ) : pokemonSprites[index] ? (
                  <img src={pokemonSprites[index]!} alt={slot.pokemonName || `Slot ${index + 1}`} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                ) : slot.pokemonName && slot.pokemonName.trim() !== '' ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse bg-neutral-300 dark:bg-neutral-500 rounded"></div> 
                ) : (
                  <div className="text-xs text-neutral-400 dark:text-neutral-500">{index + 1}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <StepIndicator steps={aiFormSteps} currentStep={currentStep} onStepClick={goToStep} className="py-2"/>
        <div className="py-4 min-h-[350px]">
        {currentStep === 0 && ( 
            <div className="space-y-4">
                 <Select
                    label="AI Battler Name (Preset or Custom)"
                    name="aiName"
                    id="aiName"
                    options={MOCK_NPC_NAMES.map(name => ({ label: name, value: name }))}
                    value={currentAI.aiName}
                    onChange={handleInputChange}
                    placeholder="Select or type custom name..."
                />
                <Input 
                    label="Avatar URL" 
                    name="avatarUrl" 
                    id="avatarUrl" 
                    value={currentAI.avatarUrl} 
                    onChange={handleInputChange} 
                    placeholder="e.g., https://m.bulbapedia.bulbagarden.net/...png"
                    type="url"
                />
                {!/^https?:\/\/.+\..+/.test(currentAI.avatarUrl) && currentAI.avatarUrl.trim() !== '' && <p className="text-red-500 text-sm">Please enter a valid URL.</p>}
                 <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Find avatars at: <a href="https://m.bulbapedia.bulbagarden.net/wiki/Browse:Characters" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Bulbapedia Characters</a>
                </p>
                <Select
                    label="Difficulty Level"
                    name="difficulty"
                    id="aiDifficulty"
                    options={AI_DIFFICULTY_LEVELS}
                    value={currentAI.difficulty}
                    onChange={handleInputChange}
                />
            </div>
        )}
        {currentStep === 1 && ( 
            <div className="space-y-3">
                <h4 className="text-md font-semibold">Configure Pokémon Team (6 Slots)</h4>
                <datalist id="pokemon-names-all-slots">
                    {MOCK_POKEMON_NAMES.map(name => <option key={name} value={name} />)}
                </datalist>
                {currentAI.pokemonSlots.map((slot, index) => (
                    <div key={index} className="p-3 border rounded-md dark:border-neutral-600 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                        <Input
                            label={`Slot ${index + 1} Pokémon`}
                            id={`pokemon-slot-${index}`}
                            type="text"
                            value={slot.pokemonName}
                            onChange={e => handlePokemonSlotChange(index, 'pokemonName', e.target.value)}
                            placeholder="Type Pokémon name"
                            disabled={slot.isRandom}
                            list="pokemon-names-all-slots"
                            containerClassName="sm:col-span-2 mb-0"
                            inputClassName="dark:bg-neutral-700"
                        />
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 self-center pb-1"> 
                            <label className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 focus:ring-primary-500"
                                    checked={slot.isRandom}
                                    onChange={e => handlePokemonSlotChange(index, 'isRandom', e.target.checked)}
                                    id={`pokemon-slot-${index}-random`}
                                />
                                <span className="ml-2 text-neutral-700 dark:text-neutral-300">Random</span>
                            </label>
                        </div>
                    </div>
                ))}
                {!currentAI.pokemonSlots.some(s => s.pokemonName.trim() !== '' || s.isRandom) && <p className="text-red-500 text-sm mt-1">Assign at least one Pokémon or mark slots as random.</p>}
            </div>
        )}
        {currentStep === 2 && ( 
            <div className="space-y-4">
                 <h4 className="text-md font-semibold">Rewards</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Min Gold Reward" name="minGoldReward" id="minGoldReward" type="number" value={currentAI.minGoldReward} onChange={handleInputChange} min="0"/>
                    <Input label="Max Gold Reward" name="maxGoldReward" id="maxGoldReward" type="number" value={currentAI.maxGoldReward} onChange={handleInputChange} min={currentAI.minGoldReward || 0}/>
                 </div>
                  {currentAI.minGoldReward > currentAI.maxGoldReward && <p className="text-red-500 text-sm">Min gold should not exceed max gold.</p>}
                 <h5 className="text-sm font-semibold">Item Rewards</h5>
                 {currentAI.itemRewards.map((reward, index) => (
                    <div key={index} className="flex flex-wrap gap-2 items-end border p-2 rounded dark:border-neutral-600">
                        <Select label="Item" id={`item-reward-name-${index}`} options={MOCK_ITEM_NAMES.map(i => ({label:i, value:i}))} value={reward.itemName} onChange={e => handleItemRewardChange(index, 'itemName', e.target.value)} containerClassName="flex-grow mb-0 min-w-[150px]"/>
                        <Input label="Min Amt" id={`item-reward-min-${index}`} type="number" value={reward.minAmount} onChange={e => handleItemRewardChange(index, 'minAmount', Number(e.target.value))} containerClassName="w-20 mb-0" min="1"/>
                        <Input label="Max Amt" id={`item-reward-max-${index}`} type="number" value={reward.maxAmount} onChange={e => handleItemRewardChange(index, 'maxAmount', Number(e.target.value))} containerClassName="w-20 mb-0" min={reward.minAmount || 1}/>
                        <Button variant="ghost" onClick={() => removeItemReward(index)} className="p-1 self-center mt-5 sm:mt-0" aria-label={`Remove item reward ${reward.itemName}`}><Trash2 size={16} className="text-red-500"/></Button>
                    </div>
                 ))}
                  {currentAI.itemRewards.some(r => r.minAmount <=0 || r.maxAmount < r.minAmount) && <p className="text-red-500 text-sm">Item amounts must be valid (min &gt; 0, max &gt;= min).</p>}
                 <Button onClick={addItemReward} variant="outline" size="sm" leftIcon={<PlusCircle size={14}/>}>Add Item Reward</Button>

                <h4 className="text-md font-semibold mt-4">Allowed Channels</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md dark:border-neutral-600">
                    {MOCK_CHANNELS.map(channel => (
                        <label key={channel.id} className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600 rounded" checked={currentAI.allowedChannelIds.includes(channel.id)} onChange={() => handleChannelSelection(channel.id)} id={`ai-channel-${channel.id}`}/>
                            <span id={`ai-channel-label-${channel.id}`}>{channel.name}</span>
                        </label>
                    ))}
                </div>
                 {currentAI.allowedChannelIds.length === 0 && <p className="text-red-500 text-sm">Select at least one channel for this AI.</p>}
            </div>
        )}
        </div>
      <div className="mt-6 flex justify-between p-4 border-t dark:border-neutral-700">
        <Button onClick={onCancel} variant="outline" disabled={isSavingAI}>Cancel</Button>
        <div>
            {!isFirstStep && <Button onClick={prevStep} variant="secondary" className="mr-2" leftIcon={<ChevronLeft size={16}/>} disabled={isSavingAI}>Back</Button>}
            {!isLastStep ? 
                <Button onClick={nextStep} disabled={!currentAIStepIsValid() || isSavingAI} rightIcon={<ChevronRight size={16}/>}>Next</Button> :
                <Button onClick={() => onSave(currentAI)} leftIcon={<Save size={16}/>} disabled={!currentAIStepIsValid() || isSavingAI} isLoading={isSavingAI}>Save AI</Button>
            }
        </div>
      </div>
    </Card>
  );
};


const CpuSetupPage: React.FC = () => {
  const [battleUISettings, setBattleUISettings] = useState<BattleUISettings>(initialBattleUISettings);
  const [aiBattlers, setAIBattlers] = useState<AIConfig[]>([]);
  const [editingAI, setEditingAI] = useState<AIConfig | Omit<AIConfig, 'id'> | null>(null);
  const [isAddingAI, setIsAddingAI] = useState(false);
  const [isSavingUI, setIsSavingUI] = useState(false);
  const [isSavingAI, setIsSavingAI] = useState(false);
  const [isLoadingAIs, setIsLoadingAIs] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ for: 'ui' | 'ai'; type: 'success' | 'error'; message: string } | null>(null);
  
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep, goToStep: goToMainStep } = useStepForm({ totalSteps: cpuSetupSteps.length });

  const handleUISettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setBattleUISettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSaveBattleUISettings = async () => {
    setIsSavingUI(true);
    setSaveStatus(null);
    console.log("Attempting to save Battle UI settings (mock):", battleUISettings);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        // Mock success
        setSaveStatus({ for: 'ui', type: 'success', message: "Battle UI settings saved successfully (mock)!" });
    } catch (error: any) {
        setSaveStatus({ for: 'ui', type: 'error', message: `Failed to save UI settings (mock): ${error.message}` });
    } finally {
        setIsSavingUI(false);
    }
  };
  
  const handleSaveAI = async (config: AIConfig | Omit<AIConfig, 'id'>) => {
    setIsSavingAI(true);
    setSaveStatus(null);
    const isExistingAI = 'id' in config && config.id;
    console.log(`Attempting to save AI (mock): ${isExistingAI ? 'Update' : 'Create'}`, config);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        const savedAI: AIConfig = {
            ...config,
            id: isExistingAI ? config.id : `mock-ai-${Date.now()}`, // Assign a mock ID if new
        };

        if (!isExistingAI) {
            setAIBattlers(prev => [...prev, savedAI]);
        } else {
            setAIBattlers(prev => prev.map(ai => ai.id === savedAI.id ? savedAI : ai));
        }
        setSaveStatus({ for: 'ai', type: 'success', message: `AI Battler "${savedAI.aiName}" saved successfully (mock)!` });
        setIsAddingAI(false);
        setEditingAI(null);
    } catch (error: any) {
         setSaveStatus({ for: 'ai', type: 'error', message: `Failed to save AI Battler (mock): ${error.message}` });
    } finally {
        setIsSavingAI(false);
    }
  };

  const handleEditAI = (ai: AIConfig) => {
    setEditingAI(JSON.parse(JSON.stringify(ai))); 
    setIsAddingAI(true); 
  };
  
  const handleRemoveAI = async (idToRemove: string) => {
    if (window.confirm("Are you sure you want to delete this AI battler (mock operation)?")) {
        console.log("Attempting to remove AI (mock):", idToRemove);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            setAIBattlers(prev => prev.filter(ai => ai.id !== idToRemove));
            setSaveStatus({ for: 'ai', type: 'success', message: "AI Battler deleted (mock)." });
        } catch (error: any) {
            setSaveStatus({ for: 'ai', type: 'error', message: `Failed to delete AI (mock): ${error.message}` });
        }
    }
  };

  useEffect(() => {
    const fetchAIBattlers = async () => {
        setIsLoadingAIs(true);
        setSaveStatus(null);
        console.log("Fetching AI battlers (mock)...");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const mockData: AIConfig[] = [
               { 
                id: 'mock-ai-1', 
                aiName: 'Champion Cynthia', 
                avatarUrl: 'https://archives.bulbagarden.net/media/upload/thumb/2/27/Cynthia_Masters.png/200px-Cynthia_Masters.png', 
                pokemonSlots: [
                    {pokemonName: 'Garchomp', isRandom: false},
                    {pokemonName: 'Lucario', isRandom: false},
                    {pokemonName: 'Milotic', isRandom: false},
                    {pokemonName: 'Spiritomb', isRandom: false},
                    {pokemonName: 'Togekiss', isRandom: false},
                    {pokemonName: 'Roserade', isRandom: false}
                ], 
                difficulty: AIDifficulty.POKEMON_MASTER, 
                itemRewards: [{itemName: "Masterball", minAmount: 1, maxAmount: 1}], 
                minGoldReward: 5000, 
                maxGoldReward: 10000, 
                allowedChannelIds: [MOCK_CHANNELS[2].id, MOCK_CHANNELS[4].id] 
               }
            ];
            setAIBattlers(mockData);
        } catch (error:any) {
            console.error("Error fetching AI battlers (mock):", error);
            setSaveStatus({ for: 'ai', type: 'error', message: `Could not load AI battlers (mock): ${error.message}` });
            setAIBattlers([]); 
        } finally {
            setIsLoadingAIs(false);
        }
    };
    fetchAIBattlers();
  }, []);


  return (
    <div className="space-y-6">
      <Card title="CPU Setup & Battle Configuration">
         <StepIndicator steps={cpuSetupSteps} currentStep={currentStep} onStepClick={goToMainStep} className="mb-6"/>

        {saveStatus && (
            <div className={`my-4 p-3 rounded-md text-sm flex items-center ${saveStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
            {saveStatus.type === 'error' && <AlertCircle size={18} className="mr-2"/>}
            {saveStatus.message}
            </div>
        )}

        {currentStep === 0 && (
            <Card title="Battle UI Customization" bodyClassName="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Battle Background Color" type="color" name="backgroundColor" id="backgroundColor" value={battleUISettings.backgroundColor} onChange={handleUISettingChange} inputClassName="h-10 w-full" />
                    <Input label="Battle Accent Color" type="color" name="accentColor" id="accentColor" value={battleUISettings.accentColor} onChange={handleUISettingChange} inputClassName="h-10 w-full"/>
                </div>
                <Input label="Battle Speed (e.g., 1, 1.5, 2)" type="number" name="battleSpeed" id="battleSpeed" value={battleUISettings.battleSpeed} onChange={handleUISettingChange} step="0.1" min="0.5" max="3"/>
                <Input label="Time Before Turn Loss (seconds)" type="number" name="turnTimeLimit" id="turnTimeLimit" value={battleUISettings.turnTimeLimit} onChange={handleUISettingChange} min="5" />
                <div className="text-right mt-4">
                    <Button onClick={handleSaveBattleUISettings} leftIcon={<Palette size={16}/>} isLoading={isSavingUI} disabled={isSavingUI}>Save UI Settings</Button>
                </div>
            </Card>
        )}
        
        {currentStep === 1 && (
             <Card title="AI Battlers Management">
                <div className="mb-4 flex justify-end">
                    <Button onClick={() => { setEditingAI(JSON.parse(JSON.stringify(initialNewAIConfig))); setIsAddingAI(true); }} leftIcon={<UserPlus size={16}/>} disabled={isAddingAI || isLoadingAIs}>
                        Add New AI Battler
                    </Button>
                </div>

                {isAddingAI && editingAI && (
                    <AiBattlerForm
                        aiConfig={editingAI}
                        onSave={handleSaveAI}
                        onCancel={() => { setIsAddingAI(false); setEditingAI(null); }}
                        isEditing={!!('id' in editingAI && editingAI.id)}
                        isSavingAI={isSavingAI}
                    />
                )}
                
                {isLoadingAIs && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                        <p className="ml-3 text-neutral-500 dark:text-neutral-400">Loading AI Battlers...</p>
                    </div>
                )}

                {!isAddingAI && !isLoadingAIs && aiBattlers.length === 0 && (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">No AI Battlers configured. Click "Add New AI Battler" to create one.</p>
                )}

                {!isAddingAI && !isLoadingAIs && aiBattlers.length > 0 && (
                    <div className="space-y-3 mt-4">
                        {aiBattlers.map(ai => (
                            <Card key={ai.id} title={ai.aiName} className="shadow-sm">
                                <div className="flex items-center space-x-4">
                                    {ai.avatarUrl && <img src={ai.avatarUrl} alt={ai.aiName} className="w-16 h-16 rounded-full object-cover bg-neutral-200 dark:bg-neutral-700"/>}
                                    {!ai.avatarUrl && <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center"><ImageIconProp size={32} className="text-neutral-400 dark:text-neutral-500"/></div>}
                                    <div>
                                        <p className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">{ai.aiName}</p>
                                        <p className="text-sm text-primary-600 dark:text-primary-400">{ai.difficulty}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Pokémon: {ai.pokemonSlots.filter(s => s.pokemonName || s.isRandom).length}/6</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t dark:border-neutral-700 flex justify-end space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditAI(ai)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => ai.id && handleRemoveAI(ai.id)}>Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        )}
        
        <div className="mt-8 flex justify-between">
            <Button onClick={prevStep} disabled={isFirstStep || isAddingAI || isLoadingAIs} variant="outline">Previous Section</Button>
            {!isLastStep ? 
                <Button onClick={nextStep} disabled={isAddingAI || isLoadingAIs}>Next Section</Button> :
                <Button onClick={() => alert("All CPU Setup sections viewed. Ensure all configurations are saved (mock operations).")} variant="primary" leftIcon={<ShieldCheck size={16}/>} disabled={isAddingAI || isLoadingAIs}>Finish CPU Setup</Button>
            }
        </div>
      </Card>
    </div>
  );
};

export default CpuSetupPage;
