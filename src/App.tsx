import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { MoviesProvider } from '@/context/MoviesContext'
import { AppRoutes } from './routes'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MoviesProvider>
            <AppRoutes />
          </MoviesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
