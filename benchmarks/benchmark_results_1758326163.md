# Vision Model Benchmark Results

Test conducted at: 2025-09-19 16:58:59

| Rank | Model Name | Model ID | Context | Analyze Time (s) | Status | Error |
|------|------------|----------|---------|------------------|--------|-------|
| 1 | xAI: Grok 4 Fast | `x-ai/grok-4-fast:free` | 2,000,000 | 4.868 | ✓ Success | - |
| 2 | Google: Gemini 2.0 Flash Experimental | `google/gemini-2.0-flash-exp:free` | 1,048,576 | 6.135 | ✓ Success | - |
| 3 | MoonshotAI: Kimi VL A3B Thinking | `moonshotai/kimi-vl-a3b-thinking:free` | 131,072 | 9.065 | ✓ Success | - |
| 4 | Meta: Llama 4 Maverick | `meta-llama/llama-4-maverick:free` | 128,000 | 9.320 | ✓ Success | - |
| 5 | Meta: Llama 4 Scout | `meta-llama/llama-4-scout:free` | 128,000 | 10.433 | ✓ Success | - |
| 6 | Qwen: Qwen2.5 VL 32B Instruct | `qwen/qwen2.5-vl-32b-instruct:free` | 8,192 | 10.669 | ✓ Success | - |
| 7 | Google: Gemma 3 4B | `google/gemma-3-4b-it:free` | 32,768 | 12.999 | ✓ Success | - |
| 8 | Mistral: Mistral Small 3.2 24B | `mistralai/mistral-small-3.2-24b-instruct:free` | 131,072 | 14.040 | ✓ Success | - |
| 9 | Google: Gemma 3 27B | `google/gemma-3-27b-it:free` | 96,000 | 14.068 | ✓ Success | - |
| 10 | Google: Gemma 3 12B | `google/gemma-3-12b-it:free` | 32,768 | 15.421 | ✓ Success | - |
| 11 | Qwen: Qwen2.5 VL 72B Instruct | `qwen/qwen2.5-vl-72b-instruct:free` | 32,768 | 22.639 | ✓ Success | - |
| 12 | Mistral: Mistral Small 3.1 24B | `mistralai/mistral-small-3.1-24b-instruct:free` | 128,000 | 29.004 | ✓ Success | - |
| 13 | Sonoma Dusk Alpha | `openrouter/sonoma-dusk-alpha` | 2,000,000 | 0.998 | ✗ Failed | HTTP 502: {"error":{"message":"Provider returne... |
| 14 | Sonoma Sky Alpha | `openrouter/sonoma-sky-alpha` | 2,000,000 | 1.176 | ✗ Failed | HTTP 502: {"error":{"message":"Provider returne... |

## Summary

- Total models tested: 14
- Successful: 12
- Failed: 2
- Fastest successful: 4.868s (xAI: Grok 4 Fast)
- Slowest successful: 29.004s
- Average time: 13.222s
