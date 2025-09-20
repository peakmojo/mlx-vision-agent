#!/usr/bin/env python3
"""
Vision Model Benchmarking Script
Tests free vision models from OpenRouter and compares their performance
"""

import time
import os
from utils import capture_screenshot, resize_to_1536x864, analyze_screenshot_with_model, save_screenshot

# All free models from the list - testing which ones support vision
ALL_MODELS = [
    {
        "name": "Meta: Llama 4 Maverick",
        "id": "meta-llama/llama-4-maverick:free",
        "context": "128,000"
    },
    {
        "name": "Mistral: Mistral Small 3.1 24B",
        "id": "mistralai/mistral-small-3.1-24b-instruct:free",
        "context": "128,000"
    },
    {
        "name": "Meta: Llama 4 Scout",
        "id": "meta-llama/llama-4-scout:free",
        "context": "128,000"
    },
    {
        "name": "MoonshotAI: Kimi VL A3B Thinking",
        "id": "moonshotai/kimi-vl-a3b-thinking:free",
        "context": "131,072"
    },
    {
        "name": "Sonoma Dusk Alpha",
        "id": "openrouter/sonoma-dusk-alpha",
        "context": "2,000,000"
    },
    {
        "name": "Google: Gemma 3 27B",
        "id": "google/gemma-3-27b-it:free",
        "context": "96,000"
    },
    {
        "name": "Qwen: Qwen2.5 VL 72B Instruct",
        "id": "qwen/qwen2.5-vl-72b-instruct:free",
        "context": "32,768"
    },
    {
        "name": "Mistral: Mistral Small 3.2 24B",
        "id": "mistralai/mistral-small-3.2-24b-instruct:free",
        "context": "131,072"
    },
    {
        "name": "Google: Gemini 2.0 Flash Experimental",
        "id": "google/gemini-2.0-flash-exp:free",
        "context": "1,048,576"
    },
    {
        "name": "Qwen: Qwen2.5 VL 32B Instruct",
        "id": "qwen/qwen2.5-vl-32b-instruct:free",
        "context": "8,192"
    },
    {
        "name": "Sonoma Sky Alpha",
        "id": "openrouter/sonoma-sky-alpha",
        "context": "2,000,000"
    },
    {
        "name": "xAI: Grok 4 Fast",
        "id": "x-ai/grok-4-fast:free",
        "context": "2,000,000"
    },
    {
        "name": "Google: Gemma 3 4B",
        "id": "google/gemma-3-4b-it:free",
        "context": "32,768"
    },
    {
        "name": "Google: Gemma 3 12B",
        "id": "google/gemma-3-12b-it:free",
        "context": "32,768"
    }
]

def test_model(model_info, screenshot):
    """Test a single model with the screenshot"""
    result = analyze_screenshot_with_model(screenshot, 1, model=model_info["id"])
    return result

def run_benchmark():
    """Run benchmark on all vision models"""
    print("Vision Model Benchmarking")
    print("=" * 50)

    # Capture test screenshot
    print("Capturing test screenshot...")
    screenshot = capture_screenshot()
    print(f"Original screenshot size: {screenshot.size}")

    # Resize to 1536x864
    screenshot = resize_to_1536x864(screenshot)
    print(f"Resized to {screenshot.size}")

    # Save test screenshot
    timestamp = int(time.time())
    test_filename = f"screenshots/benchmark_test_{timestamp}.png"
    file_size_kb = save_screenshot(screenshot, test_filename)
    print(f"Test screenshot saved: {test_filename} ({file_size_kb:.1f}KB)")

    results = []

    for i, model in enumerate(ALL_MODELS):
        print(f"\nTesting {i+1}/{len(ALL_MODELS)}: {model['name']}")
        print(f"Model ID: {model['id']}")

        result = test_model(model, screenshot)

        results.append({
            "model": model,
            "result": result
        })

        if result["success"]:
            print(f"✓ Success in {result['time']:.3f}s")
            print(f"Response length: {len(result['response'])} chars")
        else:
            print(f"✗ Failed in {result['time']:.3f}s")
            print(f"Error: {result['error']}")

        # Small delay between requests
        time.sleep(1)

    # Sort by analyze time (successful ones first, then by time)
    results.sort(key=lambda x: (not x["result"]["success"], x["result"]["time"]))

    # Generate markdown table
    markdown = generate_markdown_table(results)

    # Save results
    results_filename = f"benchmark_results_{timestamp}.md"
    with open(results_filename, 'w') as f:
        f.write(markdown)

    print(f"\n\nResults saved to: {results_filename}")
    print("\n" + markdown)

def generate_markdown_table(results):
    """Generate markdown table from results"""
    markdown = "# Vision Model Benchmark Results\n\n"
    markdown += f"Test conducted at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n"

    markdown += "| Rank | Model Name | Model ID | Context | Analyze Time (s) | Status | Error |\n"
    markdown += "|------|------------|----------|---------|------------------|--------|-------|\n"

    for i, item in enumerate(results):
        model = item["model"]
        result = item["result"]

        rank = i + 1
        name = model["name"]
        model_id = model["id"]
        context = model["context"]
        analyze_time = f"{result['time']:.3f}"
        status = "✓ Success" if result["success"] else "✗ Failed"
        error = result["error"] if result["error"] else "-"

        # Truncate long errors
        if len(error) > 50:
            error = error[:47] + "..."

        markdown += f"| {rank} | {name} | `{model_id}` | {context} | {analyze_time} | {status} | {error} |\n"

    # Add summary statistics
    successful_results = [r for r in results if r["result"]["success"]]
    if successful_results:
        markdown += f"\n## Summary\n\n"
        markdown += f"- Total models tested: {len(results)}\n"
        markdown += f"- Successful: {len(successful_results)}\n"
        markdown += f"- Failed: {len(results) - len(successful_results)}\n"

        if successful_results:
            times = [r["result"]["time"] for r in successful_results]
            markdown += f"- Fastest successful: {min(times):.3f}s ({successful_results[0]['model']['name']})\n"
            markdown += f"- Slowest successful: {max(times):.3f}s\n"
            markdown += f"- Average time: {sum(times)/len(times):.3f}s\n"

    return markdown

if __name__ == "__main__":
    run_benchmark()