import { useState } from 'react';
import ChatPanel from './components/ChatPanel';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">HeavyCopilot Demo</h1>
            <p className="text-slate-400 mt-2">HCSS-style Construction AI Assistant • Phase 1</p>
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-6 py-3 bg-hcss-orange hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2"
          >
            {isChatOpen ? 'Close Chat' : 'Open HeavyCopilot'}
          </button>
        </div>

        {/* Mock HeavyJob Dashboard */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-hcss-orange">IH-10 Highway Widening</h3>
            <p className="text-3xl font-bold mt-4">On Track</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-red-400">Baytown Bridge</h3>
            <p className="text-3xl font-bold mt-4 text-red-400">Over Budget</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold">Clear Lake Sewer</h3>
            <p className="text-3xl font-bold mt-4">On Track</p>
          </div>
        </div>

        {/* The Real HCSS-style Slide-out Chat Panel */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}

export default App;
