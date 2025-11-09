import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { genresService } from '@/services'
import type { Genre } from '@/types'
import './AdvancedFilters.css'

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void
  mediaType: 'movie' | 'tv'
  initialFilters?: FilterState
}

export interface FilterState {
  genres: number[]
  year: string
  sortBy: string
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidad (Mayor a Menor)' },
  { value: 'popularity.asc', label: 'Popularidad (Menor a Mayor)' },
  { value: 'vote_average.desc', label: 'Calificación (Mayor a Menor)' },
  { value: 'vote_average.asc', label: 'Calificación (Menor a Mayor)' },
  { value: 'primary_release_date.desc', label: 'Fecha de Estreno (Recientes)' },
  { value: 'primary_release_date.asc', label: 'Fecha de Estreno (Antiguas)' },
  { value: 'title.asc', label: 'Título (A-Z)' },
  { value: 'title.desc', label: 'Título (Z-A)' },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i)

/**
 * Componente de filtros avanzados para búsqueda de películas y series
 * - Filtro por género (multi-selección)
 * - Filtro por año
 * - Ordenamiento
 * - Variables CSS para theming
 */
const AdvancedFilters = ({ onFilterChange, mediaType, initialFilters }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialFilters?.genres || [])
  const [selectedYear, setSelectedYear] = useState(initialFilters?.year || '')
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'popularity.desc')

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = mediaType === 'movie' 
          ? await genresService.getMovieGenres()
          : await genresService.getTVGenres()
        setGenres(data)
      } catch (err) {
        console.error('Error al cargar géneros:', err)
      }
    }

    loadGenres()
  }, [mediaType])

  // Sincronizar estado interno cuando cambien los filtros iniciales
  useEffect(() => {
    if (initialFilters) {
      setSelectedGenres(initialFilters.genres || [])
      setSelectedYear(initialFilters.year || '')
      setSortBy(initialFilters.sortBy || 'popularity.desc')
    }
  }, [initialFilters])

  useEffect(() => {
    onFilterChange({
      genres: selectedGenres,
      year: selectedYear,
      sortBy,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, selectedYear, sortBy])

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedYear('')
    setSortBy('popularity.desc')
  }

  const hasActiveFilters = selectedGenres.length > 0 || selectedYear !== '' || sortBy !== 'popularity.desc'

  return (
    <div className="advanced-filters">
      {/* Botón toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`filters-toggle ${isOpen ? 'active' : ''}`}
      >
        <Filter size={20} />
        <span>Filtros Avanzados</span>
        {hasActiveFilters && (
          <span className="filters-badge">
            {selectedGenres.length + (selectedYear ? 1 : 0)}
          </span>
        )}
        <ChevronDown
          size={20}
          className={`filters-chevron ${isOpen ? 'rotate' : ''}`}
        />
      </button>

      {/* Panel de filtros */}
      {isOpen && (
        <div className="filters-panel">
          {/* Header con botón limpiar */}
          <div className="filters-header">
            <h3 className="filters-title">Filtrar Resultados</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="filters-clear">
                <X size={16} />
                Limpiar
              </button>
            )}
          </div>

          <div className="filters-content">
            {/* Ordenar por */}
            <div className="filter-group">
              <label className="filter-label">Ordenar Por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div className="filter-group">
              <label className="filter-label">
                Año {selectedYear && `(${selectedYear})`}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los años</option>
                {YEARS.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Géneros */}
            <div className="filter-group">
              <label className="filter-label">
                Géneros {selectedGenres.length > 0 && `(${selectedGenres.length})`}
              </label>
              <div className="genres-grid">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`genre-chip ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
