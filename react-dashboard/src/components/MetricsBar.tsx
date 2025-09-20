import React from 'react';
import { Stats } from '../types';

interface MetricsBarProps {
  stats: Stats;
}

const MetricsBar: React.FC<MetricsBarProps> = ({ stats }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const metrics = [
    {
      label: 'Screenshots',
      value: stats.screenshots_taken.toString(),
      icon: '📷',
      color: 'text-macos-blue',
      bgColor: 'bg-macos-blue/20',
    },
    {
      label: 'Analyses',
      value: stats.analyses_completed.toString(),
      icon: '🧠',
      color: 'text-macos-green',
      bgColor: 'bg-macos-green/20',
    },
    {
      label: 'Failed',
      value: stats.analyses_failed.toString(),
      icon: '⚠️',
      color: stats.analyses_failed > 0 ? 'text-macos-red' : 'text-macos-text-secondary',
      bgColor: stats.analyses_failed > 0 ? 'bg-macos-red/20' : 'bg-macos-card/20',
    },
    {
      label: 'Avg Time',
      value: `${stats.avg_analysis_time}s`,
      icon: '⏱️',
      color: stats.avg_analysis_time > 10 ? 'text-macos-orange' : 'text-macos-green',
      bgColor: stats.avg_analysis_time > 10 ? 'bg-macos-orange/20' : 'bg-macos-green/20',
    },
    {
      label: 'Success Rate',
      value: `${stats.success_rate}%`,
      icon: '✅',
      color: stats.success_rate >= 90 ? 'text-macos-green' : stats.success_rate >= 70 ? 'text-macos-orange' : 'text-macos-red',
      bgColor: stats.success_rate >= 90 ? 'bg-macos-green/20' : stats.success_rate >= 70 ? 'bg-macos-orange/20' : 'bg-macos-red/20',
    },
    {
      label: 'Uptime',
      value: formatTime(stats.runtime),
      icon: '⏰',
      color: 'text-macos-purple',
      bgColor: 'bg-macos-purple/20',
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: App Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-macos-green rounded-full animate-pulse-macos"></div>
            <span className="text-macos-text-secondary text-sm font-sf">Live Monitoring Active</span>
          </div>
        </div>

        {/* Center: Metrics */}
        <div className="flex items-center space-x-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${metric.bgColor} transition-all duration-200 hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-sm">{metric.icon}</span>
              <div className="text-center">
                <div className={`text-sm font-semibold font-sf-mono ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-macos-text-secondary uppercase tracking-wide">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: System Info */}
        <div className="flex items-center space-x-4 text-macos-text-secondary">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yc-orange rounded-full animate-pulse-macos"></div>
            <span className="text-sm font-sf-mono">Port 8080</span>
          </div>
          <div className="text-sm font-sf-mono">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsBar;