import type { AdminSession } from './types'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'Plmplmplm1201'
const SESSION_KEY = 'genevemap_admin_session'

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const session: AdminSession = {
      authenticated: true,
      loginTime: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session: AdminSession = JSON.parse(raw)
    // Expire after 24h
    const loginTime = new Date(session.loginTime).getTime()
    if (Date.now() - loginTime > 24 * 60 * 60 * 1000) {
      logout()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession()?.authenticated === true
}
