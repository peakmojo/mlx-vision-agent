import React from 'react';

interface HeaderProps {
  isConnected: boolean;
  isMonitoring: boolean;
  onStart: () => void;
  onStop: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, isMonitoring, onStart, onStop }) => {
  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    return isMonitoring ? 'Monitoring' : 'Connected';
  };

  const getStatusDotClass = () => {
    if (!isConnected) return 'bg-red-500';
    return isMonitoring ? 'bg-accent-green animate-pulse-custom' : 'bg-accent-green';
  };

  return (
    <div className="bg-black/80 backdrop-blur-lg p-5 border-b-2 border-accent-red flex justify-between items-center">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-red to-red-400 bg-clip-text text-transparent flex items-center">
        🔴 Live Screen Analysis Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusDotClass()}`}></div>
          <span className="text-white">{getStatusText()}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onStart}
            disabled={isMonitoring}
            className="px-4 py-2 bg-gradient-to-r from-accent-green to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            ▶️ Start
          </button>
          <button
            onClick={onStop}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            ⏹️ Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;