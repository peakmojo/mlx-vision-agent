#!/usr/bin/env python3
"""
Launch the Live Screen Analysis Dashboard
Simple launcher for the web-based streaming interface
"""

import webbrowser
import time
import threading
from web_app import socketio, app

def open_browser():
    """Open browser after a short delay"""
    time.sleep(1.5)
    webbrowser.open('http://localhost:8080')

if __name__ == '__main__':
    print("🚀 Starting Live Screen Analysis Dashboard...")
    print("📱 Dashboard will open automatically in your browser")
    print("🌐 Or visit: http://localhost:8080")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 60)

    # Open browser in background thread
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()

    # Start the web server
    try:
        socketio.run(app, host='0.0.0.0', port=8080, debug=False)
    except KeyboardInterrupt:
        print("\n🛑 Dashboard stopped")
    except Exception as e:
        print(f"❌ Error starting dashboard: {e}")