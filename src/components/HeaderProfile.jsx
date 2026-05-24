import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/Button'

function formatDate(ms) {
  return new Date(ms).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatPlayTime(seconds) {
  const h = Math.floor(seconds / 3600)
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  )
}

export function HeaderProfile({ data, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  if (!data) return null

  const initial = data.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-800 transition-colors"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm select-none">
            {initial}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-950" />
        </div>
        <span className="text-sm text-gray-200 font-medium hidden sm:block">{data.username}</span>
        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl z-50 overflow-hidden">
          {/* Avatar + nombre */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-800">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg select-none">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{data.username}</p>
              <a
                href={`https://lichess.org/@/${data.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en Lichess ↗
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="px-4 py-3 space-y-2.5">
            {data.createdAt && (
              <Row label="Miembro desde" value={formatDate(data.createdAt)} />
            )}
            {data.seenAt && (
              <Row label="Última conexión" value={formatDate(data.seenAt)} />
            )}
            {data.playTime?.total > 0 && (
              <Row label="Tiempo jugado" value={formatPlayTime(data.playTime.total)} />
            )}
          </div>

          {/* Logout */}
          <div className="px-3 py-3 border-t border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setOpen(false); onLogout() }}
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-center"
            >
              Desconectar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
