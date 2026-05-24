import { Card, CardContent } from './ui/Card'

const ICONS = {
  bullet: '⚡',
  blitz: '🔥',
  rapid: '⏱️',
  classical: '♟️',
  correspondence: '✉️',
  chess960: '🎲',
  crazyhouse: '🃏',
  antichess: '🔄',
  atomic: '💥',
  horde: '👾',
  kingOfTheHill: '👑',
  racingKings: '🏁',
  threeCheck: '3️⃣',
  ultraBullet: '🚀',
}

const LABELS = {
  bullet: 'Bullet',
  blitz: 'Blitz',
  rapid: 'Rapid',
  classical: 'Classical',
  correspondence: 'Correspondencia',
  chess960: 'Chess960',
  crazyhouse: 'Crazyhouse',
  antichess: 'Antichess',
  atomic: 'Atomic',
  horde: 'Horde',
  kingOfTheHill: 'King of the Hill',
  racingKings: 'Racing Kings',
  threeCheck: 'Three-Check',
  ultraBullet: 'UltraBullet',
}

export function RatingCard({ variant, perf }) {
  const { rating, games, prog, prov } = perf
  const progPositive = prog > 0
  const progZero = prog === 0

  return (
    <Card className="hover:border-gray-700 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {LABELS[variant] ?? variant}
          </span>
          <span className="text-base">{ICONS[variant] ?? '♙'}</span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white">{rating}</span>
          {prov && <span className="text-gray-500 text-sm">?</span>}
          {!progZero && (
            <span
              className={`text-xs font-semibold ml-1 ${
                progPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {progPositive ? '+' : ''}{prog}
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500 mt-1 block">
          {games.toLocaleString()} partidas
        </span>
      </CardContent>
    </Card>
  )
}
