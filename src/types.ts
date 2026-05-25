/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MarketTrend = 'stable' | 'bull' | 'bear' | 'volatile' | 'flash-crash';

export interface SimulatorSettings {
  marketTrend: MarketTrend;
  volatilityMultiplier: number;
  realtimeUpdatesEnabled: boolean;
}

export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdraw';

export interface Transaction {
  id: string;
  type: TransactionType;
  assetId: string;
  assetSymbol: string;
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // Percentage, e.g. -2.45 or +3.21
  volume24h: number; // in USD
  marketCap: number; // in USD
  high24h: number;
  low24h: number;
  history1d: number[]; // Sparkline history (e.g. 12 data points)
  history7d: { date: string; price: number }[]; // 7 days of detailed chart data
  balance: number; // Amount held by the user in this wallet
  color: string; // Tailind hex color or neon theme name for charts
}

export type UserTier = 'bronze' | 'gold' | 'apex-platinum';

export interface UserProfile {
  username: string;
  email: string;
  tier: UserTier;
  kycCertified: boolean;
  securityScore: number; // e.g., 95
  twoFactorEnabled: boolean;
  addresses: {
    BTC: string;
    ETH: string;
    SOL: string;
    USDC: string;
  };
}

export interface PortfolioStats {
  totalBalanceUSD: number;
  balanceChange24hUSD: number;
  balanceChange24hPercent: number;
  profitAllTimeUSD: number;
  profitAllTimePercent: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
