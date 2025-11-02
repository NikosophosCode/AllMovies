import { useEffect, useState } from 'react'
import MovieGrid from '@/components/movies/MovieGrid'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Movie } from '@/types'
import { movieService } from '@/services'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Parallax from '@/components/common/Parallax'

const Home = () => {
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [upcoming, trending] = await Promise.all([
          movieService.getUpcoming(),
          movieService.getTrending()
        ])
        setComingSoonMovies(upcoming.results.slice(0, 8))
        setTrendingMovies(trending.results.slice(0, 8))
      } catch (err) {
        setError('Error loading movies')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Hero Parallax */}
      <Parallax
        speed={0.25}
        className="py-24"
        background={
          <div className="absolute inset-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, #ef4444, transparent)' }} />
            <div className="absolute top-0 -right-24 rounded-full blur-3xl opacity-25" style={{ width: '28rem', height: '28rem', background: 'radial-gradient(closest-side, #6366f1, transparent)' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl opacity-20" style={{ width: '40rem', height: '40rem', background: 'radial-gradient(closest-side, #22d3ee, transparent)' }} />
          </div>
        }
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-red-600 font-semibold tracking-wider uppercase text-xs mb-3">Discover</span>
            <h1 className="text-4xl sm:text-6xl font-bold text-(--fg) animate-fade-in">AllMovies</h1>
            <p className="mt-4 text-lg text-(--fg-muted) animate-slide-in-up">
              Explore coming soon and trending titles with a clean, fast experience.
            </p>
          </div>
        </div>
      </Parallax>
      {/* Coming Soon Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--fg)">Coming soon</h2>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 rounded-full bg-(--card-bg) hover:bg-(--card-hover-bg) transition-colors backdrop-blur-sm">
              <ChevronLeft size={20} className="text-(--fg)" />
            </button>
            <button className="p-2 sm:p-3 rounded-full bg-(--card-bg) hover:bg-(--card-hover-bg) transition-colors backdrop-blur-sm">
              <ChevronRight size={20} className="text-(--fg)" />
            </button>
          </div>
        </div>
        <MovieGrid movies={comingSoonMovies} />
      </section>

      {/* Trending Movies Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--fg)">Trending Movies</h2>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 rounded-full bg-(--card-bg) hover:bg-(--card-hover-bg) transition-colors backdrop-blur-sm">
              <ChevronLeft size={20} className="text-(--fg)" />
            </button>
            <button className="p-2 sm:p-3 rounded-full bg-(--card-bg) hover:bg-(--card-hover-bg) transition-colors backdrop-blur-sm">
              <ChevronRight size={20} className="text-(--fg)" />
            </button>
          </div>
        </div>
        <MovieGrid movies={trendingMovies} />
      </section>
    </div>
  )
}

export default Home
