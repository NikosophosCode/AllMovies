// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY || '',
  READ_ACCESS_TOKEN: import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || '',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    POSTER: {
      SMALL: 'w154',
      MEDIUM: 'w342',
      LARGE: 'w500',
      ORIGINAL: 'original',
    },
    BACKDROP: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      ORIGINAL: 'original',
    },
    PROFILE: {
      SMALL: 'w45',
      MEDIUM: 'w185',
      LARGE: 'h632',
      ORIGINAL: 'original',
    },
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'All-Movies',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Explore movies and TV series',
  ENABLE_RATINGS: import.meta.env.VITE_ENABLE_RATINGS === 'true',
  ENABLE_WATCHLIST: import.meta.env.VITE_ENABLE_WATCHLIST === 'true',
  ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
};

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  INITIAL_PAGE: 1,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'all-movies-theme',
  FAVORITES: 'all-movies-favorites',
  WATCHLIST: 'all-movies-watchlist',
  USER_SESSION: 'all-movies-session',
  LANGUAGE: 'all-movies-language',
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

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
} as const;
