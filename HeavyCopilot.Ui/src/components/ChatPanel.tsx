import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:5001';
const STORAGE_KEY = 'heavycopilot-messages';
const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: "Hello! I'm HeavyCopilot. Ask me anything about your jobs, budgets, production, or variances.",
};

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  } catch {
    return [INITIAL_MESSAGE];
  }
}

export default function ChatPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const toSave = messages.filter(m => !m.isStreaming);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [messages]);

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    const historySnapshot = messages.filter(m => !m.isStreaming);

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historySnapshot.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep any incomplete last line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + data }
                : msg
            ));
          }
        }
      }

      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
      ));
    } catch {
      setMessages(prev => [
        ...prev.filter(m => m.id !== assistantMessageId),
        {
          id: assistantMessageId,
          role: 'assistant',
          content: "Sorry, I couldn't connect to the backend. Make sure the .NET API is running on " + API_URL,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "How are my jobs performing this week?",
    "Show me over-budget jobs",
    "What is the variance on JH-2025-002?",
    "Summarize production for IH-10 Highway",
  ];

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl slide-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-hcss-orange rounded-lg flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-white">HeavyCopilot</h2>
            <p className="text-xs text-slate-400">Ask about jobs • budgets • production</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearHistory} title="Clear history" className="text-slate-500 hover:text-slate-300">
            <Trash2 size={16} />
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user'
              ? 'bg-hcss-orange text-white'
              : 'bg-slate-800 text-slate-200'
              }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              {msg.isStreaming && <span className="animate-pulse">▋</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Example Prompts */}
      <div className="px-4 py-3 border-t border-slate-700 bg-slate-900">
        <div className="text-xs text-slate-400 mb-2">Quick questions:</div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-full text-slate-300 border border-slate-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your construction jobs..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-hcss-orange"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-5 bg-hcss-orange hover:bg-orange-600 disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-3">Powered by Semantic Kernel + Qwen3.5</p>
      </div>
    </div>
  );
}
