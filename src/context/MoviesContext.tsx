import React, { createContext, useState, useCallback } from 'react'
import type { Favorite, WatchlistItem } from '@/types'

export interface MoviesContextType {
  favorites: Favorite[]
  watchlist: WatchlistItem[]
  addFavorite: (mediaType: 'movie' | 'tv', mediaId: number) => void
  removeFavorite: (mediaType: 'movie' | 'tv', mediaId: number) => void
  addToWatchlist: (mediaType: 'movie' | 'tv', mediaId: number) => void
  removeFromWatchlist: (mediaType: 'movie' | 'tv', mediaId: number) => void
  isFavorite: (mediaType: 'movie' | 'tv', mediaId: number) => boolean
  isInWatchlist: (mediaType: 'movie' | 'tv', mediaId: number) => boolean
}

export const MoviesContext = createContext<MoviesContextType | undefined>(undefined)

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('watchlist')
    return saved ? JSON.parse(saved) : []
  })

  const addFavorite = useCallback((mediaType: 'movie' | 'tv', mediaId: number) => {
    setFavorites((prev) => {
      const updated = [
        ...prev,
        { mediaType, mediaId, addedAt: new Date().toISOString() },
      ]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((mediaType: 'movie' | 'tv', mediaId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => !(fav.mediaType === mediaType && fav.mediaId === mediaId))
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addToWatchlist = useCallback((mediaType: 'movie' | 'tv', mediaId: number) => {
    setWatchlist((prev) => {
      const updated = [
        ...prev,
        { mediaType, mediaId, addedAt: new Date().toISOString() },
      ]
      localStorage.setItem('watchlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromWatchlist = useCallback((mediaType: 'movie' | 'tv', mediaId: number) => {
    setWatchlist((prev) => {
      const updated = prev.filter(
        (item) => !(item.mediaType === mediaType && item.mediaId === mediaId)
      )
      localStorage.setItem('watchlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback(
    (mediaType: 'movie' | 'tv', mediaId: number) => {
      return favorites.some((fav) => fav.mediaType === mediaType && fav.mediaId === mediaId)
    },
    [favorites]
  )

  const isInWatchlist = useCallback(
    (mediaType: 'movie' | 'tv', mediaId: number) => {
      return watchlist.some((item) => item.mediaType === mediaType && item.mediaId === mediaId)
    },
    [watchlist]
  )

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        watchlist,
        addFavorite,
        removeFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isFavorite,
        isInWatchlist,
      }}
    >
      {children}
    </MoviesContext.Provider>
  )
}
