/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Pre-initialize Gemini API confidently
// We enforce a lazy check within the endpoint so the app doesn't crash on boot if the key is somehow absent.
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getGemini(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // 1. API: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. API: Premium Gemini AI Advisor Endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const { prompt, portfolioStats, coins, trend, userQuery, messageHistory } = req.body;
      
      const geminiClient = getGemini();

      // Formulate a premium financial cybernetic personality prompt
      const systemInstruction = `You are "AETHERIS AI", an elite AI Crypto Portfolio Advisor & Quantum Market Quantitative Analyst.
You speak with professional, highly knowledgeable cyber-financial authority.
You should analyze the user's simulated portfolio status and general market trend.
- Use crypto terms naturally (e.g., DCA, support levels, liquidation limits, order books, moving averages, relative strength index, high-frequency liquidity pool).
- Give targeted, strategic, customized suggestions based on their current balance, allocation, and risk.
- Do NOT make definitive real-world financial promises. Frame everything as premium simulated advice on Aetheris Platform.
- Use elegant markdown formatting. Add structured headers, bullets, or short tables if helpful.
- Keep your answers highly refined, premium, concise, and focused on maximizing tactical advantage under their specified simulation settings.
- If the user specifies trend "${trend}", adapt your sentiment immediately (e.g., Bull -> recommend calculated exits or momentum plays; Bear -> recommend scaling in, yield farming, or defensive holdings; Volatile -> option hedges or stability assets).`;

      const messagesForGemini = [
        {
          role: 'user',
          text: `Context of Simulation:
- Current Market Trend Setting: **${trend.toUpperCase()}**
- Total Selected Balance: $${portfolioStats?.totalBalanceUSD?.toLocaleString() || '180,000'}
- 24h Portfolio Change: ${portfolioStats?.balanceChange24hPercent?.toFixed(2) || '0.00'}%
- Simulated Coin holdings list: ${JSON.stringify(coins?.map((c: any) => ({ symbol: c.symbol, price: c.price, held: c.balance })) || [])}

User Portfolio Stats Object: ${JSON.stringify(portfolioStats || {})}

User request or message: "${userQuery || 'Please analyze my current simulated portfolio and provide tactical crypto allocation advice.'}"

Respond styled in a premium theme.`
        }
      ];

      // Call Gemini 3.5 Flash for speed and accurate insights
      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: messagesForGemini.map(m => m.text).join('\n\n'),
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Aetheris network analysis returned no results. Please try again.";
      res.json({ response: responseText });
    } catch (error: any) {
      console.error('Advisor Error:', error);
      res.status(500).json({ 
        error: 'Aetheris AI core is offline or key missing.', 
        details: error?.message || 'Unknown network error'
      });
    }
  });

  // Serve static assets and handle routing via Vite or Express structure
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AETHERIS SERVER] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AETHERIS SERVER] Failed to start:', err);
});
