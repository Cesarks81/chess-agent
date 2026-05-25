export function EloProgressBar({ perf }) {
  if (!perf || perf.games === 0) return null

  const elo  = perf.rating
  const prev = Math.floor(elo / 200) * 200
  const next = prev + 200
  const pct  = Math.round(((elo - prev) / 200) * 100)

  return (
    <div className="hidden lg:flex flex-col items-center gap-2 py-1 self-stretch select-none">
      <span className="text-[10px] text-gray-600 font-mono tabular-nums">{next}</span>
      <div className="relative flex-1 w-2.5 rounded-full bg-gray-800/70 overflow-hidden">
        <div
          className="absolute bottom-0 inset-x-0 rounded-full bg-emerald-500 transition-all duration-700"
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-600 font-mono tabular-nums">{prev}</span>
    </div>
  )
}
