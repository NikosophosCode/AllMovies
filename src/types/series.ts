import type { PaginatedResponse } from './api'
import type { Video, Credits, Genre } from './movie'

export interface Series {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  genres: Genre[]
  number_of_seasons?: number
  number_of_episodes?: number
  seasons?: Season[]
  networks?: Network[]
  status?: string
  type?: string
  tagline?: string
  videos?: {
    results: Video[]
  }
  credits?: Credits
  recommendations?: PaginatedResponse<Series>
}

export interface SeriesListResponse {
  page: number
  results: Series[]
  total_pages: number
  total_results: number
}

export interface Season {
  id: number
  name: string
  overview: string
  season_number: number
  air_date: string
  poster_path: string | null
  episodes?: Episode[]
}

export interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  air_date: string
  runtime: number
  still_path: string | null
  vote_average: number
}

export interface Network {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface SeriesFilter {
  sortBy?: string
  genreIds?: number[]
  year?: number
  minRating?: number
  page?: number
}
