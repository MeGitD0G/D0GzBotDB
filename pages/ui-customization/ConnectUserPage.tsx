
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Twitch, UserCheck, LinkIcon } from 'lucide-react'; 

const ConnectUserPage: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [twitchUser, setTwitchUser] = React.useState<string | null>(null);

  const handleConnect = () => {
    // Mock OAuth flow
    alert('Initiating Twitch OAuth flow here (mocked). This would redirect to Twitch for authorization.');
    // Simulate successful connection after a delay
    setTimeout(() => {
      setIsConnected(true);
      setTwitchUser('MockTwitchUser123');
    }, 1500);
  };

  const handleDisconnect = () => {
    alert('Disconnecting Twitch account (mocked).');
    setIsConnected(false);
    setTwitchUser(null);
  };

  return (
    <Card title="Connect Your Twitch Account" icon={<LinkIcon className="mr-2 h-6 w-6 text-purple-500" />}>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        To enable Twitch integrations, you need to connect your Twitch account. This will allow the bot to access your stream information, interact with your chat, and manage subscriber roles based on your settings.
      </p>
      
      {isConnected && twitchUser ? (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-center">
          <UserCheck size={32} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
          <p className="text-lg font-semibold text-green-700 dark:text-green-200">
            Connected as: <span className="text-purple-600 dark:text-purple-400">{twitchUser}</span>
          </p>
          <Button
            variant="danger"
            size="md"
            onClick={handleDisconnect}
            className="mt-4"
          >
            Disconnect Twitch Account
          </Button>
        </div>
      ) : (
        <div className="text-center mb-6">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Twitch size={20} />}
            onClick={handleConnect}
          >
            Connect with Twitch
          </Button>
        </div>
      )}

      <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-750 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Twitch size={18} className="mr-2 text-purple-500" />
          Permissions Requested
        </h3>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm">
          Connecting your Twitch account will use OAuth 2.0 for secure authentication. We will request the minimum necessary permissions based on the features you enable in Integration Settings, such as:
        </p>
        <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
          <li>View your stream status (for live notifications).</li>
          <li>Read your channel's chat and send messages (for chat integration).</li>
          <li>View your subscribers list (for subscriber roles).</li>
          <li>Read your followers list (for follower alerts).</li>
          {/* Add more specific permissions as features are built */}
        </ul>
      </div>
      <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
        Actual Twitch integration requires backend setup for OAuth handling and API calls. This is a frontend mock.
      </p>
    </Card>
  );
};

export default ConnectUserPage;
