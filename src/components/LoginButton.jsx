import { Button } from './ui/Button'

export function LoginButton({ token, onLogout, onRestore }) {
  if (token) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Lichess conectado
        </span>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={onRestore}>
      Reconectar
    </Button>
  )
}
