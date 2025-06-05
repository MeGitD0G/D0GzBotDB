
import { NavItemConfig, AIDifficulty } from '../../types';
import { LayoutDashboard, Bug, Palette, Settings, ShieldQuestion, ShoppingCart, Swords, Brain, UploadCloud, Users, Gift, BookOpen, Ear, Bot, CalendarClock } from 'lucide-react'; // Added missing icons used in root constants

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard', // Path for parent group highlighting
    icon: LayoutDashboard,
    subItems: [
      { id: 'dashboard-overview', label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
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

// Added MOCK_CHANNELS to this file to address the specific error.
// Ideally, this file should be removed and all imports should point to the root constants.ts.
export const MOCK_CHANNELS = [
  { id: 'channel-1', name: 'general' },
  { id: 'channel-2', name: 'pokemon-spawns' },
  { id: 'channel-3', name: 'battle-zone-alpha' },
  { id: 'channel-4', name: 'trading-hub' },
  { id: 'channel-5', name: 'event-arena' },
  { id: 'channel-6', name: 'off-topic-chat' },
  { id: 'channel-7', name: 'moderator-logs'},
];


// Other constants from the root constants.ts are NOT included here to keep the change minimal
// and to highlight that this file is likely redundant or incorrectly scoped.
// For example, DEFAULT_SHINY_CHANCE, POKEMON_RARITIES, AI_DIFFICULTY_LEVELS, etc.,
// are in the root constants.ts.

// If this file (dashboard/layout/constants.ts) is meant to be the primary source,
// it should be fully populated or deleted in favor of the root constants.ts.
// This change is a targeted fix for the "MOCK_CHANNELS not exported by '@/constants'" error
// under the assumption that '@/constants' somehow resolves to this specific file.

export const DEFAULT_SHINY_CHANCE = '1/4096'; // Added as it's simple and often used

export const POKEMON_RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical']; // Added as it's simple

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

// MOCK_POKEMON_NAMES, MOCK_ITEM_NAMES, MOCK_NPC_NAMES, POKEMON_TYPES, EVENT_TYPES_OPTIONS, etc.
// are intentionally omitted here to keep the diff small and focused on MOCK_CHANNELS,
// but this illustrates the incompleteness of this constants file if it were to be relied upon.
// Ideally, this file (dashboard/layout/constants.ts) should be deleted and all files should use `../../constants` (or similar)
// to refer to the main `constants.ts` at the project root.
