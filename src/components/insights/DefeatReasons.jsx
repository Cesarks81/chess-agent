import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-gray-500', 'bg-gray-600']

export function DefeatReasons({ reasons }) {
  if (!reasons || reasons.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>¿Por qué pierdes?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reasons.map(({ label, count, pct }, i) => (
          <div key={label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">{count} partidas</span>
                <span className="text-white font-medium w-10 text-right">{pct}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${COLORS[i] ?? 'bg-gray-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}

        {reasons[0] && (
          <p className="text-xs text-gray-600 pt-2 border-t border-gray-800">
            {reasons[0].pct >= 50
              ? `El ${reasons[0].pct}% de tus derrotas son por "${reasons[0].label}". Céntrate en mejorar esto.`
              : 'Tus derrotas están bien distribuidas entre varias causas.'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
