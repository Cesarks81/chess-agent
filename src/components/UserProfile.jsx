import { Card, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

function formatPlayTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatDate(ms) {
  return new Date(ms).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Meta({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-300">{value}</span>
    </div>
  )
}

export function UserProfile({ data }) {
  const { username, verified, patron, profile, createdAt, seenAt, playTime } = data

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl select-none">
            ♟
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white">{username}</h2>
              {verified && <Badge variant="blue">Verificado</Badge>}
              {patron && <Badge variant="purple">Patron</Badge>}
            </div>

            {profile?.bio && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-3">
              {createdAt && <Meta label="Miembro desde" value={formatDate(createdAt)} />}
              {seenAt && <Meta label="Última conexión" value={formatDate(seenAt)} />}
              {playTime?.total > 0 && (
                <Meta label="Tiempo jugado" value={formatPlayTime(playTime.total)} />
              )}
            </div>
          </div>

          <Button
            as="a"
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://lichess.org/@/${username}`, '_blank')}
          >
            Ver en Lichess ↗
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
