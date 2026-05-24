import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

export function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar usuario de Lichess..."
        disabled={loading}
        className="flex-1"
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? '...' : 'Buscar'}
      </Button>
    </form>
  )
}
