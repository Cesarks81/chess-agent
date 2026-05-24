import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

function Bar({ win, loss, draw }) {
  const total = win + loss + draw || 1
  const wp = Math.round((win  / total) * 100)
  const lp = Math.round((loss / total) * 100)
  const dp = 100 - wp - lp
  return (
    <div className="space-y-1">
      <div className="flex h-2 rounded-full overflow-hidden gap-px">
        <div className="bg-emerald-500 transition-all" style={{ width: `${wp}%` }} />
        <div className="bg-gray-600  transition-all" style={{ width: `${dp}%` }} />
        <div className="bg-red-500   transition-all" style={{ width: `${lp}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span className="text-emerald-400">{wp}%</span>
        <span>{dp}%</span>
        <span className="text-red-400">{lp}%</span>
      </div>
    </div>
  )
}

function ColorRow({ label, emoji, stats }) {
  const total = stats.win + stats.loss + stats.draw
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-400">{stats.win}W</span>
          <span className="text-gray-500">{stats.draw}D</span>
          <span className="text-red-400">{stats.loss}L</span>
          <span className="text-gray-600">({total})</span>
        </div>
      </div>
      <Bar {...stats} />
    </div>
  )
}

export function ColorStats({ stats }) {
  if (!stats) return null
  const { white, black } = stats

  const whiteTotal = white.win + white.loss + white.draw
  const blackTotal = black.win + black.loss + black.draw
  if (whiteTotal + blackTotal === 0) return null

  const whiteWr = whiteTotal ? Math.round((white.win / whiteTotal) * 100) : 0
  const blackWr = blackTotal ? Math.round((black.win / blackTotal) * 100) : 0
  const stronger = whiteWr > blackWr ? '♙ Blancas' : blackWr > whiteWr ? '♟ Negras' : null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <CardTitle>Rendimiento por color</CardTitle>
          {stronger && (
            <span className="text-xs text-emerald-400">Tu color fuerte: {stronger}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ColorRow label="Blancas" emoji="♙" stats={white} />
        <ColorRow label="Negras"  emoji="♟" stats={black} />
      </CardContent>
    </Card>
  )
}
