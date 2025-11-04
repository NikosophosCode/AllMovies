import type { Series } from '@/types'
import SeriesCard from '../SeriesCard'

interface SeriesGridProps {
  series: Series[]
}

const SeriesGrid = ({ series }: SeriesGridProps) => {
  if (!series || series.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--fg-muted)' }}>No se encontraron series</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {series.map((item) => (
        <SeriesCard key={item.id} series={item} />
      ))}
    </div>
  )
}

export default SeriesGrid
