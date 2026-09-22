import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('codepath_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await client.post('/auth/login', { email, password })
      localStorage.setItem('codepath_token', data.token)
      localStorage.setItem('codepath_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch (err) {
      // If server explicitly rejected password or input (400, 401, 409), rethrow error to show in UI
      if (err.response && (err.response.status === 400 || err.response.status === 401 || err.response.status === 409)) {
        throw err
      }
      // If backend is offline / unreachable (e.g. static GitHub Pages host or local server not running):
      // Log in with a clean student session so users are never blocked
      const fallbackName = email.split('@')[0] || 'Learner'
      const demoUser = {
        id: 'user-' + Date.now(),
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
        email: email,
        isOfflineMode: true,
      }
      localStorage.setItem('codepath_token', 'offline_session_token')
      localStorage.setItem('codepath_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return demoUser
    }
  }

  const signup = async (name, email, password) => {
    try {
      const { data } = await client.post('/auth/signup', { name, email, password })
      localStorage.setItem('codepath_token', data.token)
      localStorage.setItem('codepath_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 401 || err.response.status === 409)) {
        throw err
      }
      const demoUser = {
        id: 'user-' + Date.now(),
        name: name || 'Learner',
        email: email,
        isOfflineMode: true,
      }
      localStorage.setItem('codepath_token', 'offline_session_token')
      localStorage.setItem('codepath_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return demoUser
    }
  }

  const logout = () => {
    localStorage.removeItem('codepath_token')
    localStorage.removeItem('codepath_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
