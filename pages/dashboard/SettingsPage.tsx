import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Textarea from '../../ui/Textarea';
import ToggleSwitch from '../../ui/ToggleSwitch';
import Input from '../../ui/Input'; // Import Input component
import { MOCK_CHANNELS } from '../../constants';
import { DashboardSettings, MessageSetting, Channel } from '../../types';
import { Save, MessageSquare, LogOut, AlertCircle, Settings as SettingsIcon, Terminal, KeyRound, Info, Bot, Server } from 'lucide-react';

const initialMessageSetting: MessageSetting = {
  enabled: false,
  channelId: '',
  message: '',
};

const initialSettings: DashboardSettings = {
  welcomeMessage: { ...initialMessageSetting, message: 'Welcome {user} to {server}! We are glad to have you.' },
  leavingMessage: { ...initialMessageSetting, message: 'Goodbye {user}, we will miss you!' },
  developmentModeEnabled: true,
  testApiKey: '',
  botToken: '',
  serverId: '',
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<DashboardSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const channelOptions = MOCK_CHANNELS.map((ch: Channel) => ({ value: ch.id, label: `#${ch.name}` }));

  useEffect(() => {
    const loadedSettings = localStorage.getItem('dashboardBotSettings');
    if (loadedSettings) {
      try {
        const parsedSettings = JSON.parse(loadedSettings);
        setSettings({
            ...initialSettings, 
            ...parsedSettings, 
            welcomeMessage: {
                ...initialMessageSetting, 
                ...(parsedSettings.welcomeMessage || {})
            },
            leavingMessage: {
                ...initialMessageSetting,
                ...(parsedSettings.leavingMessage || {})
            },
            // Ensure new fields from DashboardSettings are present
            botToken: parsedSettings.botToken || '',
            serverId: parsedSettings.serverId || '',
            developmentModeEnabled: parsedSettings.developmentModeEnabled === undefined ? true : parsedSettings.developmentModeEnabled,
            testApiKey: parsedSettings.testApiKey || '',
        });
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        setSettings(initialSettings);
      }
    } else {
        setSettings(initialSettings);
    }
  }, []);

  const handleWelcomeChange = (field: keyof MessageSetting, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      welcomeMessage: { ...prev.welcomeMessage, [field]: value },
    }));
  };

  const handleLeavingChange = (field: keyof MessageSetting, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      leavingMessage: { ...prev.leavingMessage, [field]: value },
    }));
  };

  const handleGenericSettingChange = (field: keyof DashboardSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    console.log("Saving Dashboard Settings (mock):", settings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      localStorage.setItem('dashboardBotSettings', JSON.stringify(settings));
      setSaveStatus({ type: 'success', message: "Settings saved successfully (mock)!" });
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: `Failed to save settings (mock): ${error.message || 'Unknown error'}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center">
        <SettingsIcon size={28} className="mr-3 text-primary-600 dark:text-primary-400" />
        Bot Settings
      </h1>

      {saveStatus && (
        <div className={`my-4 p-3 rounded-md text-sm flex items-center ${saveStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
          <AlertCircle size={18} className="mr-2"/>
          {saveStatus.message}
        </div>
      )}

      <Card title="Bot Configuration" icon={<Bot size={20} className="text-purple-500" />}>
        <div className="space-y-4">
          <Input
            label="Discord Bot Token"
            id="botToken"
            type="password"
            value={settings.botToken}
            onChange={(e) => handleGenericSettingChange('botToken', e.target.value)}
            placeholder="Enter your Discord Bot Token"
            leftIcon={<KeyRound size={16} className="text-neutral-400 dark:text-neutral-500" />}
            containerClassName="mb-0"
          />
           <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-md">
                <p className="text-xs text-yellow-700 dark:text-yellow-200">
                 <strong>Important Security Notice:</strong> In a live production environment, your Discord Bot Token must be securely managed as a server-side environment variable (e.g., <code>process.env.DISCORD_BOT_TOKEN</code>).
                 <strong> Do not enter your live production token here if this dashboard were public.</strong> This field is for local development/testing or for systems where this data is handled securely by a backend proxy.
                </p>
            </div>
          <Input
            label="Discord Server ID"
            id="serverId"
            type="text"
            value={settings.serverId}
            onChange={(e) => handleGenericSettingChange('serverId', e.target.value)}
            placeholder="Enter your Discord Server ID"
            leftIcon={<Server size={16} className="text-neutral-400 dark:text-neutral-500" />}
            containerClassName="mb-0"
          />
        </div>
      </Card>

      <Card title="Environment & API Settings" icon={<Terminal size={20} className="text-teal-500" />}>
        <div className="space-y-4">
          <ToggleSwitch
            id="developmentModeEnabled"
            label="Development Mode"
            checked={settings.developmentModeEnabled}
            onChange={(checked) => handleGenericSettingChange('developmentModeEnabled', checked)}
            srText="Toggle Development Mode"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-2">
            {settings.developmentModeEnabled 
              ? "In Development Mode, the bot uses mock data and test API keys for safe testing."
              : "In Production Mode, the bot uses live API keys and connects to actual services."}
          </p>

          {settings.developmentModeEnabled && (
            <Input
              label="Test API Key (e.g., for Gemini API)"
              id="testApiKey"
              type="password" 
              value={settings.testApiKey}
              onChange={(e) => handleGenericSettingChange('testApiKey', e.target.value)}
              placeholder="Enter your test API key"
              leftIcon={<KeyRound size={16} className="text-neutral-400 dark:text-neutral-500" />}
              containerClassName="mb-0"
            />
          )}

          {!settings.developmentModeEnabled && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-md">
              <div className="flex items-center">
                <KeyRound size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Production API Key</h4>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                The Production API Key (e.g., for Google Gemini API) is securely loaded from server-side environment variables (<code>process.env.API_KEY</code>). It cannot be viewed or changed from this dashboard for security reasons.
              </p>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-600">
            <h5 className="text-sm font-semibold mb-1 text-neutral-700 dark:text-neutral-200 flex items-center">
                <Info size={16} className="mr-2 text-neutral-500" /> Important Considerations:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                <li>
                    <strong>Real-Time Monitoring:</strong> For live API call status, webhook events, and error logging, refer to the "Bot Control & Terminal" or dedicated monitoring dashboards.
                </li>
                <li>
                    <strong>Testing & Staging:</strong> Before full production launch, utilize Development Mode for thorough testing. Consider a staging phase with live integrations on a limited scale to ensure stability.
                </li>
            </ul>
          </div>

        </div>
      </Card>


      <Card title="Welcome Message Settings" icon={<MessageSquare size={20} className="text-green-500" />}>
        <div className="space-y-4">
          <ToggleSwitch
            id="welcomeEnabled"
            label="Enable Welcome Message"
            checked={settings.welcomeMessage.enabled}
            onChange={(checked) => handleWelcomeChange('enabled', checked)}
          />
          {settings.welcomeMessage.enabled && (
            <>
              <Select
                label="Welcome Message Channel"
                id="welcomeChannel"
                options={channelOptions}
                value={settings.welcomeMessage.channelId}
                onChange={(e) => handleWelcomeChange('channelId', e.target.value)}
                placeholder="Select a channel..."
                error={!settings.welcomeMessage.channelId ? "Channel selection is required." : undefined}
                containerClassName="mb-0"
              />
              <Textarea
                label="Welcome Message"
                id="welcomeMessageText"
                value={settings.welcomeMessage.message}
                onChange={(e) => handleWelcomeChange('message', e.target.value)}
                rows={4}
                placeholder="Enter your welcome message..."
                textareaClassName="min-h-[100px]"
                containerClassName="mb-0"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Available placeholders: <code>{'{user}'}</code> (new member's name), <code>{'{server}'}</code> (server name).
              </p>
            </>
          )}
        </div>
      </Card>

      <Card title="Leaving Message Settings" icon={<LogOut size={20} className="text-red-500" />}>
        <div className="space-y-4">
          <ToggleSwitch
            id="leavingEnabled"
            label="Enable Leaving Message"
            checked={settings.leavingMessage.enabled}
            onChange={(checked) => handleLeavingChange('enabled', checked)}
          />
          {settings.leavingMessage.enabled && (
            <>
              <Select
                label="Leaving Message Channel"
                id="leavingChannel"
                options={channelOptions}
                value={settings.leavingMessage.channelId}
                onChange={(e) => handleLeavingChange('channelId', e.target.value)}
                placeholder="Select a channel..."
                error={!settings.leavingMessage.channelId ? "Channel selection is required." : undefined}
                containerClassName="mb-0"
              />
              <Textarea
                label="Leaving Message"
                id="leavingMessageText"
                value={settings.leavingMessage.message}
                onChange={(e) => handleLeavingChange('message', e.target.value)}
                rows={4}
                placeholder="Enter your leaving message..."
                textareaClassName="min-h-[100px]"
                containerClassName="mb-0"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Available placeholders: <code>{'{user}'}</code> (departing member's name).
              </p>
            </>
          )}
        </div>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          leftIcon={<Save size={16} />}
          isLoading={isSaving}
          disabled={isSaving || 
            (settings.welcomeMessage.enabled && !settings.welcomeMessage.channelId) ||
            (settings.leavingMessage.enabled && !settings.leavingMessage.channelId)
          }
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
       <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        All settings are saved locally in this mock version. A real application would save these to a backend database, handling sensitive data like tokens with extreme care.
      </p>
    </div>
  );
};

export default SettingsPage;