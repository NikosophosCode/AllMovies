import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { useAuth } from '@/hooks'

/**
 * Página de callback para autenticación TMDB
 * Procesa el token validado y crea la sesión
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const requestToken = searchParams.get('request_token')
      const approved = searchParams.get('approved')

      // Verificar que el token fue aprobado
      if (!requestToken || approved !== 'true') {
        setStatus('error')
        setErrorMessage('Autenticación cancelada o token inválido')
        setTimeout(() => navigate('/'), 3000)
        return
      }

      try {
        // Crear sesión con el token validado
        await login(requestToken)
        setStatus('success')
        
        // Redirigir al home después de 2 segundos
        setTimeout(() => navigate('/'), 2000)
      } catch (error) {
        console.error('Error during authentication:', error)
        setStatus('error')
        setErrorMessage('Error al iniciar sesión. Por favor, intenta de nuevo.')
        setTimeout(() => navigate('/'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="max-w-md w-full p-8 rounded-lg text-center animate-fade-in"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)'
        }}
      >
        {status === 'loading' && (
          <>
            <Loader 
              size={64} 
              className="mx-auto mb-4 animate-spin" 
              style={{ color: 'var(--accent)' }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
              Procesando autenticación...
            </h2>
            <p style={{ color: 'var(--fg-muted)' }}>
              Por favor espera mientras verificamos tus credenciales
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle 
              size={64} 
              className="mx-auto mb-4" 
              style={{ color: '#10b981' }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
              ¡Autenticación exitosa!
            </h2>
            <p style={{ color: 'var(--fg-muted)' }}>
              Redirigiendo a la página principal...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle 
              size={64} 
              className="mx-auto mb-4" 
              style={{ color: 'var(--accent)' }}
            />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
              Error de autenticación
            </h2>
            <p className="mb-4" style={{ color: 'var(--fg-muted)' }}>
              {errorMessage}
            </p>
            <p className="text-sm" style={{ color: 'var(--fg-soft)' }}>
              Serás redirigido al inicio en unos segundos...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
