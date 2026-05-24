import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Tabs } from './ui/Tabs'

const VIEW_OPTIONS = [
  { value: 'day',   label: 'Hoy' },
  { value: 'week',  label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  if (d.aggregated && d.games === 0) return null

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 shadow-lg text-sm min-w-[120px]">
      <p className="text-gray-400 text-xs mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-base font-bold ${
            d.diff > 0 ? 'text-emerald-400' : d.diff < 0 ? 'text-red-400' : 'text-gray-400'
          }`}
        >
          {d.diff > 0 ? '+' : ''}{d.diff}
        </span>
        <span className="text-gray-500 text-xs">ELO</span>
      </div>

      {d.aggregated ? (
        <p className="text-gray-500 text-xs mt-0.5">{d.games} partida{d.games !== 1 ? 's' : ''}</p>
      ) : (
        <>
          <p className="text-gray-500 text-xs mt-0.5">{d.rating} → {d.ratingAfter}</p>
          {d.perf && <p className="text-gray-600 text-xs capitalize mt-0.5">{d.perf}</p>}
        </>
      )}
    </div>
  )
}

export function EloChart({ getChartData, loading }) {
  const [view, setView] = useState('day')

  const data = getChartData(view)

  const isHourlyDay = view === 'day' && data[0]?.aggregated === true

  const totalDiff  = data.reduce((sum, d) => sum + d.diff, 0)
  const totalGames = isHourlyDay || data[0]?.aggregated
    ? data.reduce((sum, d) => sum + (d.games ?? 0), 0)
    : data.length
  const wins   = data.filter((d) => d.diff > 0).length
  const draws  = data.filter((d) => d.diff === 0 && (d.games ?? 1) > 0).length
  const losses = data.filter((d) => d.diff < 0).length

  const maxAbs = data.length
    ? Math.max(...data.map((d) => Math.abs(d.diff)), 1)
    : 10
  const domainPad = Math.ceil(maxAbs * 1.3)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>ELO por partida</CardTitle>
          {totalGames > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>{totalGames} partidas</span>
              {isHourlyDay && <span className="text-gray-700">· por hora</span>}
              <span className="text-emerald-400">{wins}↑</span>
              {draws > 0 && <span className="text-gray-400">{draws}—</span>}
              <span className="text-red-400">{losses}↓</span>
              <span
                className={`font-semibold text-sm ${
                  totalDiff > 0 ? 'text-emerald-400' : totalDiff < 0 ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                {totalDiff > 0 ? '+' : ''}{totalDiff}
              </span>
            </div>
          )}
        </div>
        <Tabs value={view} onChange={setView} options={VIEW_OPTIONS} />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-600 text-sm animate-pulse">
            Cargando partidas...
          </div>
        ) : totalGames === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm gap-2">
            <span className="text-3xl">♟</span>
            <span>
              {view === 'day'
                ? 'No jugaste partidas hoy'
                : view === 'week'
                ? 'No jugaste partidas esta semana'
                : 'No jugaste partidas este mes'}
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#4b5563', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[-domainPad, domainPad]}
                tick={{ fill: '#4b5563', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={34}
                tickFormatter={(v) => (v > 0 ? `+${v}` : v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <ReferenceLine y={0} stroke="#374151" strokeWidth={1} />
              <Bar dataKey="diff" radius={[3, 3, 3, 3]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.diff > 0
                        ? '#34d399'
                        : entry.diff < 0
                        ? '#f87171'
                        : '#6b7280'
                    }
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
