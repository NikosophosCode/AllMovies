import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MovieCard from '@components/movies/MovieCard/MovieCard'
import type { Movie } from '@/types'

// Mock de los hooks
vi.mock('@/hooks', () => ({
  useMovies: () => ({
    isFavorite: vi.fn(() => false),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
  usePrefetch: () => ({
    prefetchMovie: vi.fn(),
  }),
}))

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 100,
  popularity: 50,
  language: 'en',
  genres: [],
}

const renderMovieCard = (movie = mockMovie, onClick?: () => void) => {
  return render(
    <BrowserRouter>
      <MovieCard movie={movie} onClick={onClick} />
    </BrowserRouter>
  )
}

describe('MovieCard', () => {
  it('should render movie card with title', () => {
    renderMovieCard()
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('should render movie rating', () => {
    renderMovieCard()
    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('should render link to movie detail page', () => {
    renderMovieCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/movies/1')
  })

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    renderMovieCard(mockMovie, onClick)

    const card = screen.getByText('Test Movie').closest('div')
    if (card) {
      await user.click(card)
      expect(onClick).toHaveBeenCalled()
    }
  })

  it('should render movie with zero rating', () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 }
    renderMovieCard(movieWithZeroRating)
    expect(screen.getByText('0.0')).toBeInTheDocument()
  })

  it('should render movie without poster', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    renderMovieCard(movieWithoutPoster)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })
})
