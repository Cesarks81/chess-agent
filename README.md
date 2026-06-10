<div align="center">

# ChessAgent

**Personal chess statistics dashboard powered by the Lichess API**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.x-22B5BF?style=flat)](https://recharts.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

[Live demo](https://chess-agent-omega.vercel.app) · [Report a bug](https://github.com/Cesarks81/chess-agent/issues) · [Request a feature](https://github.com/Cesarks81/chess-agent/issues)

</div>

---

## Table of contents

- [Description](#description)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Project structure](#project-structure)

---

## Description

ChessAgent is a single-page application that connects to the Lichess public API to visualize your personal chess statistics. It displays your ELO history, opening performance, win/loss patterns, and progress toward rating milestones — all in a responsive dark-themed dashboard.

---

## Features

### Ratings
- Current ELO for Blitz, Rapid, and Bullet with recent progression
- ELO progress bar toward the next 200-point milestone
- Total games, wins, and losses summary with win-rate bar

### ELO chart
- Per-game ELO gains and losses as a bar chart
- Three views: today, this week, this month
- Automatic hourly grouping when today has more than 40 games
- Copy current view games to clipboard in PGN format

### Insights
- Opening analysis with win rate, draw rate, and loss rate per opening
- Performance by color (white vs black)
- Defeat reasons breakdown (resignation, checkmate, timeout...)
- Win rate against weaker, similar, and stronger opponents
- Current and best win streak of the month

### Search
- Look up any Lichess user and view their full statistics
- One-click return to your own profile

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19.x |
| Build tool | Vite | 8.x |
| Styles | Tailwind CSS | 4.x |
| Charts | Recharts | 3.x |
| Component variants | class-variance-authority | 0.7.x |
| Data source | Lichess API (public + OAuth PAT) | — |
| Deployment | Vercel | — |

---

## Prerequisites

- **Node.js** >= 18.x and **npm** >= 9.x
- A [Lichess](https://lichess.org) account
- A Lichess Personal Access Token (optional — without it the app works but is subject to public API rate limits)

---

## Installation

```bash
git clone https://github.com/Cesarks81/chess-agent.git
cd chess-agent
npm install
```

Create a `.env` file at the project root (see [Environment variables](#environment-variables)), then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment variables

Create a `.env` file at the project root:

```env
VITE_LICHESS_TOKEN=your_personal_access_token
```

You can generate a token at https://lichess.org/account/oauth/token. No specific scopes are required for read-only access.

> **Security note:** Never commit the `.env` file. It is already listed in `.gitignore`.

Without `VITE_LICHESS_TOKEN` the app still works using the Lichess public API, but you may hit rate limits (HTTP 429) if you fetch many games.

---

## Deployment

The project is configured for deployment on **Vercel** as a static frontend.

```bash
npm run build
```

Or connect the repository directly in the Vercel dashboard. Before deploying, add `VITE_LICHESS_TOKEN` as an environment variable in **Settings > Environment Variables**.

---

## Project structure

```
src/
├── auth/
│   └── lichessOAuth.js          # localStorage token helpers
├── components/
│   ├── insights/
│   │   ├── ColorStats.jsx       # Performance by color
│   │   ├── DefeatReasons.jsx    # Loss reason breakdown
│   │   ├── OpeningsTable.jsx    # Opening win rates
│   │   ├── RatingBuckets.jsx    # Performance vs opponent rating
│   │   └── StreakCard.jsx       # Win streak
│   ├── ui/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Tabs.jsx
│   ├── EloChart.jsx             # ELO bar chart + progress bar
│   ├── HeaderProfile.jsx        # User avatar dropdown
│   ├── RatingCard.jsx           # Blitz / Rapid / Bullet card
│   ├── SearchBar.jsx
│   └── StatsOverview.jsx
├── hooks/
│   ├── useLichessAuth.js        # PAT-based auth
│   ├── useLichessGames.js       # Game fetch, chart data, PGN export
│   └── useLichessUser.js        # User profile fetch
├── utils/
│   └── insights.js              # Pure computation functions
├── App.jsx
└── index.css
```

---

<div align="center">

Developed by [César Ramos Morón](https://github.com/Cesarks81)

</div>
