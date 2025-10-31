import type { PaginatedResponse } from './api'

export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  language: string
  genres: Genre[]
  runtime?: number
  budget?: number
  revenue?: number
  imdb_id?: string
  status?: string
  tagline?: string
  videos?: Video[]
  credits?: Credits
  recommendations?: PaginatedResponse<Movie>
}

export interface MovieListResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Video {
  id: string
  name: string
  key: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Genre {
  id: number
  name: string
}

export interface MovieFilter {
  sortBy?: string
  genreIds?: number[]
  year?: number
  minRating?: number
  page?: number
}
