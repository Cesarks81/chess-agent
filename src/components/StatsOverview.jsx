import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'

function Stat({ label, value, color = 'text-white' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  )
}

export function StatsOverview({ count }) {
  const { all = 0, rated = 0, win = 0, loss = 0, draw = 0 } = count ?? {}
  const total = win + loss + draw || 1

  const winPct  = Math.round((win / total) * 100)
  const lossPct = Math.round((loss / total) * 100)
  const drawPct = 100 - winPct - lossPct

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de partidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <Stat label="Total" value={all.toLocaleString()} />
          <Stat label="Clasificadas" value={rated.toLocaleString()} />
          <Stat label="Victorias" value={win.toLocaleString()} color="text-emerald-400" />
          <Stat label="Derrotas" value={loss.toLocaleString()} color="text-red-400" />
        </div>

        <div className="space-y-2">
          <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${winPct}%` }}
              title={`Victorias ${winPct}%`}
            />
            <div
              className="bg-gray-600 transition-all"
              style={{ width: `${drawPct}%` }}
              title={`Tablas ${drawPct}%`}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${lossPct}%` }}
              title={`Derrotas ${lossPct}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="text-emerald-400">{winPct}% victorias</span>
            <span>{drawPct}% tablas</span>
            <span className="text-red-400">{lossPct}% derrotas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
