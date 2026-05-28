import { useMemo, useState } from 'react'
import { loginRequest, logoutRequest } from '../services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('astro_satguru_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('astro_satguru_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    setLoading(true)
    try {
      const data = await loginRequest(credentials)
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('astro_satguru_token', data.token)
      localStorage.setItem('astro_satguru_user', JSON.stringify(data.user))
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('astro_satguru_token')
      localStorage.removeItem('astro_satguru_user')
    }
  }

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), token, user, loading, login, logout }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
