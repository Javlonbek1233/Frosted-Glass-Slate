/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, ShieldCheck, ShieldAlert, BadgeInfo, Cpu, Sliders, 
  Dribbble, Radio, CheckSquare, Sparkles, RefreshCw
} from 'lucide-react';
import { UserProfile, SimulatorSettings, MarketTrend } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  settings: SimulatorSettings;
  onChangeTrend: (trend: MarketTrend) => void;
  onChangeSpeed: (multiplier: number) => void;
  onToggleRealtime: (enabled: boolean) => void;
  onResetSimulation: () => void;
}

export default function ProfileView({ 
  profile, settings, onChangeTrend, onChangeSpeed, onToggleRealtime, onResetSimulation 
}: ProfileViewProps) {
  
  const trendOptions: { value: MarketTrend; label: string; desc: string; color: string }[] = [
    { value: 'stable', label: 'Stable Growth', desc: 'Gentle, realistic sideways standard trading index', color: 'border-cyan-400 text-cyan-400' },
    { value: 'bull', label: 'Super Bull Run', desc: 'Accelerated sequential market climbs', color: 'border-emerald-400 text-emerald-400' },
    { value: 'bear', label: 'Aggressive Bear Market', desc: 'Consistent token correction downward movements', color: 'border-rose-400 text-rose-400' },
    { value: 'volatile', label: 'Extreme Volatility', desc: 'Oscillating swings, ideal option hedging', color: 'border-amber-400 text-amber-400' },
    { value: 'flash-crash', label: 'Sovereign Flash Crash', desc: 'Sudden liquidation cascade simulation', color: 'border-rose-500 text-rose-500' },
  ];

  return (
    <div className="space-y-8 pb-10" id="profile-dashboard">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">AETHERIS CENTRAL SECURITY</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
          Identity & Simulation Hub
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card (1/3 width) */}
        <div className="col-span-1 space-y-6">
          {/* Main ID panel */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 p-[1.5px] mb-4">
              <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center text-2xl font-bold font-display text-white">
                SC
              </div>
            </div>

            <h3 className="font-display font-bold text-lg text-white tracking-wide">{profile.username}</h3>
            <span className="text-[10px] font-mono text-slate-400 mt-0.5">{profile.email}</span>

            <div className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-[10px] uppercase font-bold tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>APEX PLATINUM VIP</span>
            </div>

            <div className="mt-6 w-full border-t border-white/10 pt-4 space-y-3 font-mono text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">KYC Identity Verification:</span>
                <span className="text-emerald-400 font-semibold">CERTIFIED L3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Security Score:</span>
                <span className="text-cyan-450 font-bold">{profile.securityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Two-Factor (2FA) Status:</span>
                <span className="text-emerald-400 font-semibold">ACTIVE (SECURE)</span>
              </div>
            </div>
          </div>

          {/* Account limits indicators */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h4 className="font-display font-semibold text-sm text-white tracking-wide border-b border-white/10 pb-2">Trading Vault Thresholds</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                  <span>Daily Liquid Withdrawal limit</span>
                  <span className="text-white">$5,000,000 / $5,000,000</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                  <span>Single Transaction Cap</span>
                  <span className="text-white">UNLIMITED APEX</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Simulation Engine Controls (2/3 width) - Absolutely gorgeous tactile interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-medium text-base text-white font-bold tracking-wide">QUANT SIMULATION ENGINE</h3>
              </div>
              
              <button 
                onClick={onResetSimulation}
                className="flex items-center space-x-1 border border-rose-500/30 hover:border-rose-500/80 hover:bg-rose-500/10 transition-colors bg-white/5 p-1.5 font-mono text-[9px] font-bold text-rose-400 rounded-lg uppercase tracking-wider shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation Ledger</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Tailor market settings to verify portfolio performance under heavy market volatility, bull markets, crashes, or option adjustments. All graphs and ticker logs across Home, Markets, and Wallet update instantly.
            </p>

            {/* Simulated Trend selection buttons */}
            <div className="space-y-4">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Active Market Direction Setting</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendOptions.map((opt) => {
                  const isSelected = settings.marketTrend === opt.value;
                  return (
                    <div 
                      key={opt.value}
                      id={`simulation-trend-${opt.value}`}
                      onClick={() => onChangeTrend(opt.value)}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-start space-x-3.5 ${
                        isSelected 
                          ? 'bg-white/10 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)] ring-[0.5px] ring-cyan-400' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                      </div>
                      
                      <div>
                        <span className="text-xs font-bold font-display text-white block tracking-wide">{opt.label}</span>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 leading-normal block">{opt.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional parameters switches */}
            <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volatility Speed Multiplier Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold tracking-widest">
                  <span className="text-slate-500">Sovereign Ticker Speed multiplier</span>
                  <span className="text-cyan-400 font-extrabold">{settings.volatilityMultiplier}x multiplier</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-[9px] font-mono text-slate-500">0.1x</span>
                  <input 
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={settings.volatilityMultiplier}
                    onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-[9px] font-mono text-slate-500">5.0x</span>
                </div>
                <span className="block text-[9.5px] font-mono text-slate-500 leading-normal">
                  Higher multipliers generate faster, more aggressive real-time ticks to test platform stress loads.
                </span>
              </div>

              {/* Toggle switch for real-time update ticker checks */}
              <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-xs font-bold font-display block text-white tracking-wide">Dynamic Live Price Ticker</span>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 leading-relaxed">
                    Auto-simulate high-frequency market trade changes every second.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => onToggleRealtime(!settings.realtimeUpdatesEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative shrink-0 ${
                    settings.realtimeUpdatesEnabled ? 'bg-cyan-500' : 'bg-white/5'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                    settings.realtimeUpdatesEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
