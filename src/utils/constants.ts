export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const POSTER_SIZES = {
  SMALL: `${TMDB_IMAGE_BASE_URL}/w154`,
  MEDIUM: `${TMDB_IMAGE_BASE_URL}/w342`,
  LARGE: `${TMDB_IMAGE_BASE_URL}/w500`,
}

export const BACKDROP_SIZES = {
  SMALL: `${TMDB_IMAGE_BASE_URL}/w300`,
  MEDIUM: `${TMDB_IMAGE_BASE_URL}/w780`,
  LARGE: `${TMDB_IMAGE_BASE_URL}/w1280`,
}

export const GENRES = {
  MOVIE: {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animación',
    35: 'Comedia',
    80: 'Crimen',
    99: 'Documental',
    18: 'Drama',
    10751: 'Familia',
    14: 'Fantasía',
    36: 'Historia',
    27: 'Horror',
    10402: 'Música',
    9648: 'Misterio',
    10749: 'Romance',
    878: 'Ciencia Ficción',
    10770: 'Película de TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Western',
  },
  TV: {
    10759: 'Action & Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    10762: 'Kids',
    9648: 'Mystery',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics',
    37: 'Western',
  },
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY || '',
  READ_ACCESS_TOKEN: import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || '',
  IMAGE_BASE_URL: TMDB_IMAGE_BASE_URL,
}

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'All-Movies',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Explore movies and TV series',
  ENABLE_RATINGS: import.meta.env.VITE_ENABLE_RATINGS === 'true',
  ENABLE_WATCHLIST: import.meta.env.VITE_ENABLE_WATCHLIST === 'true',
  ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
}

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  INITIAL_PAGE: 1,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'all-movies-theme',
  FAVORITES: 'all-movies-favorites',
  WATCHLIST: 'all-movies-watchlist',
  USER_SESSION: 'all-movies-session',
  LANGUAGE: 'all-movies-language',
}

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  SERIES: '/series',
  MOVIE_DETAIL: '/movie/:id',
  SERIES_DETAIL: '/series/:id',
  SEARCH: '/search',
  TRENDING: '/trending',
  TOP_RATED: '/top-rated',
  CATEGORIES: '/categories',
  FAVORITES: '/favorites',
  WATCHLIST: '/watchlist',
  MY_LISTS: '/my-lists',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const
