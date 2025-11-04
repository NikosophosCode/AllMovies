import React, { createContext, useState, useCallback, useEffect } from 'react'
import type { User } from '@/types'
import { authService } from '@/services'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  sessionId: string | null
  login: (requestToken: string) => Promise<void>
  logout: () => void
  loading: boolean
  startAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('tmdb-user')
    return stored ? JSON.parse(stored) : null
  })
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem('tmdb-session-id')
  })
  const [loading, setLoading] = useState(false)

  // Cargar datos del usuario al iniciar si hay sesión
  useEffect(() => {
    const loadUser = async () => {
      if (sessionId && !user) {
        await loadUserDetails()
      }
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const loadUserDetails = async () => {
    if (!sessionId) return

    try {
      const accountDetails = await authService.getAccountDetails(sessionId)
      const userData: User = {
        id: accountDetails.id,
        username: accountDetails.username,
        name: accountDetails.name,
        email: '',
        avatar: {
          tmdb: accountDetails.avatar.tmdb,
          gravatar: accountDetails.avatar.gravatar
        }
      }
      setUser(userData)
      localStorage.setItem('tmdb-user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to load user details:', error)
      // Si falla, limpiar sesión
      logout()
    }
  }

  const startAuth = useCallback(async () => {
    setLoading(true)
    try {
      // Crear request token
      const requestToken = await authService.createRequestToken()
      // Redirigir a TMDB para autorización
      const authUrl = authService.getAuthorizationUrl(requestToken)
      window.location.href = authUrl
    } catch (error) {
      console.error('Failed to start auth:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (requestToken: string) => {
    setLoading(true)
    try {
      // Crear sesión con el token validado
      const session = await authService.createSession(requestToken)
      setSessionId(session.session_id)
      localStorage.setItem('tmdb-session-id', session.session_id)

      // Obtener detalles del usuario
      const accountDetails = await authService.getAccountDetails(session.session_id)
      const userData: User = {
        id: accountDetails.id,
        username: accountDetails.username,
        name: accountDetails.name,
        email: '',
        avatar: {
          tmdb: accountDetails.avatar.tmdb,
          gravatar: accountDetails.avatar.gravatar
        }
      }
      setUser(userData)
      localStorage.setItem('tmdb-user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    if (sessionId) {
      try {
        await authService.deleteSession(sessionId)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    setUser(null)
    setSessionId(null)
    localStorage.removeItem('tmdb-session-id')
    localStorage.removeItem('tmdb-user')
  }, [sessionId])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!sessionId,
        sessionId,
        login,
        logout,
        loading,
        startAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
