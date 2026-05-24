import { useState } from 'react'
import { getStoredToken, setToken, clearStoredToken } from '../auth/lichessOAuth'

const PERSONAL_TOKEN = import.meta.env.VITE_LICHESS_TOKEN ?? null

if (PERSONAL_TOKEN && !getStoredToken()) {
  setToken(PERSONAL_TOKEN)
}

export function useLichessAuth() {
  const [token, setTokenState] = useState(getStoredToken)

  function logout() {
    clearStoredToken()
    setTokenState(null)
  }

  function restoreToken() {
    if (!PERSONAL_TOKEN) return
    setToken(PERSONAL_TOKEN)
    setTokenState(PERSONAL_TOKEN)
  }

  return { token, logout, restoreToken }
}
