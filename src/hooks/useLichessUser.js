import { useState, useCallback } from 'react'

function authHeaders(token) {
  const headers = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export function useLichessUser(token) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchUser = useCallback(async (username) => {
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`https://lichess.org/api/user/${username.trim()}`, {
        headers: authHeaders(token),
      })
      if (res.status === 404) throw new Error('Usuario no encontrado en Lichess')
      if (!res.ok) throw new Error(`Error ${res.status}: no se pudo obtener el perfil`)
      setData(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  return { data, loading, error, fetchUser }
}
