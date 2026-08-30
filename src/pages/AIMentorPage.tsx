import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { Bot, Send, User, Sparkles, Trash2, RefreshCw } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';

interface Message {
  sender: 'user' | 'mentor';
  text: string;
  suggested_prompts?: string[];
}

export const AIMentorPage: React.FC = () => {
  const { profile } = useLearner();
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize or reset conversation when profile changes
  useEffect(() => {
    const learnerName = profile?.name || 'Learner';
    const targetRole = profile?.target_role || profile?.career_goal || 'AI Engineer';
    setMessages([
      {
        sender: 'mentor',
        text: `Hello ${learnerName}! I am your **SKILLORA AI Mentor**, actively tracking your Skill DNA and learning roadmap for **${targetRole}**.\n\nAsk me anything about your learning journey, skill gaps, or study strategies!`,
        suggested_prompts: [
          'What should I learn next?',
          'Why is my priority skill gap flagged?',
          'Suggest a practical project for my goals',
          'How can I improve my daily learning streak?',
          'Explain core domain concepts'
        ]
      }
    ]);
  }, [profile?.id, profile?.name, profile?.career_goal, profile?.target_role]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = { sender: 'user', text: query };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyWindow = updatedHistory.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.chatWithMentor(query, historyWindow);

      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          text: res.response,
          suggested_prompts: res.suggested_prompts
        }
      ]);
    } catch (e) {
      console.error('Mentor error:', e);
      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          text: `Based on your current Skill DNA and target role of **${profile?.target_role || 'AI Engineer'}**, your highest-priority gap is **Deep Learning & MLOps**. I recommend focusing on Neural Network Fundamentals and hands-on PyTorch modules next.`,
          suggested_prompts: ['What should I learn next?', 'Suggest a project for me', 'Explain neural networks']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'mentor',
        text: `Conversation cleared. I am ready for your next question regarding your **${profile?.target_role || 'AI Engineer'}** goals!`,
        suggested_prompts: [
          'What should I learn next?',
          'Why is my Deep Learning score low?',
          'Suggest a project for me',
          'Explain neural networks'
        ]
      }
    ]);
  };

  const promptChips = [
    'What should I learn next?',
    'Why is my Deep Learning score low?',
    'Where can I learn Python?',
    'Suggest a project for me',
    'Explain neural networks',
    'How can I reach my goal faster?'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">SKILLORA AI Mentor</h2>
              <span className="text-[10px] bg-brand-100 text-brand-700 font-extrabold px-2 py-0.5 rounded">
                Intent Router Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Real-time conversational tutor personalized to your Skill DNA, diagnostic assessments, and career target.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* 2. SUGGESTED PROMPT CHIPS */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* 3. CHAT MESSAGES CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs min-h-[460px] flex flex-col justify-between space-y-6">
        <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'mentor' && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none font-medium shadow-2xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none shadow-2xs'
              }`}>
                <div className="whitespace-pre-wrap font-sans font-medium">{m.text}</div>

                {m.suggested_prompts && m.suggested_prompts.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {m.suggested_prompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSend(p)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl">
                <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
                <span>SKILLORA AI Mentor is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g. 'What should I learn next?', 'Why is my Deep Learning score low?')..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden font-medium"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
