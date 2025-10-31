// Películas
export const MOVIE_ENDPOINTS = {
  NOW_PLAYING: '/movie/now_playing',
  POPULAR: '/movie/popular',
  TOP_RATED: '/movie/top_rated',
  UPCOMING: '/movie/upcoming',
  TRENDING: '/trending/movie/day',
  DETAIL: (id: number) => `/movie/${id}`,
  CREDITS: (id: number) => `/movie/${id}/credits`,
  VIDEOS: (id: number) => `/movie/${id}/videos`,
  RECOMMENDATIONS: (id: number) => `/movie/${id}/recommendations`,
}

// Series
export const TV_ENDPOINTS = {
  POPULAR: '/tv/popular',
  TOP_RATED: '/tv/top_rated',
  ON_THE_AIR: '/tv/on_the_air',
  TRENDING: '/trending/tv/day',
  DETAIL: (id: number) => `/tv/${id}`,
  SEASON: (id: number, season: number) => `/tv/${id}/season/${season}`,
  EPISODE: (id: number, season: number, episode: number) =>
    `/tv/${id}/season/${season}/episode/${episode}`,
  CREDITS: (id: number) => `/tv/${id}/credits`,
  VIDEOS: (id: number) => `/tv/${id}/videos`,
  RECOMMENDATIONS: (id: number) => `/tv/${id}/recommendations`,
}

// Búsqueda
export const SEARCH_ENDPOINTS = {
  MULTI: '/search/multi',
  MOVIE: '/search/movie',
  TV: '/search/tv',
  PERSON: '/search/person',
}

// Géneros
export const GENRE_ENDPOINTS = {
  MOVIES: '/genre/movie/list',
  TV: '/genre/tv/list',
}

// Tendencias
export const TRENDING_ENDPOINTS = {
  MOVIE_DAY: '/trending/movie/day',
  MOVIE_WEEK: '/trending/movie/week',
  TV_DAY: '/trending/tv/day',
  TV_WEEK: '/trending/tv/week',
}
