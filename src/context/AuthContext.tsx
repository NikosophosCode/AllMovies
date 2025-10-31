import React, { createContext, useState, useCallback } from 'react'
import type { User } from '@/types'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  sessionId: string | null
  login: (requestToken: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem('tmdb-session-id')
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (_requestToken: string) => {
    setLoading(true)
    try {
      // Llamar a servicio de autenticación
      // const session = await authService.createSession(_requestToken)
      // setSessionId(session.sessionId)
      // localStorage.setItem('tmdb-session-id', session.sessionId)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setSessionId(null)
    localStorage.removeItem('tmdb-session-id')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!sessionId,
        sessionId,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
