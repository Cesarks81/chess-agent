const KEY_TOKEN = 'lichess_token'

export function getStoredToken() {
  return localStorage.getItem(KEY_TOKEN) ?? null
}

export function setToken(token) {
  localStorage.setItem(KEY_TOKEN, token)
}

export function clearStoredToken() {
  localStorage.removeItem(KEY_TOKEN)
}
