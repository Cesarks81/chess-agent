import { useEffect, useMemo } from 'react'
import './App.css'
import { useLichessAuth }    from './hooks/useLichessAuth'
import { useLichessUser }    from './hooks/useLichessUser'
import { useLichessGames }   from './hooks/useLichessGames'
import { SearchBar }         from './components/SearchBar'
import { HeaderProfile }     from './components/HeaderProfile'
import { RatingCard }        from './components/RatingCard'
import { StatsOverview }     from './components/StatsOverview'
import { EloChart }          from './components/EloChart'
import { ColorStats }        from './components/insights/ColorStats'
import { StreakCard }         from './components/insights/StreakCard'
import { DefeatReasons }     from './components/insights/DefeatReasons'
import { OpeningsTable }     from './components/insights/OpeningsTable'
import { RatingBuckets }     from './components/insights/RatingBuckets'
import {
  computeColorStats,
  computeOpenings,
  computeRatingBuckets,
  computeDefeatReasons,
  computeStreaks,
} from './utils/insights'

const DEFAULT_USER   = 'cesarks81'
const TOP_VARIANTS   = ['blitz', 'rapid', 'bullet']

export default function App() {
  const { token, logout } = useLichessAuth()
  const { data, loading, error, fetchUser } = useLichessUser(token)
  const { rawGames, username: gamesUser, loading: gamesLoading, error: gamesError, fetchAll, getChartData } =
    useLichessGames(token)

  const viewingOtherUser = data && data.username?.toLowerCase() !== DEFAULT_USER.toLowerCase()

  useEffect(() => {
    fetchUser(DEFAULT_USER)
    fetchAll(DEFAULT_USER)
  }, [fetchUser, fetchAll])

  function handleSearch(username) {
    fetchUser(username)
    fetchAll(username)
  }

  const insights = useMemo(() => {
    if (!rawGames.length || !gamesUser) return null
    return {
      color:    computeColorStats(rawGames, gamesUser),
      openings: computeOpenings(rawGames, gamesUser),
      buckets:  computeRatingBuckets(rawGames, gamesUser),
      defeats:  computeDefeatReasons(rawGames, gamesUser),
      streaks:  computeStreaks(rawGames, gamesUser),
    }
  }, [rawGames, gamesUser])

  // Blitz → Rapid → Bullet, en ese orden
  const topPerfs = TOP_VARIANTS
    .map(v => [v, data?.perfs?.[v]])
    .filter(([, p]) => p && p.games > 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">

        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center justify-between sm:flex-shrink-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Chess<span className="text-emerald-400">Agent</span>
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">Estadísticas de Lichess</p>
            </div>
            <div className="sm:hidden">
              <HeaderProfile data={data} onLogout={logout} />
            </div>
          </div>
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <HeaderProfile data={data} onLogout={logout} />
          </div>
        </header>

        {/* Errores */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {gamesError && !token && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm text-yellow-300">
            <span className="font-medium">Rate limit alcanzado.</span> Conecta tu cuenta de Lichess para cargar partidas sin límite.
          </div>
        )}
        {gamesError && token && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            Error cargando partidas: {gamesError}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 py-20">
            <div className="text-5xl mb-3 animate-pulse">♞</div>
            <p className="text-sm">Obteniendo perfil...</p>
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-5">

            {/* Aviso al buscar otro jugador */}
            {viewingOtherUser && (
              <div className="rounded-xl border border-gray-700 bg-gray-900 px-4 sm:px-5 py-3 text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Viendo estadísticas de <span className="text-white font-medium">{data.username}</span>.</span>
                <button
                  onClick={() => { fetchUser(DEFAULT_USER); fetchAll(DEFAULT_USER) }}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex-shrink-0 self-start sm:self-auto sm:ml-4"
                >
                  Volver a mi perfil
                </button>
              </div>
            )}

            {/* Layout principal: izquierda 66% | derecha 33% */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

              {/* Columna izquierda — 66% */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* Arriba izquierda: Blitz, Rapid, Bullet */}
                {topPerfs.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {topPerfs.map(([v, p]) => (
                      <RatingCard key={v} variant={v} perf={p} />
                    ))}
                  </div>
                )}

                {/* Abajo izquierda: ELO por partida */}
                <EloChart getChartData={getChartData} loading={gamesLoading} />
              </div>

              {/* Columna derecha — 33% */}
              <div className="lg:col-span-1 flex flex-col gap-4">

                {/* Arriba derecha: Rachas */}
                {insights && <StreakCard streaks={insights.streaks} />}

                {/* Medio derecha: Resumen de partidas */}
                <StatsOverview count={data.count} />

                {/* Abajo derecha: Rendimiento por color */}
                {insights && <ColorStats stats={insights.color} />}
              </div>
            </div>

            {/* Sección inferior: análisis profundo */}
            {insights && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <DefeatReasons reasons={insights.defeats} />
                  <RatingBuckets buckets={insights.buckets} />
                </div>
                <OpeningsTable openings={insights.openings} />
              </div>
            )}

          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center text-gray-600 py-20">
            <div className="text-5xl mb-3">♟</div>
            <p className="text-sm">Busca un usuario de Lichess</p>
          </div>
        )}

      </div>
    </div>
  )
}
