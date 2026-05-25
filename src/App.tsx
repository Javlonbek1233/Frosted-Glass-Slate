/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, LayoutDashboard, Wallet, TrendingUp, User, 
  Sparkles, ShieldCheck, Terminal, Heart, CircleAlert 
} from 'lucide-react';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import MarketsView from './components/MarketsView';
import WalletView from './components/WalletView';
import AnalyticsView from './components/AnalyticsView';
import ProfileView from './components/ProfileView';
import AdvisorChat from './components/AdvisorChat';

import { INITIAL_COINS, INITIAL_PROFILE } from './constants';
import { Coin, PortfolioStats, SimulatorSettings, Transaction, MarketTrend, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);

  // Core Simulation States
  const [coins, setCoins] = useState<Coin[]>(INITIAL_COINS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '0x1f2e5a7b8c9d4610',
      type: 'deposit',
      assetId: 'usd-coin',
      assetSymbol: 'USDC',
      amount: 12450.00,
      price: 1.00,
      totalValue: 12450.00,
      timestamp: '2026-05-24 16:34:11',
      status: 'completed',
    },
    {
      id: '0xf92b3a8c7e6d1c7a',
      type: 'buy',
      assetId: 'bitcoin',
      assetSymbol: 'BTC',
      amount: 0.15,
      price: 65120.00,
      totalValue: 9768.00,
      timestamp: '2026-05-24 19:42:05',
      status: 'completed',
    }
  ]);

  const [settings, setSettings] = useState<SimulatorSettings>({
    marketTrend: 'stable',
    volatilityMultiplier: 1.0,
    realtimeUpdatesEnabled: true,
  });

  // Calculate high-fidelity portfolio balance indicators dynamically
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalBalanceUSD: 0,
    balanceChange24hUSD: 0,
    balanceChange24hPercent: 0,
    profitAllTimeUSD: 42150.00,
    profitAllTimePercent: 24.15
  });

  // Re-calculate Portfolio stats when balances or prices change
  useEffect(() => {
    const total = coins.reduce((acc, c) => acc + (c.price * c.balance), 0);
    
    // We compute simulated delta based on individual coin weights
    const totalWeight = coins.reduce((acc, c) => acc + (c.price * c.balance), 0);
    let weightedChange = 0;
    
    coins.forEach(coin => {
      const weight = totalWeight > 0 ? (coin.price * coin.balance) / totalWeight : 0;
      weightedChange += coin.change24h * weight;
    });

    const prevBalance = total / (1 + (weightedChange / 100));
    const deltaUSD = total - prevBalance;

    setPortfolioStats(prev => ({
      ...prev,
      totalBalanceUSD: total,
      balanceChange24hUSD: deltaUSD,
      balanceChange24hPercent: weightedChange,
    }));
  }, [coins]);

  // Real-Time High Frequency Sim-Ticker updates
  useEffect(() => {
    if (!settings.realtimeUpdatesEnabled) return;

    const baseIntervalMs = 2000;
    const computedIntervalMs = baseIntervalMs / settings.volatilityMultiplier;

    const interval = setInterval(() => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          // Stablecoin USDC is locked to peg at exactly $1
          if (coin.symbol === 'USDC') return coin;

          // Compute factor based on marketTrend configuration
          let trendBias = 0; // Positive or negative drift rate
          let maxRange = 0.003; // Percentage range of oscillation

          switch (settings.marketTrend) {
            case 'bull':
              trendBias = 0.0007; // Drifts upward
              maxRange = 0.004;
              break;
            case 'bear':
              trendBias = -0.001; // Drifts downward
              maxRange = 0.004;
              break;
            case 'volatile':
              trendBias = 0;
              maxRange = 0.015; // Heavy wild swings
              break;
            case 'flash-crash':
              trendBias = -0.018; // Drastic slides
              maxRange = 0.01;
              break;
            case 'stable':
            default:
              trendBias = 0.0001; 
              maxRange = 0.0015;
              break;
          }

          // Random swing percentage
          const randPercent = (Math.random() * maxRange * 2) - maxRange + trendBias;
          const newPrice = Math.max(0.005, coin.price * (1 + randPercent));
          
          // Re-calculate limits
          const high = Math.max(coin.high24h, newPrice);
          const low = Math.min(coin.low24h, newPrice);
          const newChange = coin.change24h + (randPercent * 100);

          // Update sparkline representation array
          const nextHistory = [...coin.history1d.slice(1), newPrice];

          return {
            ...coin,
            price: newPrice,
            high24h: high,
            low24h: low,
            change24h: Number(newChange.toFixed(3)),
            history1d: nextHistory
          };
        });
      });
    }, computedIntervalMs);

    return () => clearInterval(interval);
  }, [settings.marketTrend, settings.volatilityMultiplier, settings.realtimeUpdatesEnabled]);

  // Handler: Buying / Liquidating assets inside simulated wallet
  const handleQuickTrade = (type: 'buy' | 'sell', coinId: string, amount: number, price: number) => {
    let result = { success: false, message: '' };

    const targetCoinIndex = coins.findIndex(c => c.id === coinId);
    if (targetCoinIndex === -1) {
      return { success: false, message: 'Invalid target coin.' };
    }

    const targetCoin = coins[targetCoinIndex];
    const usdcCoinIndex = coins.findIndex(c => c.symbol === 'USDC');
    const usdcCoin = coins[usdcCoinIndex];

    const elapsedValue = amount * price;

    if (type === 'buy') {
      // Check if user has enough simulated USDC cash to complete buyout
      if (usdcCoin.balance < elapsedValue) {
        return { 
          success: false, 
          message: `Insufficent cash reserves. Required $${elapsedValue.toLocaleString()} USDC, but address holds only $${usdcCoin.balance.toLocaleString()} USDC.` 
        };
      }

      setCoins(prev => {
        const next = [...prev];
        next[usdcCoinIndex] = { ...usdcCoin, balance: usdcCoin.balance - elapsedValue };
        next[targetCoinIndex] = { ...targetCoin, balance: targetCoin.balance + amount };
        return next;
      });

      // Insert transaction logs
      const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      const newTx: Transaction = {
        id: txHash,
        type: 'buy',
        assetId: targetCoin.id,
        assetSymbol: targetCoin.symbol,
        amount: amount,
        price: price,
        totalValue: elapsedValue,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed'
      };

      setTransactions(prev => [newTx, ...prev]);
      result = { success: true, message: `Dispatched BUY contract. Allocated ${amount} ${targetCoin.symbol} to wallet ledger.` };
    } else {
      // Liquidate (Sell)
      if (targetCoin.balance < amount) {
        return { 
          success: false, 
          message: `Insufficent assets. Requested liquidation of ${amount} ${targetCoin.symbol}, but ledger holds only ${targetCoin.balance.toLocaleString()} ${targetCoin.symbol}.`
        };
      }

      setCoins(prev => {
        const next = [...prev];
        next[targetCoinIndex] = { ...targetCoin, balance: targetCoin.balance - amount };
        next[usdcCoinIndex] = { ...usdcCoin, balance: usdcCoin.balance + elapsedValue };
        return next;
      });

      const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      const newTx: Transaction = {
        id: txHash,
        type: 'sell',
        assetId: targetCoin.id,
        assetSymbol: targetCoin.symbol,
        amount: amount,
        price: price,
        totalValue: elapsedValue,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed'
      };

      setTransactions(prev => [newTx, ...prev]);
      result = { success: true, message: `Dispatched LIQUIDATION contract. Refunded $${elapsedValue.toLocaleString()} USDC to ledger.` };
    }

    return result;
  };

  // Handler: Depositing or Withdrawing direct assets
  const handleDepositWithdraw = (action: 'deposit' | 'withdraw', coinSymbol: string, amount: number) => {
    const targetCoinIndex = coins.findIndex(c => c.symbol === coinSymbol);
    if (targetCoinIndex === -1) {
      return { success: false, message: 'Crypto asset index mismatch.' };
    }

    const targetCoin = coins[targetCoinIndex];
    const totalValueUSD = amount * targetCoin.price;

    if (action === 'withdraw') {
      if (targetCoin.balance < amount) {
        return { 
          success: false, 
          message: `Failed. Attempted withdrawal of ${amount} ${coinSymbol}, but address holds only ${targetCoin.balance} ${coinSymbol}.` 
        };
      }

      setCoins(prev => {
        const next = [...prev];
        next[targetCoinIndex] = { ...targetCoin, balance: targetCoin.balance - amount };
        return next;
      });

      const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      const newTx: Transaction = {
        id: txHash,
        type: 'withdraw',
        assetId: targetCoin.id,
        assetSymbol: targetCoin.symbol,
        amount: amount,
        price: targetCoin.price,
        totalValue: totalValueUSD,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed'
      };

      setTransactions(prev => [newTx, ...prev]);
      return { success: true, message: `Secure withdrawal transaction dispatched. Deducted ${amount} ${coinSymbol}.` };
    } else {
      // Deposit simulation
      setCoins(prev => {
        const next = [...prev];
        next[targetCoinIndex] = { ...targetCoin, balance: targetCoin.balance + amount };
        return next;
      });

      const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      const newTx: Transaction = {
        id: txHash,
        type: 'deposit',
        assetId: targetCoin.id,
        assetSymbol: targetCoin.symbol,
        amount: amount,
        price: targetCoin.price,
        totalValue: totalValueUSD,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed'
      };

      setTransactions(prev => [newTx, ...prev]);
      return { success: true, message: `Credit completed. Deposited simulated ${amount} ${coinSymbol} successfully.` };
    }
  };

  // Controller panel mutations
  const handleTrendChange = (trend: MarketTrend) => {
    setSettings(prev => ({ ...prev, marketTrend: trend }));
  };

  const handleSpeedChange = (mult: number) => {
    setSettings(prev => ({ ...prev, volatilityMultiplier: mult }));
  };

  const handleToggleRealtime = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, realtimeUpdatesEnabled: enabled }));
  };

  const handleResetSimulation = () => {
    setCoins(INITIAL_COINS);
    setSettings({
      marketTrend: 'stable',
      volatilityMultiplier: 1.0,
      realtimeUpdatesEnabled: true
    });
    setTransactions([]);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-[#ebecef] flex overflow-x-hidden md:pl-64 relative">
      
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Visual cybernetic scanline effect to emphasize premium cyberpunk feel */}
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent to-[#05060b]/40 z-50" />
      <div className="fixed inset-x-0 h-[2px] bg-neon-blue/5 pointer-events-none animate-scanline z-50 shadow-[0_0_8px_rgba(6,182,212,0.1)]" />

      {/* Main left Sidebar Navigation component */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userTier={profile.tier} 
      />

      {/* Body Inner Frame */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
        
        {/* Floating Toggle: Quick Ask AI Advisor Widget (Persistent but subtle, triggers the AI drawer) */}
        <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
          <button
            onClick={() => setAdvisorOpen(true)}
            id="advisor-float-btn"
            className="flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue text-white shadow-[0_4px_25px_rgba(168,85,247,0.4)] border border-neon-purple/30 hover:scale-105 hover:shadow-[0_4px_30px_rgba(168,85,247,0.6)] duration-300 transition-all font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Consult AI Advisor</span>
          </button>
        </div>

        {/* Tab Route container rendering */}
        <div className="relative">
          {activeTab === 'home' && (
            <HomeView 
              coins={coins} 
              portfolioStats={portfolioStats} 
              trend={settings.marketTrend}
              setActiveTab={setActiveTab}
              openAdvisor={() => setAdvisorOpen(true)}
            />
          )}

          {activeTab === 'markets' && (
            <MarketsView 
              coins={coins} 
              onQuickTrade={handleQuickTrade} 
            />
          )}

          {activeTab === 'wallet' && (
            <WalletView 
              coins={coins} 
              profile={profile} 
              transactions={transactions}
              onDepositWithdraw={handleDepositWithdraw}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              coins={coins} 
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              profile={profile} 
              settings={settings}
              onChangeTrend={handleTrendChange}
              onChangeSpeed={handleSpeedChange}
              onToggleRealtime={handleToggleRealtime}
              onResetSimulation={handleResetSimulation}
            />
          )}
        </div>
      </main>

      {/* Interactive AI advisor chat drawer */}
      <AdvisorChat 
        isOpen={advisorOpen} 
        onClose={() => setAdvisorOpen(false)} 
        coins={coins}
        portfolioStats={portfolioStats}
        trend={settings.marketTrend}
      />
    </div>
  );
}
