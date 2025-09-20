#!/usr/bin/env python3
"""
Screen Activity Monitor using OpenRouter API
"""

import time
import os
from utils import capture_screenshot, resize_to_1536x864, analyze_screenshot_with_model, save_screenshot

def main():
    try:
        # Capture and analyze screenshots one by one
        count = 1
        interval = 1
        print(f"Starting capture sequence: {count} screenshot(s), {interval}s apart...")

        # Create screenshots directory if it doesn't exist
        os.makedirs("screenshots", exist_ok=True)

        start_time = time.time()

        for i in range(count):
            capture_start = time.time()
            print(f"\nCapturing screenshot {i+1}/{count}")

            # Capture screenshot
            screenshot = capture_screenshot()

            # Resize to 1536x864
            resized_screenshot = resize_to_1536x864(screenshot)
            print(f"Resized to {resized_screenshot.size}")

            # Save screenshot
            timestamp = int(time.time())
            filename = f"screenshots/screenshot_{timestamp}_{i+1}.png"
            file_size_kb = save_screenshot(resized_screenshot, filename)

            capture_end = time.time()
            capture_time = capture_end - capture_start

            print(f"Saved: {filename} ({file_size_kb:.1f}KB, capture: {capture_time:.3f}s)")

            # Analyze screenshot
            analyze_start = time.time()
            result = analyze_screenshot_with_model(resized_screenshot, i+1, model="google/gemini-2.0-flash-exp:free")
            analyze_end = time.time()
            analyze_time = analyze_end - analyze_start

            print("\n" + "="*50)
            if result["success"]:
                print(f"ANALYSIS - SCREENSHOT {i+1} (analysis: {analyze_time:.3f}s)")
                print("="*50)
                print(result["response"])
            else:
                print(f"ANALYSIS FAILED - SCREENSHOT {i+1} (analysis: {analyze_time:.3f}s)")
                print("="*50)
                print(f"Error: {result['error']}")

            if i < count - 1:  # Don't sleep after the last screenshot
                print(f"\nWaiting {interval}s before next capture...")
                time.sleep(interval)

        total_time = time.time() - start_time
        print(f"\nTotal sequence completed in: {total_time:.3f}s")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()