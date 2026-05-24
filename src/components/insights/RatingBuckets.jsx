import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

function Bucket({ data }) {
  const total = data.win + data.loss + data.draw
  if (total === 0) return (
    <div className="flex flex-col items-center gap-1 opacity-30">
      <span className="text-xs text-gray-500 text-center">{data.label}</span>
      <span className="text-lg font-bold text-gray-600">—</span>
      <span className="text-xs text-gray-600">{data.sub}</span>
    </div>
  )

  const winRate = Math.round((data.win / total) * 100)
  const color =
    winRate >= 55 ? 'text-emerald-400' :
    winRate >= 45 ? 'text-gray-300'    :
                    'text-red-400'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500 text-center font-medium">{data.label}</span>
      <span className={`text-3xl font-bold ${color}`}>{winRate}%</span>
      <span className="text-xs text-gray-600">{data.sub}</span>
      <div className="flex gap-1.5 text-xs mt-1">
        <span className="text-emerald-400">{data.win}W</span>
        <span className="text-gray-600">{data.draw}D</span>
        <span className="text-red-400">{data.loss}L</span>
      </div>
    </div>
  )
}

export function RatingBuckets({ buckets }) {
  if (!buckets) return null

  const total = Object.values(buckets).reduce((s, b) => s + b.win + b.loss + b.draw, 0)
  if (total === 0) return null

  // Find weak spot
  const weakest = Object.entries(buckets)
    .filter(([, b]) => b.win + b.loss + b.draw > 0)
    .map(([, b]) => ({ ...b, wr: b.win / (b.win + b.loss + b.draw) }))
    .sort((a, b) => a.wr - b.wr)[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento según el rival</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Bucket data={buckets.weaker} />
          <Bucket data={buckets.similar} />
          <Bucket data={buckets.stronger} />
        </div>

        {weakest && weakest.wr < 0.45 && (
          <p className="text-xs text-gray-600 border-t border-gray-800 pt-3">
            Tu peor win rate es contra <span className="text-gray-400">{weakest.label.toLowerCase()}</span> ({Math.round(weakest.wr * 100)}%). Revisar si hay un patrón.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
