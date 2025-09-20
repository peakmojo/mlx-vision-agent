#!/usr/bin/env python3
"""
Shared utilities for screenshot capture and image processing
"""

import time
import base64
import io
import os
import requests
from PIL import Image
import mss
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def capture_screenshot():
    """Capture screenshot using MSS"""
    with mss.mss() as sct:
        monitor = sct.monitors[1]  # Primary monitor
        screenshot_raw = sct.grab(monitor)
        screenshot = Image.frombytes("RGB", screenshot_raw.size, screenshot_raw.bgra, "raw", "BGRX")
    return screenshot

def resize_to_1536x864(image):
    """Resize image to 1536x864 maintaining aspect ratio"""
    target_width = 1536
    target_height = 864

    # Calculate aspect ratio preserving size
    ratio = min(target_width/image.size[0], target_height/image.size[1])
    new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))

    # Resize with LANCZOS
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    return resized

def image_to_base64(image):
    """Convert PIL Image to base64 string"""
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode('utf-8')

def analyze_screenshot_with_model(screenshot, screenshot_num, model="google/gemini-2.0-flash-exp:free"):
    """Send screenshot to OpenRouter API for analysis"""
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY environment variable not set")

    # Convert image to base64
    base64_image = image_to_base64(screenshot)

    # Prepare the message content
    content = [
        {
            "type": "text",
            "text": """Analyze this screenshot. Report observations:

SCREEN ELEMENTS: Identify windows, applications, UI components, text fields, buttons, menus, cursors, highlighting.
ACTIONS: Document any visible interactions - mouse position, selections, active elements.
CONTENT: Capture all visible TEXT strictly from the screen.

Be precise. Use technical terminology. Report only what is visible."""
        },
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{base64_image}"
            }
        }
    ]

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": content
            }
        ],
        "max_tokens": 1000
    }

    start_time = time.time()
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=60
        )
        end_time = time.time()

        if response.status_code == 200:
            result = response.json()
            return {
                "success": True,
                "time": end_time - start_time,
                "response": result['choices'][0]['message']['content'],
                "error": None
            }
        else:
            return {
                "success": False,
                "time": end_time - start_time,
                "response": None,
                "error": f"HTTP {response.status_code}: {response.text}"
            }
    except Exception as e:
        end_time = time.time()
        return {
            "success": False,
            "time": end_time - start_time,
            "response": None,
            "error": str(e)
        }

def save_screenshot(image, filename):
    """Save screenshot to file"""
    os.makedirs("screenshots", exist_ok=True)
    image.save(filename)
    file_size_kb = os.path.getsize(filename) / 1024
    return file_size_kb