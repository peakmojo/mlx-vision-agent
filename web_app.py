#!/usr/bin/env python3
"""
Web-based Live Screen Activity Monitor
Real-time streaming dashboard with Flask + SocketIO
"""

import time
import os
import multiprocessing
import threading
from datetime import datetime
from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, emit
from queue import Empty
from utils import capture_screenshot, resize_to_1536x864, analyze_screenshot_with_model, save_screenshot

# Flask app setup
app = Flask(__name__)
app.config['SECRET_KEY'] = 'screenshot_monitor_secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables for process management
screenshot_process = None
analysis_process = None
monitor_thread = None
stop_event = None
analysis_queue = None
result_queue = None

# Statistics tracking
stats = {
    "screenshots_taken": 0,
    "analyses_completed": 0,
    "analyses_failed": 0,
    "total_analysis_time": 0,
    "start_time": None,
    "screenshots": []  # Store recent screenshots info
}

def analysis_worker(analysis_queue, result_queue, stop_event):
    """Worker process that handles AI analysis"""
    while not stop_event.is_set():
        try:
            data = analysis_queue.get(timeout=1.0)
            if data is None:  # Poison pill
                break

            screenshot_num = data["screenshot_num"]
            screenshot = data["screenshot"]

            # Analyze screenshot
            analyze_start = time.time()
            result = analyze_screenshot_with_model(screenshot, screenshot_num, model="google/gemini-2.0-flash-exp:free")
            analyze_time = time.time() - analyze_start

            # Send analysis result
            result_queue.put({
                "type": "analysis",
                "screenshot_num": screenshot_num,
                "analyze_time": analyze_time,
                "result": result,
                "timestamp": datetime.now().strftime("%H:%M:%S")
            })

        except Exception as e:
            if not stop_event.is_set():
                result_queue.put({
                    "type": "error",
                    "message": f"Analysis worker error: {str(e)}",
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

def screenshot_worker(analysis_queue, result_queue, stop_event):
    """Worker process that captures screenshots every 5 seconds"""
    try:
        screenshot_count = 0
        next_capture_time = time.time()

        while not stop_event.is_set():
            current_time = time.time()

            if current_time >= next_capture_time:
                screenshot_count += 1

                # Send status update
                result_queue.put({
                    "type": "status",
                    "message": f"📸 Capturing screenshot #{screenshot_count}...",
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

                # Capture and process screenshot
                screenshot = capture_screenshot()
                resized_screenshot = resize_to_1536x864(screenshot)

                # Save screenshot
                timestamp = int(time.time())
                filename = f"live_{timestamp}_{screenshot_count}.png"
                filepath = f"screenshots/{filename}"
                file_size_kb = save_screenshot(resized_screenshot, filepath)

                # Send capture complete update
                result_queue.put({
                    "type": "screenshot",
                    "screenshot_num": screenshot_count,
                    "filename": filename,
                    "filepath": filepath,
                    "file_size_kb": file_size_kb,
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

                # Queue screenshot for analysis
                analysis_queue.put({
                    "screenshot_num": screenshot_count,
                    "screenshot": resized_screenshot
                })

                # Schedule next capture
                next_capture_time = current_time + 5.0

            time.sleep(0.1)

    except Exception as e:
        result_queue.put({
            "type": "error",
            "message": f"Screenshot worker error: {str(e)}",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

def monitor_results():
    """Monitor result queue and emit to web clients"""
    global stats

    while result_queue and not stop_event.is_set():
        try:
            data = result_queue.get(timeout=0.5)
            timestamp = data.get("timestamp", datetime.now().strftime("%H:%M:%S"))

            if data["type"] == "status":
                socketio.emit('status_update', {
                    'message': data['message'],
                    'timestamp': timestamp
                })

            elif data["type"] == "screenshot":
                stats["screenshots_taken"] += 1
                screenshot_info = {
                    'num': data['screenshot_num'],
                    'filename': data['filename'],
                    'filepath': data['filepath'],
                    'size_kb': data['file_size_kb'],
                    'timestamp': timestamp
                }

                # Keep only last 10 screenshots
                stats["screenshots"].append(screenshot_info)
                if len(stats["screenshots"]) > 10:
                    stats["screenshots"].pop(0)

                socketio.emit('new_screenshot', screenshot_info)
                socketio.emit('stats_update', get_current_stats())

            elif data["type"] == "analysis":
                if data["result"]["success"]:
                    stats["analyses_completed"] += 1
                    stats["total_analysis_time"] += data["analyze_time"]
                else:
                    stats["analyses_failed"] += 1

                socketio.emit('analysis_result', {
                    'screenshot_num': data['screenshot_num'],
                    'analyze_time': data['analyze_time'],
                    'success': data["result"]["success"],
                    'response': data["result"].get("response", ""),
                    'error': data["result"].get("error", ""),
                    'timestamp': timestamp
                })
                socketio.emit('stats_update', get_current_stats())

            elif data["type"] == "error":
                socketio.emit('error_message', {
                    'message': data['message'],
                    'timestamp': timestamp
                })

        except Empty:
            continue
        except Exception as e:
            print(f"Monitor error: {e}")

def get_current_stats():
    """Get current statistics"""
    runtime = 0
    if stats["start_time"]:
        runtime = time.time() - stats["start_time"]

    avg_analysis_time = 0
    if stats["analyses_completed"] > 0:
        avg_analysis_time = stats["total_analysis_time"] / stats["analyses_completed"]

    success_rate = 0
    total_analyses = stats["analyses_completed"] + stats["analyses_failed"]
    if total_analyses > 0:
        success_rate = (stats["analyses_completed"] / total_analyses) * 100

    return {
        'screenshots_taken': stats["screenshots_taken"],
        'analyses_completed': stats["analyses_completed"],
        'analyses_failed': stats["analyses_failed"],
        'avg_analysis_time': round(avg_analysis_time, 2),
        'success_rate': round(success_rate, 1),
        'runtime': round(runtime, 1)
    }

@app.route('/')
def index():
    """Serve the main dashboard"""
    return render_template('dashboard.html')

@app.route('/screenshots/<filename>')
def screenshot_file(filename):
    """Serve screenshot files"""
    return send_from_directory('screenshots', filename)

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    try:
        client_id = request.sid
    except:
        client_id = 'unknown'

    print(f"Client connected: {client_id}")
    emit('stats_update', get_current_stats())

    # Send recent screenshots
    for screenshot in stats["screenshots"]:
        emit('new_screenshot', screenshot)

@socketio.on('start_monitoring')
def handle_start_monitoring(data=None):
    """Start the monitoring process"""
    global screenshot_process, analysis_process, monitor_thread, stop_event, analysis_queue, result_queue, stats

    if screenshot_process and screenshot_process.is_alive():
        emit('error_message', {'message': 'Monitoring already running', 'timestamp': datetime.now().strftime("%H:%M:%S")})
        return

    # Reset stats
    stats = {
        "screenshots_taken": 0,
        "analyses_completed": 0,
        "analyses_failed": 0,
        "total_analysis_time": 0,
        "start_time": time.time(),
        "screenshots": []
    }

    # Create screenshots directory
    os.makedirs("screenshots", exist_ok=True)

    # Setup queues and events
    analysis_queue = multiprocessing.Queue()
    result_queue = multiprocessing.Queue()
    stop_event = multiprocessing.Event()

    # Start processes
    screenshot_process = multiprocessing.Process(
        target=screenshot_worker,
        args=(analysis_queue, result_queue, stop_event)
    )
    screenshot_process.start()

    analysis_process = multiprocessing.Process(
        target=analysis_worker,
        args=(analysis_queue, result_queue, stop_event)
    )
    analysis_process.start()

    # Start monitoring thread
    monitor_thread = threading.Thread(target=monitor_results)
    monitor_thread.daemon = True
    monitor_thread.start()

    emit('status_update', {
        'message': '🚀 Live monitoring started!',
        'timestamp': datetime.now().strftime("%H:%M:%S")
    })

@socketio.on('stop_monitoring')
def handle_stop_monitoring(data=None):
    """Stop the monitoring process"""
    global screenshot_process, analysis_process, stop_event, analysis_queue

    if stop_event:
        stop_event.set()

    if analysis_queue:
        analysis_queue.put(None)  # Poison pill

    # Wait for processes to finish
    if screenshot_process:
        screenshot_process.join(timeout=2)
        if screenshot_process.is_alive():
            screenshot_process.terminate()
            screenshot_process.join()

    if analysis_process:
        analysis_process.join(timeout=2)
        if analysis_process.is_alive():
            analysis_process.terminate()
            analysis_process.join()

    emit('status_update', {
        'message': '🛑 Monitoring stopped',
        'timestamp': datetime.now().strftime("%H:%M:%S")
    })

if __name__ == '__main__':
    print("🌐 Starting Live Screen Analysis Dashboard...")
    print("📱 Open your browser to: http://localhost:8080")
    socketio.run(app, host='0.0.0.0', port=8080, debug=False)