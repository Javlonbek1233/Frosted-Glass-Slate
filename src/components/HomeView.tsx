/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, Cpu, Sparkles, 
  ChevronRight, RefreshCw, Calendar, Flame, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coin, PortfolioStats, MarketTrend } from '../types';
import { CRYPTO_NEWS_HEADLINES } from '../constants';

interface HomeViewProps {
  coins: Coin[];
  portfolioStats: PortfolioStats;
  trend: MarketTrend;
  setActiveTab: (tab: string) => void;
  openAdvisor: () => void;
}

export default function HomeView({ coins, portfolioStats, trend, setActiveTab, openAdvisor }: HomeViewProps) {
  const [tickerFlash, setTickerFlash] = useState<Record<string, 'up' | 'down' | null>>({});
  const [orderBook, setOrderBook] = useState<{ id: string; type: 'buy' | 'sell'; symbol: string; size: string; price: string; time: string }[]>([]);
  
  // Track previous prices to determine flash directions
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});

  // Generate real-time order-book data simulating high frequency updates on a premium portal
  useEffect(() => {
    // Initial batch
    const initialOrders = Array.from({ length: 6 }).map((_, i) => generateMockOrder());
    setOrderBook(initialOrders);

    const interval = setInterval(() => {
      setOrderBook(prev => [generateMockOrder(), ...prev.slice(0, 5)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [coins]);

  function generateMockOrder() {
    if (coins.length === 0) return { id: '', type: 'buy' as const, symbol: 'BTC', size: '0.0', price: '0.0', time: '' };
    const coin = coins[Math.floor(Math.random() * coins.length)];
    const isBuy = Math.random() > 0.45;
    const size = (Math.random() * 2.5 + 0.01).toFixed(4);
    const deviation = (Math.random() - 0.5) * 0.002 * coin.price;
    const finalPrice = (coin.price + deviation).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    return {
      id: Math.random().toString(),
      type: isBuy ? ('buy' as const) : ('sell' as const),
      symbol: coin.symbol,
      size,
      price: finalPrice,
      time
    };
  }

  // Handle flash animations when props update prices
  useEffect(() => {
    const newFlash: Record<string, 'up' | 'down' | null> = {};
    let changed = false;

    coins.forEach(coin => {
      const prevPrice = prevPrices[coin.id];
      if (prevPrice !== undefined && prevPrice !== coin.price) {
        newFlash[coin.id] = coin.price > prevPrice ? 'up' : 'down';
        changed = true;
      } else {
        newFlash[coin.id] = null;
      }
    });

    if (changed) {
      setTickerFlash(newFlash);
      const timer = setTimeout(() => {
        setTickerFlash({});
      }, 800);
      
      // Update our cache of previous prices
      const cache: Record<string, number> = {};
      coins.forEach(c => { cache[c.id] = c.price; });
      setPrevPrices(cache);

      return () => clearTimeout(timer);
    } else {
      // First run or no change, update cache
      const cache: Record<string, number> = {};
      coins.forEach(c => { cache[c.id] = c.price; });
      setPrevPrices(cache);
    }
  }, [coins]);

  // Derive hot dynamic statistics
  const topGainer = [...coins].sort((a, b) => b.change24h - a.change24h)[0];
  const totalAssetsValue = coins.reduce((acc, c) => acc + (c.price * c.balance), 0);

  const trendMetadata = {
    stable: { label: 'MARKET STABLE', color: 'text-neon-blue border-neon-blue/30 bg-neon-blue/5' },
    bull: { label: 'BULL RUN INTENSE', color: 'text-neon-green border-neon-green/35 bg-neon-green/5' },
    bear: { label: 'BEAR REVERSAL', color: 'text-neon-pink border-neon-pink/35 bg-neon-pink/5' },
    volatile: { label: 'HIGH VOLATILITY', color: 'text-neon-yellow border-neon-yellow/35 bg-neon-yellow/5' },
    'flash-crash': { label: 'CRITICAL LIQUIDATION', color: 'text-neon-pink border-red-500/50 bg-red-500/10 animate-pulse' },
  };

  return (
    <div className="space-y-8 pb-10" id="home-dashboard">
      {/* Top Banner Overview with Real-Time Data Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#22263f]/50 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">Aetheris Sovereign Ledger</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-extrabold ${trendMetadata[trend].color}`}>
              {trendMetadata[trend].label}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Quantum Suite <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">Enterprise</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 font-mono text-xs">
          <Calendar className="w-4 h-4 text-[#8f96b3]" />
          <span className="text-[#8f96b3]">SYSTEM TIME (UTC):</span>
          <span className="text-white font-semibold glow-text-blue">2026-05-25 07:29</span>
        </div>
      </div>

      {/* Main Grid: Balance & Fast Stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neon Glowing Balance Box */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl glass-panel animate-glow-purple p-6 border-l-2 border-l-neon-purple/80">
          <div className="absolute right-0 top-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute left-6 top-6">
            <Cpu className="w-9 h-9 text-neon-purple/50 animate-pulse" />
          </div>
          
          <div className="text-right mb-8">
            <span className="text-[10px] font-mono tracking-widest text-[#8f96b3] uppercase">Consolidated Liquid Portfolio Value</span>
            
            {/* Real-time animated counters */}
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mt-1">
              ${totalAssetsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center justify-end space-x-2 mt-1.5 font-mono text-sm leading-none">
              <span className={`inline-flex items-center font-semibold ${portfolioStats.balanceChange24hPercent >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                {portfolioStats.balanceChange24hPercent >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-0.5" />
                )}
                {portfolioStats.balanceChange24hPercent >= 0 ? '+' : ''}
                {portfolioStats.balanceChange24hPercent.toFixed(2)}%
              </span>
              <span className="text-[#515775]">/ 24h delta</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="text-left">
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wide">EST. Yield (APY)</span>
              <span className="text-lg font-display font-semibold text-white mt-1 block tracking-wide">12.85%</span>
            </div>
            <div className="text-left border-l border-white/5 pl-4">
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wide">Total All-Time PnL</span>
              <span className="text-lg font-display font-semibold text-neon-green mt-1 block tracking-wide">
                +${portfolioStats.profitAllTimeUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="text-left border-l border-white/5 pl-4">
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wide">Simulation Lever</span>
              <span className="text-lg font-display font-semibold text-neon-blue mt-1 block tracking-wide uppercase">
                {trend === 'bull' ? 'LEVEL-IV APEX' : 'STABLE-LITE'}
              </span>
            </div>
          </div>
        </div>

        {/* Hot Highlights Card */}
        <div id="hot-highlights-card" className="flex flex-col justify-between rounded-2xl glass-panel p-6 relative">
          <div className="absolute right-4 top-4">
            <Flame className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-2 tracking-wide">Dynamic Insights</h3>
            <p className="text-xs text-[#8f96b3] leading-relaxed mb-4">
              Aetheris algorithms continuously analyze simulated blockchain transactions and liquidity movements. Touch any item to inspect details.
            </p>
          </div>

          <div className="space-y-3">
            {/* Dynamic Market Hot Gainer */}
            <div 
              onClick={() => setActiveTab('markets')} 
              className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: topGainer?.color || '#a855f7' }}
                />
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wide">TOP GAINER</span>
                  <span className="text-xs font-semibold text-white tracking-wide">{topGainer?.name || 'Solana'} ({topGainer?.symbol || 'SOL'})</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-md border border-neon-green/20 font-sans">
                +{topGainer?.change24h.toFixed(2)}%
              </span>
            </div>

            {/* AI Advisor Card Link */}
            <div 
              onClick={openAdvisor}
              className="group flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/40 cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wide">AETHERIS CONSULTANT</span>
                  <span className="text-xs font-semibold text-white tracking-wide group-hover:text-cyan-400 transition-colors">Quantum AI Advice</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Prices Spark ticker & Cyber Order Book */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Price Index Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-lg text-white font-semibold">Active Smart Contracts Index</h3>
            <button 
              onClick={() => setActiveTab('markets')} 
              className="text-xs font-mono text-neon-blue flex items-center space-x-1.5 hover:underline"
            >
              <span>EXPLORE ALL MARKTETS</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coins.slice(0, 4).map((coin) => {
              const isUp = coin.change24h >= 0;
              const flash = tickerFlash[coin.id];
              return (
                <div 
                  key={coin.id}
                  id={`home-coin-card-${coin.id}`}
                  onClick={() => setActiveTab('markets')}
                  className={`group relative p-4 rounded-xl glass-panel hover:border-neon-blue/40 transition-all duration-300 cursor-pointer overflow-hidden ${
                    flash === 'up' ? 'border-neon-green ring-1 ring-neon-green/30 bg-neon-green/5' : 
                    flash === 'down' ? 'border-neon-pink ring-1 ring-neon-pink/30 bg-neon-pink/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-white border border-white/10 bg-white/5"
                        style={{ boxShadow: `0 0 10px ${coin.color}20`, borderLeftColor: coin.color, borderLeftWidth: '3px' }}
                      >
                        {coin.symbol}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white tracking-wide group-hover:text-cyan-400 transition-colors">{coin.name}</h4>
                        <span className="text-[10px] font-mono text-[#6c7293]">{coin.symbol} CONTRACT</span>
                      </div>
                    </div>
                    {/* Price with neon color flashing effect */}
                    <div className="text-right">
                      <span className={`block font-mono text-sm font-semibold transition-colors duration-300 ${
                        flash === 'up' ? 'text-neon-green' : 
                        flash === 'down' ? 'text-neon-pink' : 'text-white'
                      }`}>
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`inline-flex items-center font-mono text-[10px] font-semibold ${isUp ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {isUp ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Microspark area representation in background to show real-time vibe */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#111322]/80">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: coin.color, 
                        width: `${Math.min(100, Math.max(10, (coin.price / coin.high24h) * 100))}%`,
                        opacity: 0.7 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Order Ledger Book Scrolling */}
        <div id="realtime-order-book" className="rounded-2xl glass-panel p-5 flex flex-col justify-between max-h-[290px] overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="font-display text-sm font-bold text-white tracking-wide">QUANT HIGH-FREQ LEDGER</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-400/10 px-1.5 py-0.5 rounded tracking-widest font-bold">LIVE STREAM</span>
            </div>

            <div className="space-y-2 overflow-hidden h-[190px]">
              <AnimatePresence initial={false}>
                {orderBook.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="flex items-center justify-between font-mono text-[10px] py-1 border-b border-white/5 last:border-0"
                  >
                    <span className="text-[#6c7293]">{order.time}</span>
                    <span className={`font-semibold tracking-wide uppercase px-1 py-0.2 rounded ${order.type === 'buy' ? 'text-neon-green bg-neon-green/5' : 'text-neon-pink bg-neon-pink/5'}`}>
                      {order.type} {order.symbol}
                    </span>
                    <span className="text-white text-right">{order.size}</span>
                    <span className={`text-right font-semibold ${order.type === 'buy' ? 'text-neon-green' : 'text-neon-pink'}`}>
                      ${order.price}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Cyber News Updates */}
      <div className="space-y-4">
        <h3 className="font-display font-medium text-lg text-white font-semibold">Decentralized Intelligence Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRYPTO_NEWS_HEADLINES.map((news) => (
            <div 
              key={news.id} 
              id={`news-feed-${news.id}`} 
              className="p-4 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-[#6c7293] tracking-wider uppercase">{news.source}</span>
                  <span className="text-[9px] font-mono text-[#515775]">{news.time}</span>
                </div>
                <h4 className="text-xs font-semibold text-white leading-relaxed line-clamp-3 font-display">
                  {news.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400">
                  #{news.category}
                </span>
                <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                  news.sentiment === 'bullish' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/10'
                }`}>
                  {news.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
