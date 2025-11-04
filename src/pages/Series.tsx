import { useEffect, useState } from 'react'
import { Tv } from 'lucide-react'
import SeriesGrid from '@/components/series/SeriesGrid'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Series } from '@/types'
import { seriesService } from '@/services'

export default function Series() {
  const [popularSeries, setPopularSeries] = useState<Series[]>([])
  const [topRatedSeries, setTopRatedSeries] = useState<Series[]>([])
  const [onTheAirSeries, setOnTheAirSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'popular' | 'top_rated' | 'on_the_air'>('popular')

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true)
        const [popular, topRated, onTheAir] = await Promise.all([
          seriesService.getPopular(),
          seriesService.getTopRated(),
          seriesService.getOnTheAir(),
        ])
        setPopularSeries(popular.results)
        setTopRatedSeries(topRated.results)
        setOnTheAirSeries(onTheAir.results)
      } catch (err) {
        setError('Error al cargar las series')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  const getCurrentSeries = () => {
    switch (activeTab) {
      case 'popular':
        return popularSeries
      case 'top_rated':
        return topRatedSeries
      case 'on_the_air':
        return onTheAirSeries
      default:
        return popularSeries
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="m-12">
        <div className="flex items-center gap-3 mb-4">
          <Tv size={32} className="text-primary-500" />
          <h1 className="text-4xl md:text-5xl font-bold">Series de TV</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Descubre las mejores series de televisión
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'popular'
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          Populares
        </button>
        <button
          onClick={() => setActiveTab('top_rated')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'top_rated'
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          Mejor Valoradas
        </button>
        <button
          onClick={() => setActiveTab('on_the_air')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'on_the_air'
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          En Emisión
        </button>
      </div>

      {/* Series Grid */}
      <SeriesGrid series={getCurrentSeries()} />
    </div>
  )
}
