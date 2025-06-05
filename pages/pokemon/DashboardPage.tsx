
import React from 'react';
import Card from '../../ui/Card'; 
import BotAnalysis from '../../BotAnalysis'; 
// Terminal component is no longer rendered directly here.

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card title="Bot Analysis">
        <BotAnalysis />
      </Card>
      {/* The Terminal component has been moved to its own page: ControlTerminalPage.tsx */}
    </div>
  );
};

export default DashboardPage;