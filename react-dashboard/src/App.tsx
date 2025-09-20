import React, { useState, useEffect, useCallback } from 'react';
import useSocket from './hooks/useSocket';
import Header from './components/Header';
import ScreenshotGallery from './components/ScreenshotGallery';
import AnalysisStream from './components/AnalysisStream';
import MetricsBar from './components/MetricsBar';
import { AppState, Screenshot, StreamItem, Stats, AnalysisResult } from './types';

const SOCKET_URL = 'http://localhost:8080';

const initialStats: Stats = {
  screenshots_taken: 0,
  analyses_completed: 0,
  analyses_failed: 0,
  avg_analysis_time: 0,
  success_rate: 0,
  runtime: 0,
};

const App: React.FC = () => {
  const { isConnected, on, off, emit } = useSocket(SOCKET_URL);

  const [appState, setAppState] = useState<AppState>({
    isConnected: false,
    isMonitoring: false,
    screenshots: [],
    currentScreenshot: null,
    streamItems: [],
    stats: initialStats,
  });

  // Generate unique ID for stream items
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add stream item helper
  const addStreamItem = useCallback((message: string, timestamp: string, type: 'status' | 'analysis' | 'error') => {
    const newItem: StreamItem = {
      id: generateId(),
      message,
      timestamp,
      type,
    };

    setAppState(prev => ({
      ...prev,
      streamItems: [newItem, ...prev.streamItems.slice(0, 99)], // Keep last 100 items
    }));
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!isConnected) return;

    // Status updates
    const handleStatusUpdate = (data: { message: string; timestamp: string }) => {
      addStreamItem(data.message, data.timestamp, 'status');
    };

    // New screenshot
    const handleNewScreenshot = (data: Screenshot) => {
      setAppState(prev => {
        const updatedScreenshots = [data, ...prev.screenshots.slice(0, 9)]; // Keep last 10
        return {
          ...prev,
          screenshots: updatedScreenshots,
          currentScreenshot: data, // Set as current screenshot
        };
      });
      addStreamItem(`💾 Screenshot #${data.num} saved (${data.size_kb.toFixed(1)}KB)`, data.timestamp, 'status');
    };

    // Analysis result
    const handleAnalysisResult = (data: AnalysisResult) => {
      if (data.success) {
        const message = `📊 Analysis #${data.screenshot_num} complete (${data.analyze_time.toFixed(2)}s)`;
        addStreamItem(message, data.timestamp, 'analysis');

        // Add analysis content line by line
        if (data.response) {
          const analysisLines = data.response.split('\n');
          analysisLines.forEach(line => {
            if (line.trim()) {
              addStreamItem(`🔍 ${line.trim()}`, data.timestamp, 'analysis');
            }
          });
        }
      } else {
        addStreamItem(`❌ Analysis #${data.screenshot_num} failed: ${data.error}`, data.timestamp, 'error');
      }
    };

    // Stats update
    const handleStatsUpdate = (data: Stats) => {
      setAppState(prev => ({ ...prev, stats: data }));
    };

    // Error message
    const handleErrorMessage = (data: { message: string; timestamp: string }) => {
      addStreamItem(`❌ ${data.message}`, data.timestamp, 'error');
    };

    // Attach event listeners
    on('status_update', handleStatusUpdate);
    on('new_screenshot', handleNewScreenshot);
    on('analysis_result', handleAnalysisResult);
    on('stats_update', handleStatsUpdate);
    on('error_message', handleErrorMessage);

    // Cleanup
    return () => {
      off('status_update', handleStatusUpdate);
      off('new_screenshot', handleNewScreenshot);
      off('analysis_result', handleAnalysisResult);
      off('stats_update', handleStatsUpdate);
      off('error_message', handleErrorMessage);
    };
  }, [isConnected, on, off, addStreamItem]);

  // Update connection status
  useEffect(() => {
    setAppState(prev => ({ ...prev, isConnected }));
  }, [isConnected]);

  // Control handlers
  const handleStart = () => {
    emit('start_monitoring');
    setAppState(prev => ({ ...prev, isMonitoring: true }));
    addStreamItem('🚀 Starting live monitoring...', new Date().toLocaleTimeString(), 'status');
  };

  const handleStop = () => {
    emit('stop_monitoring');
    setAppState(prev => ({ ...prev, isMonitoring: false }));
    addStreamItem('🛑 Stopping monitoring...', new Date().toLocaleTimeString(), 'status');
  };

  const handleScreenshotSelect = (screenshot: Screenshot) => {
    setAppState(prev => ({ ...prev, currentScreenshot: screenshot }));
  };

  // Runtime counter
  useEffect(() => {
    if (!appState.isMonitoring) return;

    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          runtime: prev.stats.runtime + 1,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [appState.isMonitoring]);

  return (
    <div className="min-h-screen bg-macos-bg font-sf overflow-hidden">
      {/* macOS Window Frame */}
      <div className="h-screen flex flex-col">
        {/* Traffic Lights & Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-macos-surface/80 backdrop-blur-macos border-b border-macos-border/50">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="traffic-light red bg-macos-red"></div>
              <div className="traffic-light yellow bg-macos-yellow"></div>
              <div className="traffic-light green bg-macos-green"></div>
            </div>
            <div className="ml-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yc-orange to-yc-orange-dark rounded-lg flex items-center justify-center shadow-macos-button">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-macos-text font-semibold text-lg">Vision Agent</h1>
                <p className="text-macos-text-secondary text-xs">Live Screen Analysis</p>
              </div>
            </div>
          </div>

          {/* Connection Status & Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${appState.isConnected ? 'bg-macos-green animate-pulse-macos' : 'bg-macos-red'}`}></div>
              <span className="text-macos-text-secondary text-sm">
                {appState.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleStart}
                disabled={!appState.isConnected || appState.isMonitoring}
                className={`macos-button px-4 py-2 rounded-lg font-medium text-sm shadow-macos-button focus-ring ${
                  !appState.isConnected || appState.isMonitoring
                    ? 'bg-macos-card text-macos-text-secondary cursor-not-allowed'
                    : 'bg-macos-green text-white hover:bg-green-600'
                }`}
              >
                {appState.isMonitoring ? 'Running...' : 'Start'}
              </button>

              <button
                onClick={handleStop}
                disabled={!appState.isConnected || !appState.isMonitoring}
                className={`macos-button px-4 py-2 rounded-lg font-medium text-sm shadow-macos-button focus-ring ${
                  !appState.isConnected || !appState.isMonitoring
                    ? 'bg-macos-card text-macos-text-secondary cursor-not-allowed'
                    : 'bg-macos-red text-white hover:bg-red-600'
                }`}
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Screenshot Gallery */}
          <div className="w-80 bg-macos-surface/50 backdrop-blur-macos border-r border-macos-border/30 overflow-hidden">
            <ScreenshotGallery
              screenshots={appState.screenshots}
              currentScreenshot={appState.currentScreenshot}
              onScreenshotSelect={handleScreenshotSelect}
            />
          </div>

          {/* Main Panel - Analysis Stream */}
          <div className="flex-1 bg-macos-bg/80 backdrop-blur-macos overflow-hidden">
            <AnalysisStream streamItems={appState.streamItems} />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-macos-surface/80 backdrop-blur-macos border-t border-macos-border/50">
          <MetricsBar stats={appState.stats} />
        </div>
      </div>
    </div>
  );
};

export default App;
