import { NavItemConfig, AIDifficulty, EventType, EventRecurrence } from './types';
import { LayoutDashboard, Bug, Palette, Settings, ShieldQuestion, ShoppingCart, Swords, Brain, UploadCloud, Users, Gift, BookOpen, Ear, Bot, CalendarClock, TerminalSquare } from 'lucide-react';

export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
export const LATEST_RELEVANT_GAME_VERSION = "scarlet-violet"; // Used for move lists, flavor text etc. Fallback if not found.

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard', // Path for parent group highlighting
    icon: LayoutDashboard,
    subItems: [
      { id: 'dashboard-overview', label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { id: 'dashboard-control-terminal', label: 'Control Terminal', path: '/dashboard/control-terminal', icon: TerminalSquare },
      { id: 'dashboard-settings', label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ],
  },
  {
    id: 'pokemon',
    label: 'Pokemon',
    path: '/pokemon',
    icon: Bug,
    subItems: [
      { id: 'spawn-config', label: 'Spawn Config', path: '/pokemon/spawn-config', icon: Settings },
      { id: 'user-management', label: 'User Management', path: '/pokemon/user-management', icon: Users },
      { id: 'items-config', label: 'Items Config', path: '/pokemon/items-config', icon: Gift },
      { id: 'pokedex', label: 'Pokedex', path: '/pokemon/pokedex', icon: BookOpen },
      { id: 'shop-setup', label: 'Shop Setup', path: '/pokemon/shop-setup', icon: ShoppingCart },
      { id: 'cpu-setup', label: 'CPU Setup', path: '/pokemon/cpu-setup', icon: Brain },
      { id: 'event-scheduler', label: 'Event Scheduler', path: '/pokemon/event-scheduler', icon: CalendarClock },
    ],
  },
  {
    id: 'discord-listener',
    label: 'Discord Listener',
    path: '/discord-listener',
    icon: Ear,
  },
  {
    id: 'ui',
    label: 'UI Customization',
    path: '/ui',
    icon: Palette,
    subItems: [
      { id: 'my-uploads', label: 'My Uploads', path: '/ui/my-uploads', icon: UploadCloud },
      { id: 'customize', label: 'Customize', path: '/ui/customize', icon: Settings },
      { id: 'colorfy', label: 'Colorfy', path: '/ui/colorfy', icon: Palette },
    ],
  },
];

export const DEFAULT_SHINY_CHANCE = '1/4096';

export const POKEMON_RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'];

export const AI_DIFFICULTY_LEVELS: { label: string; value: AIDifficulty }[] = [
  { label: 'Beginner (Lv. 3-7)', value: AIDifficulty.BEGINNER },
  { label: 'Novice (Lv. 8-15)', value: AIDifficulty.NOVICE },
  { label: 'Intermediate (Lv. 16-25)', value: AIDifficulty.INTERMEDIATE },
  { label: 'Expert (Lv. 23-32)', value: AIDifficulty.EXPERT },
  { label: 'Professional (Lv. 33-45)', value: AIDifficulty.PROFESSIONAL },
  { label: 'League Challenger (Lv. 46-60)', value: AIDifficulty.LEAGUE_CHALLENGER },
  { label: 'Master\'s Apprentice (Lv. 60-79)', value: AIDifficulty.MASTERS_APPRENTICE },
  { label: 'Pokémon Master (Lv. 80-100)', value: AIDifficulty.POKEMON_MASTER },
];

export const MOCK_CHANNELS = [
  { id: 'channel-1', name: 'general' },
  { id: 'channel-2', name: 'pokemon-spawns' },
  { id: 'channel-3', name: 'battle-zone-alpha' },
  { id: 'channel-4', name: 'trading-hub' },
  { id: 'channel-5', name: 'event-arena' },
  { id: 'channel-6', name: 'off-topic-chat' },
  { id: 'channel-7', name: 'moderator-logs'},
];

export const MOCK_POKEMON_NAMES = [
  "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
  "Squirtle", "Wartortle", "Blastoise", "Pikachu", "Raichu", "Eevee", "Snorlax"
  // This list would ideally be much longer or fetched dynamically for suggestions
];

export const MOCK_ITEM_NAMES = [
  "Pokeball", "Greatball", "Ultraball", "Masterball", "Potion", "Super Potion", "Hyper Potion",
  "Revive", "Max Revive", "Full Heal", "Escape Rope", "Repel"
];

export const MOCK_NPC_NAMES = [
  "Youngster Joey", "Bug Catcher Rick", "Lass Susie", "Ace Trainer AI", "Gym Leader Brock", "Elite Four Lorelei"
];

export const MOCK_NPC_AVATARS_PATH = "https://m.bulbapedia.bulbagarden.net/wiki/File:"; // Placeholder base path
// Example: MOCK_NPC_AVATARS_PATH + "VSYoungster.png" (actual file names may vary)

export const POKEMON_TYPES = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
];

export const EVENT_TYPES_OPTIONS = Object.values(EventType).map(type => ({
  label: type,
  value: type,
}));

export const EVENT_RECURRENCE_OPTIONS = Object.values(EventRecurrence).map(type => ({
  label: type,
  value: type,
}));