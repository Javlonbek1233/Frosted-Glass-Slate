/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, Search, ArrowUpRight, ArrowDownRight, 
  DollarSign, ShoppingCart, Percent, AlertCircle, Sparkles, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { Coin, TransactionType } from '../types';

interface MarketsViewProps {
  coins: Coin[];
  onQuickTrade: (type: 'buy' | 'sell', coinId: string, amount: number, price: number) => { success: boolean; message: string };
}

export default function MarketsView({ coins, onQuickTrade }: MarketsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'majors' | 'gainers' | 'losers'>('all');
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0] || null);

  // Buy/Sell Quick controls state
  const [tradeType, setTradeType] = useState<TransactionType>('buy');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeStatus, setTradeStatus] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(tradeAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setTradeStatus({ status: 'error', message: 'Enter a valid amount.' });
      return;
    }

    const { success, message } = onQuickTrade(tradeType, selectedCoin.id, amountNum, selectedCoin.price);
    if (success) {
      setTradeStatus({ status: 'success', message });
      setTradeAmount('');
      // Trigger a visual confirmation success fade of balance updating
      setTimeout(() => {
        setTradeStatus({ status: null, message: '' });
      }, 3500);
    } else {
      setTradeStatus({ status: 'error', message });
    }
  };

  // Dynamic sorting and search filtering
  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'majors') {
      return coin.symbol === 'BTC' || coin.symbol === 'ETH' || coin.symbol === 'SOL';
    }
    if (activeFilter === 'gainers') {
      return coin.change24h > 0;
    }
    if (activeFilter === 'losers') {
      return coin.change24h < 0;
    }
    return true;
  }).sort((a, b) => b.marketCap - a.marketCap); // Default weight by large market caps

  // Fast pre-fill utility helper
  const prefillUSDCBalance = () => {
    const usdcCoin = coins.find(c => c.symbol === 'USDC');
    const usdcBalance = usdcCoin ? usdcCoin.balance : 0;
    if (tradeType === 'buy') {
      // Prefill max purchase amount based on available USDC cash divided by price of coin
      const maxAmt = usdcBalance / selectedCoin.price;
      setTradeAmount(maxAmt > 0 ? (maxAmt * 0.98).toFixed(4) : '0'); // Safe padding 98%
    } else {
      // Prefill maximum held coin assets
      setTradeAmount(selectedCoin.balance.toString());
    }
  };

  // Sparkline visual component using micro-sized Recharts elements safely!
  const SparklineRow = ({ history, color }: { history: number[]; color: string }) => {
    // Standard map formatting compatible with AreaChart expectations
    const data = history.map((p, i) => ({ id: i, val: p }));
    return (
      <div className="w-24 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 1, right: 1 }}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <XAxis hide />
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke={color} 
              strokeWidth={1.5} 
              fill={`url(#grad-${color})`} 
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10" id="markets-dashboard">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#22263f]/50 pb-6">
        <div>
          <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">AETHERIS FUTURES OVERVIEW</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
            Active Digital Assets
          </h2>
        </div>
        <div className="flex relative items-center max-w-sm w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-[#8f96b3] pointer-events-none" />
          <input 
            type="text"
            placeholder="Search assets by description or prefix..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Explorer Table Column (2/3 width) */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {/* Quick-filter tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex space-x-2">
              {(['all', 'majors', 'gainers', 'losers'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 border ${
                    activeFilter === filter 
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {filter} assets
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs text-[#6c7293] font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>SORTED WEIGHT: MARKET CAP</span>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <table className="w-full border-collapse text-left font-display">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] tracking-widest uppercase">
                  <th className="p-4">Currency</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">24h delta</th>
                  <th className="p-4 hidden sm:table-cell">Trend (24h)</th>
                  <th className="p-4 hidden sm:table-cell text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredCoins.map((coin) => {
                  const isSelected = selectedCoin?.id === coin.id;
                  const isUp = coin.change24h >= 0;
                  return (
                    <tr 
                      key={coin.id}
                      onClick={() => setSelectedCoin(coin)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-white/10 border-l-2 border-l-cyan-400' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white border border-white/5"
                            style={{ borderLeftColor: coin.color, borderLeftWidth: '3.5px', background: 'rgba(255, 255, 255, 0.05)' }}
                          >
                            {coin.symbol}
                          </div>
                          <div>
                            <span className="font-semibold block text-white group-hover:text-neon-blue transition-colors">{coin.name}</span>
                            <span className="text-[10px] font-mono text-[#6c7293] uppercase tracking-wide">{coin.symbol} Holding</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-white">
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center font-mono text-xs font-semibold ${isUp ? 'text-neon-green' : 'text-neon-pink'}`}>
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                          {isUp ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <SparklineRow history={coin.history1d} color={coin.color} />
                      </td>
                      <td className="p-4 hidden sm:table-cell text-right font-mono text-xs text-[#8f96b3]">
                        ${(coin.marketCap / 1e9).toFixed(2)} billion
                      </td>
                    </tr>
                  );
                })}

                {filteredCoins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#6c7293] font-mono text-xs">
                      No quantum digital assets matching queried credentials.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Asset Interactive Panel (1/3 width) */}
        <div>
          <AnimatePresence mode="wait">
            {selectedCoin ? (
              <motion.div
                key={selectedCoin.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-2xl relative p-6 border-t-2 border-t-neon-blue space-y-6"
              >
                {/* Header overview */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-white text-sm font-bold bg-white/5 border-r-2"
                      style={{ borderRightColor: selectedCoin.color, boxShadow: `0 0 10px ${selectedCoin.color}25` }}
                    >
                      {selectedCoin.symbol}
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-lg text-white font-bold tracking-wide">{selectedCoin.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">{selectedCoin.symbol} Asset Hub</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="block font-mono text-base font-bold text-white">
                      ${selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    <span className={`inline-flex items-center font-mono text-[10px] font-bold ${selectedCoin.change24h >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                      {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Simulated Stats cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[9px] font-mono text-slate-400 uppercase">24h High (Simulated)</span>
                    <span className="font-mono text-xs font-semibold text-white tracking-wide mt-1 block">
                      ${selectedCoin.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[9px] font-mono text-slate-400 uppercase">24h Low (Simulated)</span>
                    <span className="font-mono text-xs font-semibold text-white tracking-wide mt-1 block">
                      ${selectedCoin.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Holdings summary indicator */}
                <div className="flex items-center justify-between p-3.5 bg-neon-purple/5 border border-neon-purple/20 rounded-xl text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                    <span className="text-[#8f96b3] font-mono">YOUR HOLDINGS:</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {selectedCoin.balance.toLocaleString()} {selectedCoin.symbol}
                    <span className="block text-[9px] text-[#6c7293] text-right mt-0.5">
                      ≈ ${(selectedCoin.balance * selectedCoin.price).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                    </span>
                  </span>
                </div>

                {/* Quick Transaction Action form (Simulated exchange updates state!) */}
                <form id="deal-trade-form" onSubmit={handleTradeSubmit} className="space-y-4">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold pb-1">Instant Liquidation Terminal</h4>
                  
                  {/* Buy / Sell Switch tabs */}
                  <div className="flex rounded-xl bg-black/30 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => { setTradeType('buy'); setTradeStatus({ status: null, message: '' }); }}
                      className={`flex-1 py-1.5 rounded-lg text-center font-mono text-[10px] tracking-wide uppercase font-extrabold transition-all duration-300 ${
                        tradeType === 'buy' 
                          ? 'bg-neon-green/15 text-neon-green shadow-sm font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      BUY ASSET
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTradeType('sell'); setTradeStatus({ status: null, message: '' }); }}
                      className={`flex-1 py-1.5 rounded-lg text-center font-mono text-[10px] tracking-wide uppercase font-extrabold transition-all duration-300 ${
                        tradeType === 'sell' 
                          ? 'bg-neon-pink/15 text-neon-pink shadow-sm font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      LIQUIDATE (SELL)
                    </button>
                  </div>

                  {/* Input value field */}
                  <div className="relative">
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={prefillUSDCBalance}
                        className="bg-white/10 hover:bg-cyan-500 hover:text-black transition-colors text-[9px] font-mono px-2 py-0.5 rounded font-bold text-white uppercase"
                      >
                        SET MAX HOLDINGS
                      </button>
                      <span className="text-xs font-mono font-bold text-white">{selectedCoin.symbol}</span>
                    </div>
                    <input 
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full pl-4 pr-36 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-400 text-white font-mono"
                    />
                  </div>

                  {/* Estimated calculation layout */}
                  {tradeAmount && !isNaN(parseFloat(tradeAmount)) && parseFloat(tradeAmount) > 0 && (
                    <div className="p-3 bg-black/20 rounded-xl space-y-1 text-[11px] font-mono text-[#8f96b3]">
                      <div className="flex justify-between">
                        <span>Simulated Price:</span>
                        <span className="text-white">${selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t border-white/10 pt-1 mt-1 text-white">
                        <span>Calculated Value:</span>
                        <span className={tradeType === 'buy' ? 'text-neon-green' : 'text-neon-pink'}>
                          ${(parseFloat(tradeAmount) * selectedCoin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit trade button */}
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-center font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_12px_rgba(0,0,0,0.4)] ${
                      tradeType === 'buy'
                        ? 'bg-neon-green hover:bg-neon-green/90 text-[#090a12] shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
                        : 'bg-neon-pink hover:bg-neon-pink/90 text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)]'
                    }`}
                  >
                    🚀 CONFIRM {tradeType.toUpperCase()} ORDER
                  </button>

                  {/* Notification Status Alerts */}
                  <AnimatePresence>
                    {tradeStatus.status && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-3 rounded-xl border flex items-start space-x-2 text-xs font-mono leading-relaxed mt-2 ${
                          tradeStatus.status === 'success' 
                            ? 'bg-neon-green/10 text-neon-green border-neon-green/30' 
                            : 'bg-neon-pink/10 text-neon-pink border-neon-pink/30'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{tradeStatus.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            ) : (
              <div className="glass-panel text-center p-8 rounded-2xl border-t-2 border-t-neon-blue">
                <span className="text-xs font-mono text-[#6c7293]">Select a cryptocurrency asset to deploy trading terminal tools.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
