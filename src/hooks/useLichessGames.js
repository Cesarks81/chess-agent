import { useState, useCallback } from 'react'

function startOfMonth() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function startOfDay() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function startOfWeek() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

async function fetchMonthGames(username, token) {
  const params = new URLSearchParams({
    rated:   'true',
    since:   String(startOfMonth()),
    max:     '2000',
    moves:   'false',
    opening: 'true',
  })

  const headers = { Accept: 'application/x-ndjson' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(
    `https://lichess.org/api/games/user/${username}?${params}`,
    { headers }
  )
  if (!res.ok) throw new Error(`Error ${res.status} al obtener partidas`)

  const text  = await res.text()
  const games = []
  for (const line of text.trim().split('\n').filter(Boolean)) {
    try { games.push(JSON.parse(line)) } catch { /* skip malformed */ }
  }
  return games
}

function playerColor(game, userLower) {
  const w = game.players?.white
  const b = game.players?.black
  if (w?.user?.id === userLower || w?.user?.name?.toLowerCase() === userLower) return 'white'
  if (b?.user?.id === userLower || b?.user?.name?.toLowerCase() === userLower) return 'black'
  return null
}

function toPoints(games, username) {
  const userLower = username.toLowerCase()
  const points = []

  for (const game of [...games].sort((a, b) => a.createdAt - b.createdAt)) {
    const color  = playerColor(game, userLower)
    if (!color) continue
    const player = game.players[color]
    if (player.rating == null) continue

    points.push({
      ts:          game.createdAt,
      diff:        player.ratingDiff ?? 0,
      rating:      player.rating,
      ratingAfter: player.rating + (player.ratingDiff ?? 0),
      perf:        game.perf,
    })
  }

  return points
}

const DAY_MS  = 86_400_000
const HOUR_MS = 3_600_000

function aggregateByDay(points, dayStarts) {
  return dayStarts.map((ts) => {
    const day  = points.filter((p) => p.ts >= ts && p.ts < ts + DAY_MS)
    const diff = day.reduce((sum, p) => sum + p.diff, 0)
    return { ts, diff, games: day.length, aggregated: true }
  })
}

export function useLichessGames(token) {
  const [rawGames, setRawGames]   = useState([])
  const [allPoints, setAllPoints] = useState([])
  const [username, setUsername]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const fetchAll = useCallback(async (user) => {
    if (!user) return
    setLoading(true)
    setError(null)
    setUsername(user)
    try {
      const games = await fetchMonthGames(user, token)
      setRawGames(games)
      setAllPoints(toPoints(games, user))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  function getChartData(view) {
    if (view === 'day') {
      const todayPoints = allPoints.filter((p) => p.ts >= startOfDay())

      if (todayPoints.length > 40) {
        const dayStart   = startOfDay()
        const hourStarts = Array.from({ length: 24 }, (_, i) => dayStart + i * HOUR_MS)
        return hourStarts.map((ts) => {
          const hour = todayPoints.filter((p) => p.ts >= ts && p.ts < ts + HOUR_MS)
          const diff = hour.reduce((sum, p) => sum + p.diff, 0)
          return {
            ts,
            diff,
            games:      hour.length,
            aggregated: true,
            label:      new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          }
        })
      }

      return todayPoints.map((p) => ({
        ...p,
        aggregated: false,
        label: new Date(p.ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      }))
    }

    if (view === 'week') {
      const monday    = startOfWeek()
      const dayStarts = Array.from({ length: 7 }, (_, i) => monday + i * DAY_MS)
      return aggregateByDay(allPoints, dayStarts).map((p) => ({
        ...p,
        label: new Date(p.ts).toLocaleDateString('es-ES', { weekday: 'short' }),
      }))
    }

    const now         = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dayStarts   = Array.from({ length: daysInMonth }, (_, i) =>
      new Date(now.getFullYear(), now.getMonth(), i + 1).getTime()
    )
    return aggregateByDay(allPoints, dayStarts).map((p) => ({
      ...p,
      label: String(new Date(p.ts).getDate()),
    }))
  }

  return { rawGames, username, loading, error, fetchAll, getChartData }
}
