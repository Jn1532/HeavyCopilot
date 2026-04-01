# HeavyCopilot

An AI-powered construction job assistant built for   HeavyJob workflows. Ask natural language questions about job budgets, production, and variances — and get streamed answers backed by real construction data.

![Demo](https://img.shields.io/badge/status-Phase%201%20Complete-brightgreen)

## What it does

- Ask "Show me over-budget jobs" and get a live answer with variance percentages
- Ask "What's the production on JH-2025-001?" and get crew/equipment details
- Streaming responses (SSE) so answers appear token-by-token
- Conversation history — context is preserved across messages in the same session
- Slide-out chat panel styled after   Chats

## Tech stack

| Layer | Tech |
|---|---|
| Backend | .NET 10, ASP.NET Core, Semantic Kernel 1.74 |
| LLM | Ollama (Qwen3.5:27b) or Azure OpenAI (switchable) |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Streaming | Server-Sent Events (SSE) |

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Ollama](https://ollama.ai/) with `qwen3.5:27b` pulled, **or** an Azure OpenAI deployment

### 1. Start the API

```bash
cd HeavyCopilot.Api
dotnet run
# API runs at https://localhost:5001
# Swagger UI at https://localhost:5001/swagger
```

### 2. Configure the LLM

Edit `HeavyCopilot.Api/appsettings.json`:

```json
{
  "AI": {
    "Provider": "Ollama",
    "OllamaModel": "qwen3.5:27b"
  }
}
```

To use Azure OpenAI instead, set `"Provider": "AzureOpenAI"` and fill in `AzureDeployment`, `AzureEndpoint`, and `AzureApiKey`.

### 3. Start the frontend

```bash
cd HeavyCopilot.Ui
cp .env.example .env          # API URL defaults to https://localhost:5001
npm install
npm run dev
# App at http://localhost:5173
```

## Try these prompts

- "How are my jobs performing this week?"
- "Show me over-budget jobs"
- "What is the variance on JH-2025-002?"
- "Summarize production for IH-10 Highway"

## Project structure

```
HeavyCopilot/
├── HeavyCopilot.Api/
│   ├── Controllers/ChatController.cs   # SSE streaming endpoint
│   ├── Plugins/JobDataPlugin.cs        # Semantic Kernel functions
│   └── Models/                         # Job, ProductionEntry
└── HeavyCopilot.Ui/
    └── src/
        ├── App.tsx                     # Dashboard shell
        └── components/ChatPanel.tsx    # Slide-out chat UI
```

## Roadmap

- [ ] Phase 2: RAG — document upload, embeddings, retrieval from company docs
- [ ] Real HeavyJob API integration
- [ ] Multi-project support
