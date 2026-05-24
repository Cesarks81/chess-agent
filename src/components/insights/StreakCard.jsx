import { Card, CardContent } from '../ui/Card'

export function StreakCard({ streaks }) {
  if (!streaks || streaks.total === 0) return null
  const { current, best, lastResult } = streaks

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">Rachas este mes</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-bold ${current > 0 ? 'text-emerald-400' : 'text-gray-600'}`}>
                {current}
              </span>
              <span className="text-gray-500 text-sm">victorias</span>
            </div>
            <p className="text-xs text-gray-500">Racha actual</p>
          </div>

          <div className="flex flex-col gap-1 border-l border-gray-800 pl-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-white">{best}</span>
              <span className="text-gray-500 text-sm">victorias</span>
            </div>
            <p className="text-xs text-gray-500">Mejor racha</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
