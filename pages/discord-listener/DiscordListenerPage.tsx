import React, { useState, useEffect, useRef } from 'react';
import Card from '../../ui/Card';
import Select from '../../ui/Select';
import Button from '../../ui/Button'; // Added missing import
import { MOCK_CHANNELS } from '../../constants';
import { DiscordListenerEntry, Channel } from '../../types';
import { Ear, MessageSquare, Bot, UserCircle, Clock, PlayCircle, PauseCircle } from 'lucide-react';

const BOT_NAME = "PokéBot";
const BOT_AVATAR_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"; // Ditto as bot avatar

const generateMockUserAvatar = (seed: string) => {
  // Simple seeded avatar placeholder
  const hashedSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['#FFC107', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0', '#00BCD4'];
  const color = colors[hashedSeed % colors.length];
  return `https://ui-avatars.com/api/?name=${seed.substring(0,2)}&background=${color.substring(1)}&color=fff&size=32&bold=true&rounded=true`;
}

const mockUsernames = ["TrainerRed", "GymLeaderMisty", "EliteFourLance", "ProfOak", "RivalBlue", "PokeFanJessie"];
const mockMessages = [
  "Has anyone seen a Pikachu around here?",
  "Just caught a shiny Magikarp! So excited!",
  "What's the best team for the Elite Four?",
  "Trading a Charizard, looking for Blastoise.",
  "!pokedex Snorlax",
  "I love this bot!",
  "Where do Dragon types spawn most often?",
  "!help",
  "The spawn rates seem fair.",
  "Can someone help me with a trade evolution?"
];
const mockBotActions = [
  "Responded to !pokedex command.",
  "Spawned a wild Bulbasaur in #pokemon-spawns.",
  "User TrainerRed caught Bulbasaur!",
  "Sent help information via DM.",
  "Updated shop inventory.",
  "Distributed daily login bonus.",
  "Processed a trade between UserA and UserB."
];

const DiscordListenerPage: React.FC = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [logs, setLogs] = useState<DiscordListenerEntry[]>([]);
  const [isListening, setIsListening] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const allChannelsOption: Channel = { id: 'all', name: 'All Active Channels' };
  const channelOptions = [allChannelsOption, ...MOCK_CHANNELS].map(ch => ({ value: ch.id, label: ch.name }));

  useEffect(() => {
    if (isListening) {
      const intervalId = setInterval(() => {
        const randomChannel = MOCK_CHANNELS[Math.floor(Math.random() * MOCK_CHANNELS.length)];
        
        if (selectedChannelId !== 'all' && randomChannel.id !== selectedChannelId) {
            return;
        }

        let newLogEntryData: Omit<DiscordListenerEntry, 'id' | 'timestamp'>;
        const entryTypeRoll = Math.random();
        const channelName = `#${randomChannel.name}`;

        if (entryTypeRoll < 0.7) { // 70% chance user message
          const userName = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
          newLogEntryData = {
            channelName,
            type: 'user-message',
            userName: userName,
            userAvatarUrl: generateMockUserAvatar(userName),
            messageContent: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          };
        } else if (entryTypeRoll < 0.95) { // 25% chance bot action
          newLogEntryData = {
            channelName,
            type: 'bot-action',
            botName: BOT_NAME,
            botAvatarUrl: BOT_AVATAR_URL,
            botActionDescription: mockBotActions[Math.floor(Math.random() * mockBotActions.length)],
          };
        } else { // 5% chance system notification
            newLogEntryData = {
              channelName,
              type: 'system-notification',
              botActionDescription: "System maintenance starting in 5 minutes.",
            };
        }

        setLogs(prevLogs => [
          ...prevLogs,
          {
            ...newLogEntryData,
            id: Date.now().toString() + Math.random().toString(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }
        ]);
      }, 3000); // Add a new log every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [isListening, selectedChannelId]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card title="Discord Listener" icon={<Ear className="mr-2 h-6 w-6 text-primary-500" />}>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
        Observe simulated real-time activity from selected Discord channels. This includes user messages and bot actions.
        All data is mock and for demonstration purposes.
      </p>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md shadow-sm">
        <Select
          label="Listen to Channel:"
          options={channelOptions}
          value={selectedChannelId}
          onChange={(e) => setSelectedChannelId(e.target.value)}
          containerClassName="mb-0 flex-grow"
          labelClassName="text-sm"
        />
        <Button 
          onClick={() => setIsListening(!isListening)} 
          variant={isListening ? "danger" : "primary"}
          leftIcon={isListening ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
          className="w-full sm:w-auto mt-2 sm:mt-0 self-end"
          aria-pressed={isListening}
          aria-label={isListening ? "Pause listening" : "Start listening"}
        >
          {isListening ? 'Pause Listener' : 'Resume Listener'}
        </Button>
      </div>

      <div 
        ref={logContainerRef} 
        className="h-[600px] overflow-y-auto bg-neutral-100 dark:bg-neutral-850 p-4 rounded-md border border-neutral-200 dark:border-neutral-700 space-y-3"
        role="log"
        aria-live="polite"
        aria-atomic="false" // New entries are appended, so not fully atomic but polite is fine
      >
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
            <MessageSquare size={48} className="mb-2" />
            <p>{isListening ? 'Waiting for activity...' : 'Listener paused.'}</p>
          </div>
        )}
        {logs.map(log => (
          <div key={log.id} className={`p-3 rounded-lg shadow-sm flex items-start space-x-3 text-sm
            ${log.type === 'user-message' ? 'bg-white dark:bg-neutral-800' : 
              log.type === 'bot-action' ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400' :
              'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-400'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {log.type === 'user-message' && log.userAvatarUrl && <img src={log.userAvatarUrl} alt={log.userName || 'User'} className="w-6 h-6 rounded-full" />}
              {log.type === 'user-message' && !log.userAvatarUrl && <UserCircle size={24} className="text-neutral-400 dark:text-neutral-500" />}
              {log.type === 'bot-action' && log.botAvatarUrl && <img src={log.botAvatarUrl} alt={log.botName || 'Bot'} className="w-6 h-6 rounded-full" />}
              {log.type === 'bot-action' && !log.botAvatarUrl && <Bot size={24} className="text-blue-500 dark:text-blue-400" />}
              {log.type === 'system-notification' && <Bot size={24} className="text-yellow-500 dark:text-yellow-400" />}
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline space-x-2">
                <span className={`font-semibold 
                  ${log.type === 'user-message' ? 'text-neutral-700 dark:text-neutral-200' : 
                    log.type === 'bot-action' ? 'text-blue-600 dark:text-blue-300' :
                    'text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {log.type === 'user-message' ? log.userName : log.botName || 'System'}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                  <Clock size={12} className="mr-1" />{log.timestamp}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">in {log.channelName}</span>
              </div>
              <p className={`mt-0.5 whitespace-pre-wrap break-words ${log.type === 'user-message' ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {log.messageContent || log.botActionDescription}
              </p>
            </div>
          </div>
        ))}
         {!isListening && logs.length > 0 && (
            <div className="text-center py-2 text-sm text-neutral-500 dark:text-neutral-400 border-t-2 border-dashed border-neutral-300 dark:border-neutral-600">
                Listener paused. New messages will not appear until resumed.
            </div>
        )}
      </div>
    </Card>
  );
};

export default DiscordListenerPage;