import { useState, useCallback } from 'react'

function toDate(year, month, day) {
  // month in Lichess API is 0-indexed
  return new Date(year, month, day)
}

function groupByWeek(points) {
  const byWeek = {}
  points.forEach(([y, m, d, rating]) => {
    const date = toDate(y, m, d)
    const monday = new Date(date)
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7))
    const key = monday.toISOString().slice(0, 10)
    byWeek[key] = { date: monday, rating }
  })
  return Object.values(byWeek).sort((a, b) => a.date - b.date)
}

function groupByMonth(points) {
  const byMonth = {}
  points.forEach(([y, m, d, rating]) => {
    const key = `${y}-${String(m).padStart(2, '0')}`
    byMonth[key] = { date: new Date(y, m, 1), rating }
  })
  return Object.values(byMonth).sort((a, b) => a.date - b.date)
}

export function useLichessRatingHistory() {
  const [rawHistory, setRawHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async (username) => {
    if (!username) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://lichess.org/api/user/${username}/rating-history`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setRawHistory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  function getChartData(variant, view) {
    if (!rawHistory) return []
    const entry = rawHistory.find(
      (e) => e.name.toLowerCase() === variant.toLowerCase()
    )
    if (!entry || entry.points.length === 0) return []

    const now = new Date()
    let points = entry.points

    if (view === 'day') {
      const cutoff = new Date(now)
      cutoff.setDate(now.getDate() - 30)
      points = points.filter(([y, m, d]) => toDate(y, m, d) >= cutoff)
      return points.map(([y, m, d, rating]) => ({
        date: toDate(y, m, d),
        label: toDate(y, m, d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        rating,
      }))
    }

    if (view === 'week') {
      const cutoff = new Date(now)
      cutoff.setDate(now.getDate() - 84) // 12 weeks
      points = points.filter(([y, m, d]) => toDate(y, m, d) >= cutoff)
      return groupByWeek(points).map(({ date, rating }) => ({
        date,
        label: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        rating,
      }))
    }

    if (view === 'month') {
      const cutoff = new Date(now)
      cutoff.setMonth(now.getMonth() - 12)
      points = points.filter(([y, m, d]) => toDate(y, m, d) >= cutoff)
      return groupByMonth(points).map(({ date, rating }) => ({
        date,
        label: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        rating,
      }))
    }

    return []
  }

  const variants = rawHistory
    ? rawHistory.filter((e) => e.points.length > 0).map((e) => e.name)
    : []

  return { rawHistory, loading, error, fetchHistory, getChartData, variants }
}
