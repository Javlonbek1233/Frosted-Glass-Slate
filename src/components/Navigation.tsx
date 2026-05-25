/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, TrendingUp, Wallet, BarChart3, User, Cpu, CircleDot } from 'lucide-react';
import { motion } from 'motion/react';
import { UserTier } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userTier: UserTier;
}

export default function Navigation({ activeTab, setActiveTab, userTier }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-black/20 backdrop-blur-3xl z-30 justify-between p-6">
        <div className="flex flex-col space-y-8">
          {/* Brand/Logo Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="flex items-center justify-center w-full h-full bg-black/30 rounded-[10px]">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border border-black animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wider text-white">AETHERIS</span>
              <span className="block text-[9px] font-mono tracking-widest text-slate-500">PORTAL SECURE</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative group flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm text-left overflow-hidden ${
                    isActive 
                      ? 'text-cyan-400 font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Backdrop animation for active buttons */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl z-0"
                    />
                  )}
                  
                  {/* Neon indicator dot to make it even stickier */}
                  {isActive && (
                    <span className="absolute right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10" />
                  )}

                  <div className={`relative z-10 p-1 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <span className="relative z-10 font-display tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Mini-Profile & Live Connection State */}
        <div className="flex flex-col space-y-4 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 tracking-widest">NETWORK: ONLINE</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">SECURE L3</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[1px] shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <div className="w-full h-full bg-[#05070a] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  SC
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border border-[#05070a] flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0" onClick={() => setActiveTab('profile')}>
              <p className="text-xs font-semibold text-white truncate cursor-pointer hover:text-cyan-400 transition-colors">Sarah Connor</p>
              <span className="inline-block text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {userTier === 'apex-platinum' ? 'APEX PLATINUM' : userTier === 'gold' ? 'GOLD ELITE' : 'BRONZE L1'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-black/40 backdrop-blur-xl z-30 px-3 flex items-center justify-around pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeMobileTabIndicator"
                  className="absolute top-0 w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.1)]' : ''}`}>
                <Icon className="w-5 h-5 mb-0.5" />
              </div>
              <span className="text-[9px] font-mono font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
