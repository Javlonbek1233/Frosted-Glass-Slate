/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, History, Send, 
  Download, Copy, Check, Info, ShieldAlert, Coins, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coin, Transaction, UserProfile } from '../types';

interface WalletViewProps {
  coins: Coin[];
  profile: UserProfile;
  transactions: Transaction[];
  onDepositWithdraw: (action: 'deposit' | 'withdraw', coinSymbol: string, amount: number) => { success: boolean; message: string };
}

export default function WalletView({ coins, profile, transactions, onDepositWithdraw }: WalletViewProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send');
  
  // Interaction Form states
  const [targetCoinSymbol, setTargetCoinSymbol] = useState('USDC');
  const [actionAmount, setActionAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

  const totalPortfolioValue = coins.reduce((acc, c) => acc + (c.price * c.balance), 0);
  const selectedCoinForAction = coins.find(c => c.symbol === targetCoinSymbol);

  const handleCopyAddress = (symbol: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedText(symbol);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setFeedback({ status: 'error', message: 'Please enter a valid simulated amount.' });
      return;
    }

    if (activeTab === 'send') {
      if (!destinationAddress) {
        setFeedback({ status: 'error', message: 'Simulated destination gateway address is required.' });
        return;
      }
      
      // Send acts just like a withdrawal
      const { success, message } = onDepositWithdraw('withdraw', targetCoinSymbol, amountNum);
      if (success) {
        setFeedback({ status: 'success', message: `Dispatched ${amountNum} ${targetCoinSymbol} successfully to ${destinationAddress.slice(0, 6)}...${destinationAddress.slice(-4)}` });
        setActionAmount('');
        setDestinationAddress('');
        setTimeout(() => setFeedback({ status: null, message: '' }), 3500);
      } else {
        setFeedback({ status: 'error', message });
      }
    } else {
      // Receive acts like a deposit
      const { success, message } = onDepositWithdraw('deposit', targetCoinSymbol, amountNum);
      if (success) {
        setFeedback({ status: 'success', message });
        setActionAmount('');
        setTimeout(() => setFeedback({ status: null, message: '' }), 3500);
      } else {
        setFeedback({ status: 'error', message });
      }
    }
  };

  return (
    <div className="space-y-8 pb-10" id="wallet-dashboard">
      {/* Top Banner */}
      <div className="border-b border-[#22263f]/50 pb-6">
        <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">AETHERIS VAULT SUITE</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
          Dynamic Wallet Secured Ledger
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Glowing Wallet cards (Left column) */}
        <div className="col-span-1 space-y-6">
          {/* Cyber Gradients Card */}
          <div className="relative overflow-hidden rounded-2xl glass-panel animate-glow-blue border-r-2 border-r-neon-blue/80 p-6">
            {/* Mesh highlights */}
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex space-x-2.5 items-center">
                <Wallet className="w-5 h-5 text-neon-blue" />
                <span className="text-[10px] font-mono tracking-widest text-[#8f96b3] uppercase font-bold">SOVEREIGN VAULT SECURE</span>
              </div>
              <span className="inline-block text-[8px] font-mono px-2 py-0.5 rounded uppercase font-extrabold bg-neon-blue/15 text-neon-blue border border-neon-blue/20">
                Tier: Apex
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#6c7293] block uppercase tracking-wide">SECURE COLOURED BALANCE</span>
              <h3 className="text-3xl font-display font-bold text-white tracking-tight">
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="block text-[10px] font-mono text-[#8f96b3] mt-1">
                KYC STATUS: Certified Vault L3 Verified
              </span>
            </div>

            {/* Address copier shortcuts inside card */}
            <div className="mt-8 border-t border-white/10 pt-4 space-y-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">QUICK DEPOSIT ADDRESSES</span>
              
              <div className="space-y-1.5 font-mono text-[10px]">
                {Object.entries(profile.addresses).map(([symbol, addy]) => (
                  <div key={symbol} className="flex items-center justify-between p-1.5 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5">
                    <span className="font-bold text-white pl-2">{symbol}</span>
                    <span className="text-slate-400 text-[9.5px] truncate max-w-[130px] ml-1.5 px-1">{addy}</span>
                    <button 
                      onClick={() => handleCopyAddress(symbol, addy)} 
                      className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-xl hover:bg-white/5 transition-all shrink-0"
                    >
                      {copiedText === symbol ? (
                        <Check className="w-3.5 h-3.5 text-neon-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holdings distribution item cards list */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h4 className="font-display font-semibold text-sm text-white tracking-wide border-b border-white/10 pb-2">Vault Allocation Assets</h4>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {coins.map((coin) => {
                const holdingVal = coin.balance * coin.price;
                if (coin.balance === 0) return null;
                return (
                  <div key={coin.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="w-1.5 h-6 rounded" 
                        style={{ backgroundColor: coin.color }}
                      />
                      <div>
                        <span className="font-semibold text-white block">{coin.name}</span>
                        <span className="text-[9px] font-mono text-[#6c7293]">{coin.balance.toLocaleString()} {coin.symbol}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-mono font-semibold text-white block">${holdingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="text-[9px] font-mono text-[#8f96b3]">{(holdingVal / totalPortfolioValue * 100).toFixed(1)}% of total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Form / Interactive tabs (Right Columns, 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 backdrop-blur-xl">
            <button
              onClick={() => { setActiveTab('send'); setFeedback({ status: null, message: '' }); }}
              className={`flex-1 py-3 rounded-lg text-center font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'send' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>SEND CRYPTO OUT</span>
            </button>
            <button
              onClick={() => { setActiveTab('receive'); setFeedback({ status: null, message: '' }); }}
              className={`flex-1 py-3 rounded-lg text-center font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'receive' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>SIMULATE DEPOSIT</span>
            </button>
            <button
              onClick={() => { setActiveTab('history'); setFeedback({ status: null, message: '' }); }}
              className={`flex-1 py-3 rounded-lg text-center font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'history' 
                  ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>TRANSTION LOG</span>
            </button>
          </div>

          {/* Send or Receive Panel Form */}
          {(activeTab === 'send' || activeTab === 'receive') && (
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  {activeTab === 'send' 
                    ? 'Secure external transactions are simulated safely within this Sandbox. Balances update in real-time.' 
                    : 'Aetheris allows simulated deposits. Choose any coin asset and specify theoretical amounts.'}
                </span>
              </div>

              <form onSubmit={handleActionSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Coin Selector */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-2">CRYPTO ASSET</label>
                    <div className="relative">
                      <select 
                        value={targetCoinSymbol}
                        onChange={(e) => { setTargetCoinSymbol(e.target.value); setFeedback({ status: null, message: '' }); }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl text-xs py-2.5 px-4 text-white focus:outline-none focus:border-cyan-400 font-mono uppercase"
                      >
                        {coins.map((coin) => (
                          <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Amount Box */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-2">
                      AMOUNT TO {activeTab === 'send' ? 'SEND' : 'DEPOSIT'}
                    </label>
                    <div className="relative">
                      <input 
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={actionAmount}
                        onChange={(e) => setActionAmount(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl text-xs py-2.5 px-4 text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      {selectedCoinForAction && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-400">
                          Held: {selectedCoinForAction.balance.toLocaleString()} {selectedCoinForAction.symbol}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receiver address field (only on send) */}
                {activeTab === 'send' && (
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-2">TARGET GATEWAY ADDRESS</label>
                    <input 
                      type="text"
                      placeholder="e.g. bc1qm3...xyp or 0x8A1...Fe"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl text-xs py-2.5 px-4 text-white focus:outline-none focus:border-cyan-400 font-mono placeholder:text-slate-500"
                    />
                  </div>
                )}

                {/* QR layout simulated block for receiving */}
                {activeTab === 'receive' && selectedCoinForAction && (
                  <div className="p-4 bg-black/30 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-4">
                    {/* Mock QR visual layout */}
                    <div className="w-24 h-24 bg-white p-1 rounded-lg shrink-0 flex flex-wrap gap-0.5 relative overflow-hidden">
                      {/* Generate a QR-like matrix grid visually! */}
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 h-1.5" 
                          style={{ backgroundColor: (i % 2 === 0 && i % 3 !== 0) || i % 7 === 0 || i < 20 || i > 120 ? '#000000' : '#ffffff' }}
                        />
                      ))}
                    </div>

                    <div className="space-y-1.5 select-all">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-wider uppercase block">YOUR SECURED ADDRESS GATEWAY</span>
                      <p className="font-mono text-xs text-white selection:bg-cyan-500/30 leading-normal select-all">
                        {profile.addresses[targetCoinSymbol as keyof typeof profile.addresses] || 'Address code unavailable'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(targetCoinSymbol, profile.addresses[targetCoinSymbol as keyof typeof profile.addresses] || '')}
                        className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedText === targetCoinSymbol ? 'ADDRESS COPIED!' : 'CLICK TO COPY SECURE ADDRESS CODE'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-center font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_12px_rgba(0,0,0,0.5)] ${
                    activeTab === 'send'
                      ? 'bg-neon-blue hover:bg-neon-blue/90 text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)]'
                      : 'bg-neon-purple hover:bg-neon-purple/90 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]'
                  }`}
                >
                  {activeTab === 'send' ? '🔐 DISPATCH SECURED SEND TRANSFER' : '💰 SIMULATE VAULT DEPOSIT'}
                </button>

                {/* Form feedback status alerts */}
                <AnimatePresence>
                  {feedback.status && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-3.5 rounded-xl border flex items-start space-x-2 text-xs font-mono leading-relaxed mt-4 ${
                        feedback.status === 'success' 
                          ? 'bg-neon-green/10 text-neon-green border-neon-green/30' 
                          : 'bg-neon-pink/10 text-neon-pink border-neon-pink/30'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
                      <span>{feedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          )}

          {/* Ledger History Listing panel */}
          {activeTab === 'history' && (
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <History className="w-4.5 h-4.5 text-cyan-400" />
                  <span className="font-display text-sm font-bold text-white tracking-wide">SECURED TRANSACTION RECORD</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">AUTOLOAD SESSIONS</span>
              </div>

              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {transactions.map((tx) => {
                  const isPositive = tx.type === 'deposit' || tx.type === 'sell';
                  return (
                    <div 
                      key={tx.id} 
                      id={`tx-log-${tx.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] gap-3 hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'deposit' ? 'bg-neon-green/10 text-neon-green' : 
                          tx.type === 'withdraw' ? 'bg-[#fb7185]/10 text-[#fb7185]' :
                          tx.type === 'buy' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {tx.type === 'deposit' ? <Download className="w-4.5 h-4.5" /> : 
                           tx.type === 'withdraw' ? <Send className="w-4.5 h-4.5" /> : 
                           tx.type === 'buy' ? <Coins className="w-4.5 h-4.5" /> : <RefreshCcw className="w-4.5 h-4.5" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-display font-bold text-white text-xs uppercase tracking-wider">{tx.type} CONTRACT</span>
                            <span className="text-[8px] font-mono text-slate-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">{tx.assetSymbol}</span>
                          </div>
                          <span className="block text-[9.5px] font-mono text-[#6c7293] mt-0.5">TX_HASH: {tx.id}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className={`block font-mono text-xs font-bold ${isPositive ? 'text-neon-green' : 'text-neon-pink'}`}>
                          {isPositive ? '+' : '-'}{tx.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {tx.assetSymbol}
                        </span>
                        <span className="block text-[9px] font-mono text-[#6c7293] mt-0.5">
                          Value: ${tx.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                        </span>
                      </div>
                    </div>
                  );
                })}

                {transactions.length === 0 && (
                  <div className="text-center py-10 text-xs text-[#6c7293] font-mono">
                    Sovereign ledger contains no recorded active validation sessions.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
