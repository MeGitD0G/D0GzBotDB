import React from 'react';
import Card from '../../ui/Card';
import Terminal from '../../dashboard/layout/Terminal';
import { TerminalSquare } from 'lucide-react';

const ControlTerminalPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card 
        title="Bot Control & Terminal" 
        icon={<TerminalSquare size={20} className="text-primary-500" />}
        bodyClassName="p-0"
      >
        <Terminal />
      </Card>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-md">
        <h3 className="text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Important Security Note</h3>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Bot tokens and other sensitive API keys should be managed via server-side environment variables (e.g., <code>process.env.YOUR_TOKEN</code>) in a production environment.
          They should not be hardcoded or entered directly into any client-side dashboard fields for production use.
          Fields for such tokens in this dashboard (e.g., in Bot Settings) are for local development or testing convenience and assume secure handling if used in a broader context.
        </p>
      </div>
    </div>
  );
};

export default ControlTerminalPage;