# ChessAgent

Dashboard de estadísticas personales de ajedrez conectado a la API de Lichess.

**Live:** https://chess-agent-omega.vercel.app/

---

## Características

- Perfil de usuario con ELO actual en Blitz, Rapid y Bullet
- Grafica de ELO por partida con vistas de hoy, esta semana y este mes
- Analisis de aperturas jugadas este mes con porcentaje de victorias
- Rendimiento por color (blancas vs negras)
- Razones de derrota (abandono, mate, tiempo...)
- Rendimiento contra rivales mas debiles, similares y mas fuertes
- Racha actual y mejor racha del mes
- Busqueda de cualquier usuario de Lichess

---

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts
- Lichess API (publica + autenticacion por Personal Access Token)

---

## Instalacion local

```bash
git clone https://github.com/Cesarks81/chess-agent.git
cd chess-agent
npm install
```

Crea un archivo `.env` en la raiz del proyecto:

```
VITE_LICHESS_TOKEN=tu_personal_access_token
```

Puedes generar un token en https://lichess.org/account/oauth/token

```bash
npm run dev
```

---

## Despliegue en Vercel

1. Conecta el repositorio en vercel.com
2. En **Settings > Environment Variables** añade:
   - `VITE_LICHESS_TOKEN` con tu token de Lichess
3. Despliega

Sin el token la aplicacion funciona igualmente pero con limite de peticiones de la API publica de Lichess.

---

## Estructura

```
src/
  components/
    insights/       # ColorStats, DefeatReasons, OpeningsTable, RatingBuckets, StreakCard
    ui/             # Button, Card, Input, Tabs, Badge
    EloChart.jsx
    HeaderProfile.jsx
    RatingCard.jsx
    SearchBar.jsx
    StatsOverview.jsx
  hooks/
    useLichessAuth.js
    useLichessGames.js
    useLichessUser.js
  utils/
    insights.js     # logica de calculo de estadisticas
  auth/
    lichessOAuth.js
```
