
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './dashboard/layout/Layout';
import DashboardPage from '../pages/pokemon/DashboardPage'; 
import SettingsPage from '../pages/dashboard/SettingsPage';  
import ControlTerminalPage from '../pages/dashboard/ControlTerminalPage';
import SpawnConfigPage from '../pages/pokemon/SpawnConfigPage'; 
import UserManagementPage from '../pages/pokemon/UserManagementPage'; 
import ItemsConfigPage from '../pages/pokemon/ItemsConfigPage'; 
import PokedexPage from '../pages/pokemon/PokedexPage'; 
import PokemonDetailPage from '../pages/pokemon/PokemonDetailPage';  
import ShopSetupPage from '../pages/pokemon/ShopSetupPage'; 
import CpuSetupPage from '../pages/pokemon/CpuSetupPage'; 
import EventSchedulerPage from '../pages/pokemon/EventSchedulerPage'; 
import DiscordListenerPage from '../pages/discord-listener/DiscordListenerPage'; 
import MyUploadsPage from '../pages/ui-customization/MyUploadsPage'; 
import CustomizePage from '../pages/ui-customization/CustomizePage'; 
import ColorfyPage from '../pages/ui-customization/ColorfyPage'; 

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Redirect /dashboard/overview to /dashboard for canonical URL */}
        <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} /> 
        <Route path="/dashboard/control-terminal" element={<ControlTerminalPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        
        <Route path="/pokemon/spawn-config" element={<SpawnConfigPage />} />
        <Route path="/pokemon/user-management" element={<UserManagementPage />} />
        <Route path="/pokemon/items-config" element={<ItemsConfigPage />} />
        <Route path="/pokemon/pokedex" element={<PokedexPage />} />
        <Route path="/pokemon/pokedex/:pokemonName" element={<PokemonDetailPage />} /> 
        <Route path="/pokemon/shop-setup" element={<ShopSetupPage />} />
        <Route path="/pokemon/cpu-setup" element={<CpuSetupPage />} />
        <Route path="/pokemon/event-scheduler" element={<EventSchedulerPage />} />

        <Route path="/discord-listener" element={<DiscordListenerPage />} /> 

        <Route path="/ui/my-uploads" element={<MyUploadsPage />} />
        <Route path="/ui/customize" element={<CustomizePage />} />
        <Route path="/ui/colorfy" element={<ColorfyPage />} />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;