# Vision Model Benchmark Results

Test conducted at: 2025-09-19 23:20:52

| Rank | Model Name | Model ID | Context | Analyze Time (s) | Status | Error |
|------|------------|----------|---------|------------------|--------|-------|
| 1 | Google: Gemini 2.0 Flash Experimental | `google/gemini-2.0-flash-exp:free` | 1,048,576 | 5.140 | ✓ Success | - |
| 2 | MoonshotAI: Kimi VL A3B Thinking | `moonshotai/kimi-vl-a3b-thinking:free` | 131,072 | 7.646 | ✓ Success | - |
| 3 | Meta: Llama 4 Scout | `meta-llama/llama-4-scout:free` | 128,000 | 9.048 | ✓ Success | - |
| 4 | Meta: Llama 4 Maverick | `meta-llama/llama-4-maverick:free` | 128,000 | 9.193 | ✓ Success | - |
| 5 | Mistral: Mistral Small 3.2 24B | `mistralai/mistral-small-3.2-24b-instruct:free` | 131,072 | 9.844 | ✓ Success | - |
| 6 | Qwen: Qwen2.5 VL 32B Instruct | `qwen/qwen2.5-vl-32b-instruct:free` | 8,192 | 11.399 | ✓ Success | - |
| 7 | Google: Gemma 3 4B | `google/gemma-3-4b-it:free` | 32,768 | 15.602 | ✓ Success | - |
| 8 | Google: Gemma 3 27B | `google/gemma-3-27b-it:free` | 96,000 | 15.970 | ✓ Success | - |
| 9 | Google: Gemma 3 12B | `google/gemma-3-12b-it:free` | 32,768 | 16.078 | ✓ Success | - |
| 10 | Mistral: Mistral Small 3.1 24B | `mistralai/mistral-small-3.1-24b-instruct:free` | 128,000 | 19.492 | ✓ Success | - |
| 11 | Qwen: Qwen2.5 VL 72B Instruct | `qwen/qwen2.5-vl-72b-instruct:free` | 32,768 | 25.060 | ✓ Success | - |
| 12 | xAI: Grok 4 Fast | `x-ai/grok-4-fast:free` | 2,000,000 | 56.638 | ✓ Success | - |
| 13 | Sonoma Dusk Alpha | `openrouter/sonoma-dusk-alpha` | 2,000,000 | 0.588 | ✗ Failed | HTTP 404: {"error":{"message":"No endpoints fou... |
| 14 | Sonoma Sky Alpha | `openrouter/sonoma-sky-alpha` | 2,000,000 | 0.773 | ✗ Failed | HTTP 404: {"error":{"message":"No endpoints fou... |

## Summary

- Total models tested: 14
- Successful: 12
- Failed: 2
- Fastest successful: 5.140s (Google: Gemini 2.0 Flash Experimental)
- Slowest successful: 56.638s
- Average time: 16.759s
