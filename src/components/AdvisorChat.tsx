/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, Cpu, Calendar, Dot, Terminal,
  MessageSquare, RefreshCw, ChevronLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coin, PortfolioStats, MarketTrend, ChatMessage } from '../types';

interface AdvisorChatProps {
  isOpen: boolean;
  onClose: () => void;
  coins: Coin[];
  portfolioStats: PortfolioStats;
  trend: MarketTrend;
}

export default function AdvisorChat({ isOpen, onClose, coins, portfolioStats, trend }: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: "Secured connection established. I am **AETHERIS AI**, your quantum financial strategist.\n\nAnalyzing your current simulated ledger, balances, and allocations...\n\nHow should I configure your portfolio allocations under current market indexes?",
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioStats,
          coins,
          trend,
          userQuery: textToSend,
          messageHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }))
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.response) {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'assistant',
          text: data.response,
          timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Connection leak detected during token transmission.');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: `⚠️ **Aetheris Network Intercept Fail**: ${err?.message || "Verify your API key status in AI Studio Settings secrets panel. The server-side request context returned empty."}`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    { label: '📊 Risk Assessment', query: 'Please perform a comprehensive risk assessment of my allocation balance.' },
    { label: '🚀 Optimize APY Yield', query: 'How can I optimize my holdings to yield higher APY under this market setting?' },
    { label: '📈 Short-term Play Book', query: 'Under this trend simulation, what short-term tactical trades do you suggest?' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <div 
            className="fixed inset-0 bg-[#05060b]/80 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Floating Cyber Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md md:max-w-lg bg-[#090a12]/96 border-l border-[#22263f] shadow-[-10px_0_40px_rgba(5,6,11,0.8)] z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#22263f]">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-blue p-[1.5px] shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                    <div className="w-full h-full bg-[#090a12] rounded-[10px] flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5 text-neon-purple animate-pulse" />
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 bg-neon-green rounded-full border-2 border-[#090a12]" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-sm text-white font-bold tracking-wide flex items-center">
                    AETHERIS ADVISOR ORACLE
                  </h4>
                  <span className="block text-[8px] font-mono text-neon-blue tracking-widest uppercase font-semibold">Gemini 3.5 Cog Engine</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono leading-none bg-[#111322] border border-[#22263f] text-[#6c7293] px-2 py-1 rounded">
                  PORTFOLIO SYNC: ACTIVE
                </span>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-[#22263f] text-[#8f96b3] hover:text-white hover:bg-[#111322] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar space-y-4 max-h-[calc(100vh-178px)] bg-gradient-to-b from-[#090a12] to-[#07080f]">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col space-y-1.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-mono text-[9px] text-[#6c7293]">
                    <span>{msg.sender === 'user' ? 'Sarah Connor' : 'Aetheris System'}</span>
                    <span className="w-1.5 h-1.5 bg-[#22263f] rounded-full" />
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === 'user' 
                      ? 'bg-neon-blue/15 border border-neon-blue/30 text-white rounded-tr-none shadow-[0_4px_15px_rgba(6,182,212,0.1)]'
                      : 'bg-[#111322]/80 border border-[#22263f] text-[#ebecef] rounded-tl-none prose prose-invert max-w-none shadow-[0_4px_15px_rgba(5,6,11,0.3)]'
                  }`}>
                    {/* Basic Markdown representation inside prose safely */}
                    <div className="whitespace-pre-wrap select-text markdown-body">
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Dynamic rendering for highlighted bullet lines
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <strong key={lIdx} className="block text-white font-semibold font-display tracking-wide mt-2 text-[12.5px] uppercase text-neon-purple">{line.replace(/\*\*/g, '')}</strong>;
                        }
                        if (line.startsWith('- ')) {
                          return <p key={lIdx} className="pl-4 border-l border-neon-blue/30 py-0.5 my-1 text-[11px] font-mono text-[#8f96b3]">{line}</p>;
                        }
                        return <p key={lIdx} className="mb-2 last:mb-0 leading-[1.6]">{line.replace(/\*\*/g, '')}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col ml-1 space-y-1.5 mr-auto max-w-[85%]">
                  <span className="font-mono text-[9px] text-[#6c7293]">Consulting Aetheris Oracle AI...</span>
                  <div className="p-4 bg-[#111322]/50 rounded-2xl rounded-tl-none border border-[#22263f] flex items-center space-x-3.5">
                    {/* Pulsing loading spinner */}
                    <div className="w-5 h-5 border-2 border-t-transparent border-neon-purple animate-spin rounded-full" />
                    <span className="text-xs font-mono text-[#8f96b3]">Analyzing simulated support bounds...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Presets Menu & Input Area */}
            <div className="p-4 bg-[#090a12] border-t border-[#22263f] space-y-4">
              {/* Presets Grid */}
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar select-none">
                {presetQuestions.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(preset.query)}
                    className="shrink-0 bg-[#111322]/80 hover:bg-[#22263f] border border-[#22263f] hover:border-neon-purple/40 text-[10px] font-mono font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg text-white transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center space-x-2 relative"
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Terminal className="w-4 h-4 text-neon-purple animate-pulse" />
                </div>
                <input 
                  type="text"
                  placeholder="Query Aetheris Analyst (e.g. Optimize holdings)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-[#05060b]/90 border border-[#22263f] text-xs focus:border-neon-purple hover:border-[#22263f]/90 placeholder:text-[#515775] text-white focus:outline-none rounded-xl font-mono"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-tr from-neon-purple to-neon-blue hover:scale-105 active:scale-95 text-white disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
