import React, { useEffect, useRef } from 'react';
import { StreamItem } from '../types';

interface AnalysisStreamProps {
  streamItems: StreamItem[];
}

const AnalysisStream: React.FC<AnalysisStreamProps> = ({ streamItems }) => {
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new items are added
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = 0;
    }
  }, [streamItems]);

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'status':
        return {
          bgColor: 'bg-macos-blue/20',
          borderColor: 'border-macos-blue/30',
          icon: '⚡',
          iconBg: 'bg-macos-blue',
        };
      case 'analysis':
        return {
          bgColor: 'bg-macos-green/20',
          borderColor: 'border-macos-green/30',
          icon: '🧠',
          iconBg: 'bg-macos-green',
        };
      case 'error':
        return {
          bgColor: 'bg-macos-red/20',
          borderColor: 'border-macos-red/30',
          icon: '⚠️',
          iconBg: 'bg-macos-red',
        };
      default:
        return {
          bgColor: 'bg-macos-card/30',
          borderColor: 'border-macos-border/30',
          icon: '💬',
          iconBg: 'bg-macos-card',
        };
    }
  };

  // Reverse items to show newest at top
  const reversedItems = [...streamItems].reverse();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-macos-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yc-orange to-yc-orange-dark rounded-lg flex items-center justify-center shadow-macos-button">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h2 className="text-macos-text text-lg font-semibold">Analysis Stream</h2>
              <p className="text-macos-text-secondary text-sm">Live AI insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-macos-green rounded-full animate-pulse-macos"></div>
            <span className="text-macos-text-secondary text-sm font-sf-mono">{streamItems.length}</span>
          </div>
        </div>
      </div>

      {/* Stream Content */}
      <div
        ref={streamRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {reversedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-macos-card/50 rounded-macos-lg flex items-center justify-center mb-6 animate-scale-in">
              <span className="text-macos-text-secondary text-2xl">🤖</span>
            </div>
            <h3 className="text-macos-text font-semibold text-lg mb-2">Ready for Analysis</h3>
            <p className="text-macos-text-secondary text-sm leading-relaxed max-w-sm">
              AI analysis will appear here in real-time once you start capturing screenshots
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reversedItems.map((item, index) => {
              const style = getMessageStyle(item.type);

              return (
                <div
                  key={item.id}
                  className={`flex space-x-3 animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Message Icon */}
                  <div className={`w-8 h-8 ${style.iconBg} rounded-full flex items-center justify-center flex-shrink-0 shadow-macos-button`}>
                    <span className="text-white text-sm">{style.icon}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 ${style.bgColor} ${style.borderColor} border backdrop-blur-macos rounded-macos-lg p-4 shadow-macos-inner`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-macos-text-secondary text-xs font-sf-mono uppercase tracking-wide">
                        {item.type}
                      </span>
                      <span className="text-macos-text-secondary text-xs font-sf-mono">
                        {item.timestamp}
                      </span>
                    </div>
                    <div className="text-macos-text text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {item.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {streamItems.length > 0 && (
        <div className="p-4 border-t border-macos-border/30 bg-macos-surface/30">
          <div className="flex items-center justify-between text-xs text-macos-text-secondary">
            <span>{streamItems.length} messages</span>
            <span className="font-sf-mono">Streaming live</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisStream;