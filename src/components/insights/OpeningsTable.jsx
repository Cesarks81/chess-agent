import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Tabs } from '../ui/Tabs'

const TABS = [
  { value: 'all',  label: 'Todas' },
  { value: 'best', label: 'Mejores' },
  { value: 'worst', label: 'Peores' },
]

function WinBar({ win, draw, loss }) {
  const total = win + draw + loss || 1
  const wp = (win  / total) * 100
  const dp = (draw / total) * 100
  const lp = (loss / total) * 100
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-px w-20">
      <div className="bg-emerald-500" style={{ width: `${wp}%` }} />
      <div className="bg-gray-600"   style={{ width: `${dp}%` }} />
      <div className="bg-red-500"    style={{ width: `${lp}%` }} />
    </div>
  )
}

export function OpeningsTable({ openings }) {
  const [tab, setTab] = useState('all')

  if (!openings || openings.length === 0) return null

  const sorted =
    tab === 'best'
      ? [...openings].sort((a, b) => b.winRate - a.winRate).slice(0, 5)
      : tab === 'worst'
      ? [...openings].sort((a, b) => a.winRate - b.winRate).slice(0, 5)
      : openings.slice(0, 8)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Aperturas este mes</CardTitle>
          <Tabs value={tab} onChange={setTab} options={TABS} className="w-auto" />
        </div>
      </CardHeader>
      <CardContent>
        <div key={tab} className="space-y-2">
          {sorted.map((o, i) => (
            <div
              key={o.name}
              style={{
                animation: `fade-slide-up 0.2s ease-out ${i * 45}ms both`,
              }}
              className="flex items-center justify-between gap-3 py-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex-1 min-w-0">
                {o.eco && (
                  <span className="text-xs text-gray-600 font-mono mr-1.5">{o.eco}</span>
                )}
                <span className="text-sm text-gray-200 truncate">{o.name}</span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <WinBar win={o.win} draw={o.draw} loss={o.loss} />
                <span
                  className={`text-xs font-semibold w-10 text-right ${
                    o.winRate >= 0.55
                      ? 'text-emerald-400'
                      : o.winRate <= 0.35
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {Math.round(o.winRate * 100)}%
                </span>
                <span className="text-xs text-gray-600 w-8 text-right">{o.total}p</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
