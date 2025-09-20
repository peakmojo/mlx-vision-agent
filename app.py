#!/usr/bin/env python3
"""
Live Screen Activity Monitor - Streaming Analysis
"""

import time
import os
import multiprocessing
from queue import Empty
from datetime import datetime
from utils import capture_screenshot, resize_to_1536x864, analyze_screenshot_with_model, save_screenshot

def analysis_worker(analysis_queue, result_queue, stop_event):
    """Worker process that handles AI analysis"""
    while not stop_event.is_set():
        try:
            # Get screenshot from analysis queue
            data = analysis_queue.get(timeout=1.0)
            if data is None:  # Poison pill
                break

            screenshot_num = data["screenshot_num"]
            screenshot = data["screenshot"]

            # Send analysis start update
            result_queue.put({
                "type": "status",
                "message": f"🤖 Analyzing screenshot #{screenshot_num} with AI model...",
                "timestamp": datetime.now().strftime("%H:%M:%S")
            })

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

            # Check if it's time for next capture
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
                filename = f"screenshots/live_{timestamp}_{screenshot_count}.png"
                file_size_kb = save_screenshot(resized_screenshot, filename)

                # Send capture complete update
                result_queue.put({
                    "type": "status",
                    "message": f"💾 Saved {filename} ({file_size_kb:.1f}KB)",
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

                # Queue screenshot for analysis (non-blocking)
                analysis_queue.put({
                    "screenshot_num": screenshot_count,
                    "screenshot": resized_screenshot
                })

                # Schedule next capture
                next_capture_time = current_time + 5.0

            # Short sleep to prevent busy waiting
            time.sleep(0.1)

    except Exception as e:
        result_queue.put({
            "type": "error",
            "message": f"Screenshot worker error: {str(e)}",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

def display_live_feed(result_queue):
    """Display streaming results as a live feed"""
    print("🔴 LIVE SCREEN ANALYSIS FEED")
    print("=" * 60)
    print("Running for 10 seconds with 5-second intervals...")
    print("=" * 60)

    while True:
        try:
            # Non-blocking queue check
            data = result_queue.get(timeout=0.1)

            timestamp = data.get("timestamp", "")

            if data["type"] == "status":
                print(f"[{timestamp}] {data['message']}")

            elif data["type"] == "analysis":
                print(f"\n[{timestamp}] 📊 ANALYSIS COMPLETE - Screenshot #{data['screenshot_num']}")
                print(f"[{timestamp}] ⚡ Analysis time: {data['analyze_time']:.2f}s")
                print("-" * 60)

                if data["result"]["success"]:
                    # Print analysis with line prefixes for live feed look
                    analysis_lines = data["result"]["response"].split('\n')
                    for line in analysis_lines:
                        if line.strip():
                            print(f"[{timestamp}] 🔍 {line}")
                else:
                    print(f"[{timestamp}] ❌ Analysis failed: {data['result']['error']}")

                print("-" * 60)

            elif data["type"] == "error":
                print(f"[{timestamp}] ❌ {data['message']}")

        except Empty:
            continue
        except KeyboardInterrupt:
            break

def main():
    try:
        # Create screenshots directory
        os.makedirs("screenshots", exist_ok=True)

        # Setup multiprocessing queues and events
        analysis_queue = multiprocessing.Queue()
        result_queue = multiprocessing.Queue()
        stop_event = multiprocessing.Event()

        # Start screenshot worker process
        screenshot_process = multiprocessing.Process(
            target=screenshot_worker,
            args=(analysis_queue, result_queue, stop_event)
        )
        screenshot_process.start()

        # Start analysis worker process
        analysis_process = multiprocessing.Process(
            target=analysis_worker,
            args=(analysis_queue, result_queue, stop_event)
        )
        analysis_process.start()

        # Start display in main thread
        start_time = time.time()

        try:
            while time.time() - start_time < 10.0:  # Run for 10 seconds
                display_live_feed(result_queue)

        except KeyboardInterrupt:
            print("\n🛑 Stopping live feed...")

        # Stop workers
        stop_event.set()

        # Send poison pill to analysis worker
        analysis_queue.put(None)

        # Wait for processes to finish
        screenshot_process.join(timeout=2)
        analysis_process.join(timeout=2)

        # Force terminate if still alive
        if screenshot_process.is_alive():
            screenshot_process.terminate()
            screenshot_process.join()

        if analysis_process.is_alive():
            analysis_process.terminate()
            analysis_process.join()

        # Display final summary
        elapsed = time.time() - start_time
        print(f"\n✅ Live feed completed in {elapsed:.1f}s")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()