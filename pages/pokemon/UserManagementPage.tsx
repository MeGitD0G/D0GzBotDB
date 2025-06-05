
import React from 'react';
import Card from '../../ui/Card';
import { UserSearch } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  // Mock data for users
  const mockUsers = [
    { id: 'user1', discordName: 'TrainerAsh', pokemonCount: 15, itemsCount: 50, gold: 1200 },
    { id: 'user2', discordName: 'MistyFan_01', pokemonCount: 8, itemsCount: 30, gold: 800 },
    { id: 'user3', discordName: 'BrockTheRock', pokemonCount: 22, itemsCount: 75, gold: 2500 },
    { id: 'user4', discordName: 'ShinyHunterGary', pokemonCount: 5, itemsCount: 100, gold: 5000, isShinyHunter: true },
  ];

  return (
    <Card title="Pokémon User Management">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Manage registered users, view their Pokémon, items, and other statistics.
        This section would typically include features like searching users, viewing detailed profiles, editing user data (e.g., adding/removing items, Pokémon, gold), and potentially banning or muting users.
      </p>
      
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by Discord name or ID..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md leading-5 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Discord Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Pokémon</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Items</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Gold</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.discordName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">{user.pokemonCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">{user.itemsCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">{user.gold.toLocaleString()} G</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">View Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        Full implementation would require backend integration for user data.
      </p>
    </Card>
  );
};

export default UserManagementPage;