/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, HelpCircle, Landmark } from 'lucide-react';
import { Coin } from '../types';

interface AnalyticsViewProps {
  coins: Coin[];
}

export default function AnalyticsView({ coins }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');

  const totalPortfolioValue = coins.reduce((acc, c) => acc + (c.price * c.balance), 0);

  // 1. Generate area chart data dynamically based on selection
  const historicalData = {
    '1D': [
      { name: '00:00', value: totalPortfolioValue * 0.985 },
      { name: '04:00', value: totalPortfolioValue * 0.978 },
      { name: '08:00', value: totalPortfolioValue * 0.992 },
      { name: '12:00', value: totalPortfolioValue * 1.005 },
      { name: '16:00', value: totalPortfolioValue * 0.998 },
      { name: '20:00', value: totalPortfolioValue * 1.012 },
      { name: '24:00', value: totalPortfolioValue },
    ],
    '1W': [
      { name: 'Mon', value: totalPortfolioValue * 0.92 },
      { name: 'Tue', value: totalPortfolioValue * 0.94 },
      { name: 'Wed', value: totalPortfolioValue * 0.93 },
      { name: 'Thu', value: totalPortfolioValue * 0.96 },
      { name: 'Fri', value: totalPortfolioValue * 0.98 },
      { name: 'Sat', value: totalPortfolioValue * 0.975 },
      { name: 'Sun', value: totalPortfolioValue },
    ],
    '1M': [
      { name: 'Wk 1', value: totalPortfolioValue * 0.84 },
      { name: 'Wk 2', value: totalPortfolioValue * 0.89 },
      { name: 'Wk 3', value: totalPortfolioValue * 0.93 },
      { name: 'Wk 4', value: totalPortfolioValue },
    ],
    '1Y': [
      { name: 'Jan', value: totalPortfolioValue * 0.52 },
      { name: 'Mar', value: totalPortfolioValue * 0.65 },
      { name: 'May', value: totalPortfolioValue * 0.72 },
      { name: 'Jul', value: totalPortfolioValue * 0.81 },
      { name: 'Sep', value: totalPortfolioValue * 0.88 },
      { name: 'Nov', value: totalPortfolioValue * 0.94 },
      { name: 'Dec', value: totalPortfolioValue },
    ]
  };

  const chartDataArea = historicalData[timeRange];

  // 2. Generate Pie Data of asset allocation
  const allocationPieData = coins
    .filter(c => c.balance > 0)
    .map(c => ({
      name: c.name,
      symbol: c.symbol,
      value: c.balance * c.price,
      color: c.color
    }));

  // 3. Risk Radar Chart Matrix
  const riskRadarData = [
    { subject: 'Vol Yield APY', A: 85, fullMark: 100 },
    { subject: 'Sovereign Stability', A: 65, fullMark: 100 },
    { subject: 'Risk Premium', A: 90, fullMark: 100 },
    { subject: 'Decentralization', A: 75, fullMark: 100 },
    { subject: 'Cash Liquidity', A: 80, fullMark: 100 },
  ];

  // Custom gorgeous charting tooltips with neon details
  const CustomTooltipArea = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 px-3.5 py-2 rounded-xl font-mono text-xs shadow-lg backdrop-blur-md">
          <p className="text-slate-400 uppercase tracking-wide text-[9px] mb-0.5">{payload[0].payload.name}</p>
          <p className="text-white font-bold font-sans text-sm">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = (payload[0].value / totalPortfolioValue * 100).toFixed(1);
      return (
        <div className="bg-black/80 border border-white/10 px-3.5 py-2 rounded-xl font-mono text-xs shadow-lg backdrop-blur-md">
          <p className="font-semibold text-white font-sans text-xs">{payload[0].name}</p>
          <p className="text-cyan-400 font-bold text-sm mt-0.5">
            ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[9px] text-[#8f96b3]">{percentage}% of total portfolio</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10" id="analytics-dashboard">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#22263f]/50 pb-6">
        <div>
          <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">AETHERIS ADVANCED STATISTICS</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
            Quantitative System Logs
          </h2>
        </div>
        
        {/* Time ranges selectors */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 font-mono text-xs backdrop-blur-md">
          {(['1D', '1W', '1M', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold tracking-wider transition-all duration-300 ${
                timeRange === range 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area Chart Block (Full Width) */}
      <div className="glass-panel rounded-2xl p-6 relative">
        <div className="absolute top-6 left-6 flex items-center space-x-2 border-b border-white/10 pb-2 w-[calc(100%-48px)]">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-[13px] text-white tracking-wide uppercase">Consolidated Capital Appreciation Growth</h3>
        </div>

        <div className="w-full h-[320px] pt-14">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartDataArea} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#8f96b3" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <YAxis 
                stroke="#8f96b3" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dx={-10}
                style={{ fontFamily: 'var(--font-mono)' }}
                tickFormatter={(val) => `$${val > 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip content={<CustomTooltipArea />} cursor={{ stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 1 }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22d3ee" 
                strokeWidth={2.5} 
                fill="url(#areaGlowGrad)" 
                activeDot={{ r: 6, stroke: '#22d3ee', strokeWidth: 2, fill: '#05070a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Pie / Radar allocations comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Allocation Pie Chart Donut */}
        <div className="glass-panel rounded-2xl p-6 relative flex flex-col justify-between min-h-[380px]">
          <h3 className="font-display font-semibold text-sm text-white tracking-wide uppercase border-b border-white/10 pb-2">Holdings Diversification Ratio</h3>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-6">
            {/* Pie Chart container */}
            <div className="w-48 h-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltipPie />} />
                  <Pie
                    data={allocationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1.5} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner details count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-mono text-slate-500 uppercase">TOTAL LEDGER</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5">
                  ${totalPortfolioValue > 1000 ? (totalPortfolioValue / 1000).toFixed(1) + 'k' : totalPortfolioValue.toFixed(0)}
                </span>
              </div>
            </div>

            {/* List labels legend */}
            <div className="w-full space-y-2 max-h-[180px] overflow-y-auto font-mono text-[11px] pr-2">
              {allocationPieData.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-1 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: asset.color }} />
                    <span className="font-semibold text-white">{asset.symbol}</span>
                  </div>
                  <span className="text-slate-400">{(asset.value / totalPortfolioValue * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quant Risk Radar Chart */}
        <div className="glass-panel rounded-2xl p-6 relative flex flex-col justify-between min-h-[380px]">
          <h3 className="font-display font-semibold text-sm text-white tracking-wide uppercase border-b border-white/10 pb-2">Tactical Risk Portfolio Metrics</h3>

          <div className="flex items-center justify-center py-4 w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={riskRadarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.08)" opacity={0.4} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="#8f96b3" 
                  fontSize={10} 
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="rgba(255, 255, 255, 0.2)" 
                  fontSize={8} 
                  tickLine={false} 
                />
                <Radar 
                  name="Metrics Overview" 
                  dataKey="A" 
                  stroke="#22d3ee" 
                  fill="#22d3ee" 
                  fillOpacity={0.25} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Micro Metrics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start space-x-4">
          <div className="p-2.5 rounded-lg bg-neon-green/10 text-neon-green mt-1">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">Vault Integrity</h4>
            <p className="text-[11px] text-[#8f96b3] mt-1 leading-normal">
              Active ledger checks reveal 100% simulated node synchronization. Liquidation pools guarded via hot encryption.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start space-x-4">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-1">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">L3 Bridge Efficiency</h4>
            <p className="text-[11px] text-[#8f96b3] mt-1 leading-normal">
              Internal cross-chain gas execution simulated at 0.00 nano-Gwei under platinum tier concessions.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start space-x-4">
          <div className="p-2.5 rounded-lg bg-yellow-500/10 text-yellow-400 mt-1">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">DCA Momentum Engine</h4>
            <p className="text-[11px] text-[#8f96b3] mt-1 leading-normal">
              Algorithms indicate optimal accumulation ratios at support levels under volatile market conditions. Touch "Ask AI Advisor" for reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
