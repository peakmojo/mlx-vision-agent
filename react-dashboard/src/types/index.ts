// Types for the Live Screen Analysis Dashboard

export interface Screenshot {
  num: number;
  filename: string;
  filepath: string;
  size_kb: number;
  timestamp: string;
}

export interface AnalysisResult {
  screenshot_num: number;
  analyze_time: number;
  success: boolean;
  response?: string;
  error?: string;
  timestamp: string;
}

export interface StreamItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'status' | 'analysis' | 'error';
}

export interface Stats {
  screenshots_taken: number;
  analyses_completed: number;
  analyses_failed: number;
  avg_analysis_time: number;
  success_rate: number;
  runtime: number;
}

export interface AppState {
  isConnected: boolean;
  isMonitoring: boolean;
  screenshots: Screenshot[];
  currentScreenshot: Screenshot | null;
  streamItems: StreamItem[];
  stats: Stats;
}

export type SocketEventData = {
  status_update: { message: string; timestamp: string };
  new_screenshot: Screenshot;
  analysis_result: AnalysisResult;
  stats_update: Stats;
  error_message: { message: string; timestamp: string };
};