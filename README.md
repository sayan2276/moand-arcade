# 🎮 Monad Arcade — Web3 Vertical Gaming Feed & AI Game Studio

> **TikTok-style infinite vertical feed for instant web games, powered by Monad Testnet on-chain rewards, server-validated anti-cheat, and AI game generation.**

---

## 🌟 Overview

**Monad Arcade** reimagines casual web gaming for the Web3 era. Users scroll through an infinite vertical feed of 20+ instant HTML5 games (like *Spacebar Clicker*, *Doodle Jump*, *Drive Mad*, *Paper.io*), earning real **MON** rewards for gameplay time and score milestones, and publishing AI-generated custom mini-games onto the blockchain.

---

## ✨ Key MVP Features

### 1. ⚡ Memory-Optimized Game Feed
- **Strict DOM Windowing:** Aggressively manages browser RAM by mounting only the active game and immediate adjacent games (`[activeIndex-1, activeIndex+1]`).
- **Aggressive RAM Cleanup:** Unmounted game iframes are stripped from the DOM and set to `about:blank`, preventing browser crash/lag during extended sessions.

### 2. ⏳ Server-Validated 1-Minute Play Rewards
- **Active Playtime Tracking:** Monitors game visibility state (`document.visibilityState === 'visible'`) and active duration.
- **Server Validation:** Calls backend `/api/sessions/reward-minute` to credit `+0.001 MON` off-chain rewards with real-time UI toast notifications.

### 3. 🔐 1.0 MON Minimum On-Chain Claiming
- **Threshold Check:** Enforces a minimum withdrawal balance of `1.0 MON`.
- **EIP-191 Relayer Vouchers:** FastAPI backend cryptographically signs claim vouchers using an admin relayer private key.
- **Escrow Contract:** Claims execute on-chain against the deployed `MonadArcadeEscrow.sol` contract on Monad Testnet.

### 4. 🤖 0.1 MON AI Game Creation & Publishing
- **Free Sandbox Preview:** Generates playable HTML5/Canvas games instantly using OpenRouter AI.
- **Web3 Payment Flow:** Requires a `0.1 MON` Web3 wallet payment on Monad Testnet to publish new games directly to the global feed.

### 5. 📺 Interstitial Video Ad System
- **Ad Rotation:** Plays responsive interstitial video ads (`ad1.mp4`, `ad2.mp4`) after every 3 games played.
- **5-Second Countdown:** Enforces an unskippable 5-second countdown timer before unlocking the skip button.

---

## 📜 Smart Contract Details

- **Network:** Monad Testnet (Chain ID: `10143`)
- **Escrow Contract Address:** [`0x3c27188e8BE9aEb45240aF64bcb4B2d2df0e528d`](https://testnet.monadexplorer.com/address/0x3c27188e8BE9aEb45240aF64bcb4B2d2df0e528d)
- **Admin Relayer Address:** `0xcfE68eb06Db21EFB4697d82112fee0a0fE36bCAF`
- **RPC URL:** `https://testnet-rpc.monad.xyz`
- **Explorer:** `https://testnet.monadexplorer.com`

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, Ethers.js v6, Lucide React
- **Backend:** FastAPI (Python), Web3.py, Eth-Account, OpenRouter API
- **Database & Auth:** Supabase (PostgreSQL with RLS), UUID Guest Profile Auto-Sync
- **Smart Contracts:** Solidity 0.8.20 (Hardened Escrow with EIP-191 signature validation & EIP-2 malleability protection)

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- MetaMask connected to Monad Testnet

---

### 1. Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the initial schema:
   ```bash
   supabase_schema.sql
   ```
3. Run the incremental patch to ensure all columns exist:
   ```bash
   migration_patch.sql
   ```

---

### 2. Frontend Setup

1. Copy `.env.local` configuration:
   ```bash
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co/rest/v1/
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_BACKEND_URL=http://127.0.0.1:8000
   VITE_ESCROW_CONTRACT_ADDRESS=0x3c27188e8BE9aEb45240aF64bcb4B2d2df0e528d
   ```

2. Install dependencies & start dev server:
   ```bash
   npm install
   npm run dev
   ```

---

### 3. Backend Setup

1. Configure `backend/.env`:
   ```bash
   SUPABASE_URL=https://your-supabase-project.supabase.co/rest/v1/
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   OPENROUTER_API_KEY=your-openrouter-api-key
   ADMIN_RELAYER_PRIVATE_KEY=your-relayer-private-key
   ESCROW_CONTRACT_ADDRESS=0x3c27188e8BE9aEb45240aF64bcb4B2d2df0e528d
   ```

2. Install dependencies & launch FastAPI backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --port 8000 --reload
   ```

---

## ☁️ Deployment Instructions

- **Frontend:** Deploy to [Vercel](https://vercel.com) using root directory, build command `npm run build`, and environment variables (`VITE_*`).
- **Backend:** Deploy to [Railway](https://railway.app) setting root directory to `backend/` and start command `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## ⚖️ License

MIT License © 2026 Monad Arcade Team
