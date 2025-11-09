import { useState, useCallback, useEffect } from 'react'
import type { FilterState } from '@/components/common'

const STORAGE_PREFIX = 'filters_'

/**
 * Hook para manejar la persistencia de filtros en localStorage
 * Guarda y recupera los filtros automáticamente por tipo de medio
 */
export const useFilters = (mediaType: 'movie' | 'tv') => {
  const storageKey = `${STORAGE_PREFIX}${mediaType}`
  
  const getInitialFilters = (): FilterState => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading filters from localStorage:', error)
    }
    
    return {
      genres: [],
      year: '',
      sortBy: 'popularity.desc',
    }
  }

  const [filters, setFiltersState] = useState<FilterState>(getInitialFilters)

  // Guardar en localStorage cada vez que cambien los filtros
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters))
    } catch (error) {
      console.error('Error saving filters to localStorage:', error)
    }
  }, [filters, storageKey])

  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      genres: [],
      year: '',
      sortBy: 'popularity.desc',
    }
    setFiltersState(defaultFilters)
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing filters from localStorage:', error)
    }
  }, [storageKey])

  return {
    filters,
    setFilters,
    clearFilters,
  }
}
