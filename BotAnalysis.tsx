
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const commandsData = [
  { name: 'Jan', commands: 4000, users: 2400 },
  { name: 'Feb', commands: 3000, users: 1398 },
  { name: 'Mar', commands: 2000, users: 9800 },
  { name: 'Apr', commands: 2780, users: 3908 },
  { name: 'May', commands: 1890, users: 4800 },
  { name: 'Jun', commands: 2390, users: 3800 },
  { name: 'Jul', commands: 3490, users: 4300 },
];

const spawnData = [
  { name: 'Pikachu', spawned: 120, caught: 80 },
  { name: 'Charizard', spawned: 30, caught: 25 },
  { name: 'Eevee', spawned: 200, caught: 150 },
  { name: 'Snorlax', spawned: 50, caught: 40 },
  { name: 'Magikarp', spawned: 500, caught: 100 },
];

const BotAnalysis: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="text-md font-semibold mb-4 text-neutral-700 dark:text-neutral-300">Command Usage Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={commandsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
            <XAxis dataKey="name" className="text-xs fill-neutral-600 dark:fill-neutral-400" />
            <YAxis className="text-xs fill-neutral-600 dark:fill-neutral-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '0.375rem',
                color: '#333'
              }}
              wrapperClassName="text-sm"
            />
            <Legend />
            <Line type="monotone" dataKey="commands" stroke="#3b82f6" activeDot={{ r: 8 }} name="Commands Processed" />
            <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Active Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-md font-semibold mb-4 text-neutral-700 dark:text-neutral-300">Popular Pokémon Spawns</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={spawnData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
            <XAxis dataKey="name" className="text-xs fill-neutral-600 dark:fill-neutral-400" />
            <YAxis className="text-xs fill-neutral-600 dark:fill-neutral-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '0.375rem',
                color: '#333'
              }}
              wrapperClassName="text-sm"
            />
            <Legend />
            <Bar dataKey="spawned" fill="#3b82f6" name="Times Spawned" />
            <Bar dataKey="caught" fill="#82ca9d" name="Times Caught" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BotAnalysis;
    