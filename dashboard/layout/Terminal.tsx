
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../ui/Button';
import { Play, StopCircle, Zap, MessageSquare, User, Clock, TerminalSquare } from 'lucide-react';
import { TerminalLogEntry } from '../../types';

const Terminal: React.FC = () => {
  const [botStatus, setBotStatus] = useState<'stopped' | 'running'>('stopped');
  const [loadingOperation, setLoadingOperation] = useState<'start' | 'stop' | null>(null);
  const [logs, setLogs] = useState<TerminalLogEntry[]>([]);
  const logsEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [logs]);

  const addLog = (entry: Omit<TerminalLogEntry, 'id' | 'timestamp'>) => {
    setLogs(prevLogs => [
      ...prevLogs,
      {
        id: Date.now().toString() + Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        ...entry,
      }
    ]);
  };

  const handleStartBot = async () => {
    setLoadingOperation('start');
    addLog({ botReaction: 'Attempting to start bot (mock operation)...', type: 'system' });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // Mock success
      setBotStatus('running');
      addLog({ botReaction: 'Bot started successfully (mock).', type: 'system' });
    } catch (error: any) {
      setBotStatus('stopped');
      addLog({ botReaction: `Error starting bot (mock): ${error.message}`, type: 'error' });
    } finally {
      setLoadingOperation(null);
    }
  };

  const handleStopBot = async () => {
    setLoadingOperation('stop');
    addLog({ botReaction: 'Attempting to stop bot (mock operation)...', type: 'system' });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // Mock success
      setBotStatus('stopped');
      addLog({ botReaction: 'Bot stopped successfully (mock).', type: 'system' });
    } catch (error: any) {
      setBotStatus('running');
      addLog({ botReaction: `Error stopping bot (mock): ${error.message}`, type: 'error' });
    } finally {
      setLoadingOperation(null);
    }
  };

  const handleMockCommand = (commandName: string) => {
    addLog({
      username: 'AdminUser',
      command: `!${commandName}`,
      botReaction: `Simulating execution of ${commandName}... Acknowledged. This is a frontend simulation.`,
      type: 'command'
    });
    setTimeout(() => {
      addLog({
        botReaction: `${commandName} simulation complete. Result: Success.`,
        type: 'system'
      });
    }, 1000);
  };

  const getDisplayStatus = (): string => {
    if (loadingOperation === 'start') return 'starting';
    if (loadingOperation === 'stop') return 'stopping';
    return botStatus;
  };
  const displayStatus = getDisplayStatus();

  return (
    <div className="flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            onClick={handleStartBot}
            disabled={botStatus === 'running' || loadingOperation !== null}
            isLoading={loadingOperation === 'start'}
            leftIcon={<Play className="w-4 h-4" />}
            variant="primary"
            aria-label="Start Bot"
          >
            Start Bot
          </Button>
          <Button
            onClick={handleStopBot}
            disabled={botStatus === 'stopped' || loadingOperation !== null}
            isLoading={loadingOperation === 'stop'}
            leftIcon={<StopCircle className="w-4 h-4" />}
            variant="danger"
            aria-label="Stop Bot"
          >
            Stop Bot
          </Button>
          <span className={`ml-4 px-3 py-1 text-sm rounded-full ${
            displayStatus === 'running' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
            displayStatus === 'stopped' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' // For 'starting' or 'stopping'
          }`}
          aria-live="polite"
          >
            Bot Status: {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleMockCommand('ping')} leftIcon={<Zap size={14}/>}>!ping</Button>
            <Button size="sm" variant="outline" onClick={() => handleMockCommand('status')} leftIcon={<TerminalSquare size={14}/>}>!status</Button>
            <Button size="sm" variant="outline" onClick={() => handleMockCommand('help')} leftIcon={<MessageSquare size={14}/>}>!help</Button>
        </div>
      </div>
      <div className="flex-grow bg-neutral-50 dark:bg-neutral-850 p-4 overflow-y-auto font-mono text-sm text-neutral-700 dark:text-neutral-300" role="log" aria-live="polite">
        {logs.map(log => (
          <div key={log.id} className={`mb-2 p-2 rounded-md ${log.type === 'error' ? 'bg-red-50 dark:bg-red-900/50' : 'bg-neutral-100 dark:bg-neutral-700/50'}`}>
            <span className="text-sky-500 dark:text-sky-400"><Clock size={12} className="inline mr-1"/>{log.timestamp}</span>
            {log.username && <span className="text-purple-500 dark:text-purple-400 ml-2"><User size={12} className="inline mr-1"/>{log.username}</span>}
            {log.command && <span className="text-green-600 dark:text-green-400 ml-2"><Zap size={12} className="inline mr-1"/>{log.command}</span>}
            <span className="block whitespace-pre-wrap"><MessageSquare size={12} className="inline mr-1"/>{log.botReaction}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
