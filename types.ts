import { LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  subItems?: NavItemConfig[];
}

export interface Channel {
  id: string;
  name: string;
}

export interface PokemonRarityEntry {
  pokemonName: string;
  rarityTier: string; // e.g., Common, Uncommon, Rare
}

export interface RaritySpawnPercentage {
  rarityTier: string;
  percentage: number;
}

export interface SpawnConfig {
  id?: string;
  name: string;
  selectedChannelIds: string[];
  timeBetweenSpawns: number; // in minutes or seconds
  timeToFlee: number; // in minutes or seconds
  shinyChance: string; // e.g., "1/4096"
  pokemonRoster: { [rarity: string]: string[] }; // E.g. { "Common": ["Pidgey", "Rattata"], "Rare": ["Pikachu"] }
  rarityPercentages: { [rarity: string]: number }; // E.g. { "Common": 70, "Uncommon": 25, "Rare": 5 }
  isEnabled: boolean;
}

export interface ItemConfig {
  // Similar to SpawnConfig, but for items
  id?: string;
  name: string;
  selectedChannelIds: string[];
  // ... other item specific fields
}

export enum AIDifficulty {
  BEGINNER = 'Beginner',
  NOVICE = 'Novice',
  INTERMEDIATE = 'Intermediate',
  EXPERT = 'Expert',
  PROFESSIONAL = 'Professional',
  LEAGUE_CHALLENGER = 'League Challenger',
  MASTERS_APPRENTICE = 'Masters Apprentice',
  POKEMON_MASTER = 'Pokemon Master',
}

export interface AIPokemonSlot {
  pokemonName: string;
  isRandom: boolean;
}

export interface AIRewardItem {
  itemName: string;
  minAmount: number;
  maxAmount: number;
}

export interface AIConfig {
  id?: string;
  aiName: string;
  avatarUrl: string;
  pokemonSlots: AIPokemonSlot[];
  difficulty: AIDifficulty;
  itemRewards: AIRewardItem[];
  minGoldReward: number;
  maxGoldReward: number;
  allowedChannelIds: string[];
}

export interface BattleUISettings {
  backgroundColor: string;
  accentColor: string;
  battleSpeed: number; // e.g., 1x, 1.5x, 2x
  turnTimeLimit: number; // in seconds
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  username?: string;
  command?: string;
  botReaction: string;
  type: 'command' | 'system' | 'error';
}

export interface PokemonBasicInfo {
  id: number;
  name: string;
  spriteUrl: string;
  types: string[];
}

// Types for PokemonDetailPage
interface APIResource { name: string; url: string; }

export interface StatInfo {
  base_stat: number;
  effort: number;
  stat: APIResource;
}

export interface AbilityInfo {
  ability: APIResource;
  is_hidden: boolean;
  slot: number;
}

export interface TypeInfo {
  slot: number;
  type: APIResource;
}

export interface SpriteInfo {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    dream_world: { front_default: string | null };
    home: { front_default: string | null; front_shiny: string | null; };
    'official-artwork': { front_default: string | null };
  };
  versions?: {
    [generation: string]: {
      [game: string]: {
        animated?: {
          front_default: string | null;
          front_shiny: string | null;
          back_default: string | null;
          back_shiny: string | null;
        };
        front_default: string | null;
        front_shiny: string | null;
        // ... other sprites
      };
    };
  };
}

export interface GameIndice {
  game_index: number;
  version: APIResource;
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: APIResource;
  version_group: APIResource;
}

export interface PokemonMove {
  move: APIResource;
  version_group_details: VersionGroupDetail[];
}

export interface PokemonDetailed {
  id: number;
  name: string;
  height: number; // decimeters
  weight: number; // hectograms
  stats: StatInfo[];
  types: TypeInfo[];
  abilities: AbilityInfo[];
  sprites: SpriteInfo;
  species: APIResource;
  moves: PokemonMove[];
  game_indices: GameIndice[];
  // ... other fields as needed
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: APIResource;
  version: APIResource;
}

export interface GeneraEntry {
  genus: string;
  language: APIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number; // Chance of being female in eights (e.g., 1 for 12.5% female, -1 for genderless)
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: APIResource;
  pokedex_numbers: Array<{ entry_number: number; pokedex: APIResource }>;
  egg_groups: APIResource[];
  color: APIResource;
  shape: APIResource;
  evolves_from_species: APIResource | null;
  evolution_chain: { url: string };
  habitat: APIResource | null;
  generation: APIResource;
  names: Array<{ name: string; language: APIResource }>;
  flavor_text_entries: FlavorTextEntry[];
  form_descriptions: Array<{ description: string; language: APIResource }>;
  genera: GeneraEntry[];
  varieties: Array<{ is_default: boolean; pokemon: APIResource }>;
}

export interface EvolutionDetail {
  item: APIResource | null;
  trigger: APIResource;
  gender: number | null;
  held_item: APIResource | null;
  known_move: APIResource | null;
  known_move_type: APIResource | null;
  location: APIResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: APIResource | null;
  party_type: APIResource | null;
  relative_physical_stats: number | null; // -1, 0, or 1
  time_of_day: string; // "day", "night"
  trade_species: APIResource | null;
  turn_upside_down: boolean;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: APIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  baby_trigger_item: APIResource | null;
  chain: EvolutionChainLink;
}

export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  contest_combos: any; // Define further if needed
  contest_type: APIResource | null;
  contest_effect: { url: string } | null;
  damage_class: APIResource; // physical, special, status
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: APIResource;
  }>;
  effect_changes: any[]; // Define further if needed
  learned_by_pokemon: APIResource[];
  generation: APIResource;
  machines: any[]; // Define further if needed
  meta: any; // Define further if needed
  names: Array<{ name: string; language: APIResource }>;
  past_values: any[]; // Define further if needed
  stat_changes: Array<{ change: number; stat: APIResource }>;
  super_contest_effect: { url: string } | null;
  target: APIResource;
  type: APIResource;
}

export interface FormattedMove {
  name: string;
  url: string;
  learnMethod: string;
  levelLearnedAt?: number;
}

export interface DiscordListenerEntry {
  id: string;
  timestamp: string;
  channelName: string;
  type: 'user-message' | 'bot-action' | 'system-notification';
  userName?: string;
  userAvatarUrl?: string;
  messageContent?: string;
  botActionDescription?: string;
  botName?: string;
  botAvatarUrl?: string;
}

export interface MessageSetting {
  enabled: boolean;
  channelId: string;
  message: string;
}

export interface DashboardSettings {
  welcomeMessage: MessageSetting;
  leavingMessage: MessageSetting;
  developmentModeEnabled: boolean;
  testApiKey: string;
  botToken: string;
  serverId: string;
}

// Event Scheduler Types
export enum EventType {
  SHINY_BOOST = 'Shiny Rate Boost',
  SPAWN_BOOST_POKEMON = 'Increased Spawn Rate (Specific Pokémon)',
  SPAWN_BOOST_TYPE = 'Increased Spawn Rate (Specific Type)',
  XP_BOOST = 'Experience Point Boost',
  ITEM_DROP_BOOST = 'Item Drop Rate Boost',
  CUSTOM = 'Custom Event',
}

export enum EventRecurrence {
  NONE = 'None',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export interface ScheduledEvent {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  boostPercentage?: number; 
  targetPokemonName?: string; 
  targetPokemonType?: string;
  customDetails?: string; 
  startDate: string; 
  endDate: string;   
  targetChannelIds: string[];
  recurrence: EventRecurrence;
  isEnabled: boolean;
}