function getColor(game, userLower) {
  const w = game.players?.white
  const b = game.players?.black
  if (w?.user?.id === userLower || w?.user?.name?.toLowerCase() === userLower) return 'white'
  if (b?.user?.id === userLower || b?.user?.name?.toLowerCase() === userLower) return 'black'
  return null
}

function result(game, color) {
  if (!game.winner) return 'draw'
  return game.winner === color ? 'win' : 'loss'
}

// ── 1. Color stats ────────────────────────────────────────────────────────────

export function computeColorStats(games, username) {
  const userLower = username.toLowerCase()
  const stats = {
    white: { win: 0, loss: 0, draw: 0 },
    black: { win: 0, loss: 0, draw: 0 },
  }
  for (const g of games) {
    const color = getColor(g, userLower)
    if (!color || g.status === 'aborted' || g.status === 'noStart') continue
    stats[color][result(g, color)]++
  }
  return stats
}

// ── 2. Openings ───────────────────────────────────────────────────────────────

export function computeOpenings(games, username, minGames = 2) {
  const userLower = username.toLowerCase()
  const map = {}

  for (const g of games) {
    const opening = g.opening?.name
    if (!opening || g.status === 'aborted' || g.status === 'noStart') continue
    const color = getColor(g, userLower)
    if (!color) continue

    if (!map[opening]) map[opening] = { eco: g.opening?.eco, win: 0, loss: 0, draw: 0 }
    map[opening][result(g, color)]++
  }

  return Object.entries(map)
    .map(([name, o]) => {
      const total   = o.win + o.loss + o.draw
      const winRate = total ? o.win / total : 0
      return { name, eco: o.eco, total, win: o.win, loss: o.loss, draw: o.draw, winRate }
    })
    .filter((o) => o.total >= minGames)
    .sort((a, b) => b.total - a.total)
}

// ── 3. Rating buckets ─────────────────────────────────────────────────────────

export function computeRatingBuckets(games, username) {
  const userLower = username.toLowerCase()
  const buckets = {
    weaker:   { label: 'Rivales más débiles', sub: '-100 o más', win: 0, loss: 0, draw: 0 },
    similar:  { label: 'Rivales similares',   sub: '± 100',       win: 0, loss: 0, draw: 0 },
    stronger: { label: 'Rivales más fuertes', sub: '+100 o más',  win: 0, loss: 0, draw: 0 },
  }

  for (const g of games) {
    if (g.status === 'aborted' || g.status === 'noStart') continue
    const color    = getColor(g, userLower)
    if (!color) continue
    const player   = g.players[color]
    const opponent = g.players[color === 'white' ? 'black' : 'white']
    if (!player?.rating || !opponent?.rating) continue

    const diff   = opponent.rating - player.rating
    const bucket = diff < -100 ? 'weaker' : diff > 100 ? 'stronger' : 'similar'
    buckets[bucket][result(g, color)]++
  }

  return buckets
}

// ── 4. Defeat reasons ─────────────────────────────────────────────────────────

const STATUS_LABELS = {
  mate:       'Nos dieron mate',
  resign:     'Nos rendimos',
  outoftime:  'Tiempo agotado',
  timeout:    'Abandono / desconexión',
  cheat:      'Detección de trampa',
}

export function computeDefeatReasons(games, username) {
  const userLower = username.toLowerCase()
  const reasons   = {}
  let   total     = 0

  for (const g of games) {
    const color = getColor(g, userLower)
    if (!color || result(g, color) !== 'loss') continue
    const key        = STATUS_LABELS[g.status] ?? g.status ?? 'Otra razón'
    reasons[key]     = (reasons[key] ?? 0) + 1
    total++
  }

  return Object.entries(reasons)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

// ── 5. Streaks ────────────────────────────────────────────────────────────────

export function computeStreaks(games, username) {
  const userLower = username.toLowerCase()
  const sorted    = [...games]
    .filter((g) => g.status !== 'aborted' && g.status !== 'noStart')
    .sort((a, b) => a.createdAt - b.createdAt)

  let best = 0
  let run  = 0

  for (const g of sorted) {
    const color = getColor(g, userLower)
    if (!color) continue
    if (result(g, color) === 'win') { run++; if (run > best) best = run }
    else run = 0
  }

  // Current streak from the end (wins only)
  let current = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    const color = getColor(sorted[i], userLower)
    if (!color) continue
    if (result(sorted[i], color) === 'win') current++
    else break
  }

  // Last game result for context
  const last = sorted[sorted.length - 1]
  const lastColor  = last ? getColor(last, userLower) : null
  const lastResult = last && lastColor ? result(last, lastColor) : null

  return { current, best, total: sorted.length, lastResult }
}
