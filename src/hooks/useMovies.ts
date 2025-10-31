import { useContext } from 'react'
import { MoviesContext } from '@/context/MoviesContext'
import type { MoviesContextType } from '@/context/MoviesContext'

export const useMovies = (): MoviesContextType => {
  const context = useContext(MoviesContext)
  if (!context) {
    throw new Error('useMovies must be used within MoviesProvider')
  }
  return context
}
