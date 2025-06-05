
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button'; // Assuming Button is in ui
import { Settings, Bell, MessageSquare, Share2, Users, SlidersHorizontal, AlertCircle, Twitch as TwitchIcon} from 'lucide-react';

const IntegrationSettingsPage: React.FC = () => {
  const [settings, setSettings] = React.useState({
    liveNotifications: true,
    liveNotificationChannel: 'general', // Example: Discord channel name or ID
    vodLinks: true,
    vodLinkChannel: 'announcements',
    clipPosting: false,
    clipPostingChannel: 'clips',
    chatIntegrationDiscordChannel: '', // Empty means disabled
    chatIntegrationTwitchToDiscord: false,
    chatIntegrationDiscordToTwitch: false,
    newFollowerAlerts: true,
    newFollowerAlertChannel: 'general',
    newSubscriberAlerts: true,
    newSubscriberAlertChannel: 'general',
    raidAlerts: true,
    raidAlertChannel: 'general',
    assignSubscriberRoles: false,
    subscriberRoleName: 'Twitch Subscriber', // Example Discord Role Name
    chatCommandIntegration: true,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  // Mock channels - in a real app, these would be fetched or configured
  const mockDiscordChannels = ['general', 'announcements', 'clips', 'twitch-chat', 'bot-commands'];


  const handleToggle = (settingKey: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [settingKey]: !prev[settingKey] }));
  };

  const handleSelectChange = (settingKey: keyof typeof settings, value: string) => {
    setSettings(prev => ({...prev, [settingKey]: value}));
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Mock save
    setTimeout(() => {
        alert('Twitch integration settings saved (mocked)!');
        console.log("Saved settings:", settings);
        setIsSaving(false);
    }, 1000);
  };

  const renderSettingToggle = (label: string, settingKey: keyof typeof settings, description: string, channelSettingKey?: keyof typeof settings) => (
    <div className="py-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
        <div className="flex items-center justify-between">
            <div>
                <label htmlFor={settingKey} className="font-medium text-neutral-800 dark:text-neutral-100">{label}</label>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
            </div>
            <button
                id={settingKey}
                role="switch"
                aria-checked={!!settings[settingKey]}
                onClick={() => handleToggle(settingKey)}
                className={`${
                settings[settingKey] ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800`}
            >
                <span
                aria-hidden="true"
                className={`${
                    settings[settingKey] ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
        {channelSettingKey && settings[settingKey] && (
            <div className="mt-2 pl-2">
                 <label htmlFor={`${String(channelSettingKey)}-select`} className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">Target Discord Channel:</label>
                 <select
                    id={`${String(channelSettingKey)}-select`}
                    name={String(channelSettingKey)}
                    value={settings[channelSettingKey] as string}
                    onChange={(e) => handleSelectChange(channelSettingKey, e.target.value)}
                    className="w-full sm:w-1/2 p-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">Select a channel</option>
                    {mockDiscordChannels.map(ch => <option key={ch} value={ch}>#{ch}</option>)}
                </select>
            </div>
        )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card title="Twitch Integration Settings" icon={<SlidersHorizontal className="mr-2 h-6 w-6 text-purple-500" />}>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Configure how the bot interacts with your Twitch channel and Discord server.
          Enable the features you want to use.
        </p>
        <div className="flex items-start p-3 mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md">
            <AlertCircle size={20} className="mr-2 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Note:</strong> Connecting your Twitch account on the "Connect User" page is required for these settings to take effect. All interactions are currently mocked.
            </p>
        </div>
      </Card>

      <Card title="Stream Notifications" icon={<Bell className="mr-2 h-5 w-5 text-blue-500" />}>
        {renderSettingToggle('Live Stream Alerts', 'liveNotifications', 'Notify Discord when your Twitch stream goes live.', 'liveNotificationChannel')}
        {renderSettingToggle('VOD Links Sharing', 'vodLinks', 'Share links to VODs on Discord after streams end.', 'vodLinkChannel')}
      </Card>

      <Card title="Content Sharing" icon={<Share2 className="mr-2 h-5 w-5 text-green-500" />}>
        {renderSettingToggle('Highlight/Clip Posting', 'clipPosting', 'Automatically post new Twitch highlights or clips to Discord.', 'clipPostingChannel')}
        <div className="py-4 border-b border-neutral-200 dark:border-neutral-700">
            <label className="font-medium text-neutral-800 dark:text-neutral-100">Twitch Chat Mirroring</label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Mirror Twitch chat to a Discord channel, or Discord messages to Twitch chat.</p>
            {renderSettingToggle('Mirror Twitch Chat to Discord', 'chatIntegrationTwitchToDiscord', 'Sends Twitch chat messages to a selected Discord channel.')}
            {settings.chatIntegrationTwitchToDiscord && (
                <div className="mt-2 pl-2 mb-2">
                    <label htmlFor="chatIntegrationDiscordChannel-select" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">Target Discord Channel for Twitch Chat:</label>
                    <select
                        id="chatIntegrationDiscordChannel-select"
                        name="chatIntegrationDiscordChannel"
                        value={settings.chatIntegrationDiscordChannel}
                        onChange={(e) => handleSelectChange('chatIntegrationDiscordChannel', e.target.value)}
                        className="w-full sm:w-1/2 p-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Select a channel</option>
                        {mockDiscordChannels.map(ch => <option key={ch} value={ch}>#{ch}</option>)}
                    </select>
                </div>
            )}
             {renderSettingToggle('Mirror Discord Messages to Twitch Chat', 'chatIntegrationDiscordToTwitch', 'Sends messages from a selected Discord channel to Twitch chat (requires bot to have moderator rights on Twitch).')}
             {settings.chatIntegrationDiscordToTwitch && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 pl-2">Ensure the bot has moderator privileges on your Twitch channel for this feature.</p>
             )}
        </div>
      </Card>

      <Card title="Community Engagement" icon={<Users className="mr-2 h-5 w-5 text-orange-500" />}>
        {renderSettingToggle('New Follower Alerts', 'newFollowerAlerts', 'Send alerts to Discord for new Twitch followers.', 'newFollowerAlertChannel')}
        {renderSettingToggle('New Subscriber Alerts', 'newSubscriberAlerts', 'Send alerts to Discord for new Twitch subscribers.', 'newSubscriberAlertChannel')}
        {renderSettingToggle('Raid Notifications', 'raidAlerts', 'Notify Discord about incoming Twitch raids.', 'raidAlertChannel')}
        {renderSettingToggle('Auto Assign Subscriber Roles', 'assignSubscriberRoles', 'Automatically assign special Discord roles to Twitch subscribers.')}
        {settings.assignSubscriberRoles && (
             <div className="mt-2 pl-2">
                 <label htmlFor="subscriberRoleName-input" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">Discord Role Name for Subscribers:</label>
                 <input
                    id="subscriberRoleName-input"
                    type="text"
                    name="subscriberRoleName"
                    value={settings.subscriberRoleName}
                    onChange={(e) => handleSelectChange('subscriberRoleName', e.target.value)}
                    placeholder="e.g., Twitch Tier 1 Sub"
                    className="w-full sm:w-1/2 p-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                />
            </div>
        )}
        {renderSettingToggle('Chat Command Integration', 'chatCommandIntegration', 'Allow Twitch chat commands to be used in Discord (or vice-versa).')}
      </Card>
       <div className="mt-8 text-right">
            <Button variant="primary" onClick={handleSaveSettings} leftIcon={<TwitchIcon size={16}/>} isLoading={isSaving}>
                {isSaving ? 'Saving Settings...' : 'Save Twitch Settings'}
            </Button>
        </div>
    </div>
  );
};

export default IntegrationSettingsPage;
