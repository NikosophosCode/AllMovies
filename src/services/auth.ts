import client from './api/client'

export interface SessionResponse {
  success: boolean
  session_id: string
}

export interface AccountDetails {
  id: number
  name: string
  username: string
  avatar: {
    gravatar: {
      hash: string
    }
    tmdb: {
      avatar_path: string | null
    }
  }
  iso_639_1: string
  iso_3166_1: string
  include_adult: boolean
}

export interface FavoriteWatchlistResponse {
  success: boolean
  status_code: number
  status_message: string
}

export interface UserList {
  id: number
  name: string
  description: string
  item_count: number
  iso_639_1: string
  list_type: string
  poster_path: string | null
}

export const authService = {
  /**
   * Paso 1: Crear un request token
   */
  async createRequestToken(): Promise<string> {
    const { data } = await client.get('/authentication/token/new')
    return data.request_token
  },

  /**
   * Paso 2: Redirigir usuario para autenticar
   */
  getAuthorizationUrl(requestToken: string): string {
    return `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.origin}/auth/callback`
  },

  /**
   * Paso 3: Crear sesión con request token validado
   */
  async createSession(requestToken: string): Promise<SessionResponse> {
    const { data } = await client.post('/authentication/session/new', {
      request_token: requestToken,
    })
    return data
  },

  /**
   * Obtener datos del usuario autenticado
   */
  async getAccountDetails(sessionId: string): Promise<AccountDetails> {
    const { data } = await client.get('/account', {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Añadir o quitar de favoritos
   */
  async toggleFavorite(
    accountId: number,
    sessionId: string,
    mediaType: 'movie' | 'tv',
    mediaId: number,
    favorite: boolean
  ): Promise<FavoriteWatchlistResponse> {
    const { data } = await client.post(
      `/account/${accountId}/favorite`,
      {
        media_type: mediaType,
        media_id: mediaId,
        favorite,
      },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Obtener favoritos (películas)
   */
  async getFavoriteMovies(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/favorite/movies`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener favoritos (series)
   */
  async getFavoriteTVShows(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/favorite/tv`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Añadir o quitar de watchlist
   */
  async toggleWatchlist(
    accountId: number,
    sessionId: string,
    mediaType: 'movie' | 'tv',
    mediaId: number,
    watchlist: boolean
  ): Promise<FavoriteWatchlistResponse> {
    const { data } = await client.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: mediaType,
        media_id: mediaId,
        watchlist,
      },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Obtener watchlist (películas)
   */
  async getWatchlistMovies(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/watchlist/movies`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener watchlist (series)
   */
  async getWatchlistTVShows(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/watchlist/tv`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Crear lista personalizada
   */
  async createList(sessionId: string, name: string, description = '') {
    const { data } = await client.post(
      '/list',
      {
        name,
        description,
        language: 'es-ES',
      },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Obtener listas del usuario
   */
  async getUserLists(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/lists`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener detalles de una lista
   */
  async getListDetails(listId: number) {
    const { data } = await client.get(`/list/${listId}`, {
      params: { language: 'es-ES' },
    })
    return data
  },

  /**
   * Añadir película a lista
   */
  async addToList(listId: number, sessionId: string, mediaId: number) {
    const { data } = await client.post(
      `/list/${listId}/add_item`,
      { media_id: mediaId },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Eliminar película de lista
   */
  async removeFromList(listId: number, sessionId: string, mediaId: number) {
    const { data } = await client.post(
      `/list/${listId}/remove_item`,
      { media_id: mediaId },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Eliminar lista
   */
  async deleteList(listId: number, sessionId: string) {
    const { data } = await client.delete(`/list/${listId}`, {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Calificar película
   */
  async rateMovie(
    movieId: number,
    sessionId: string,
    rating: number
  ): Promise<FavoriteWatchlistResponse> {
    const { data } = await client.post(
      `/movie/${movieId}/rating`,
      { value: rating },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Obtener estado de la cuenta para una película (incluye rating del usuario)
   */
  async getMovieAccountStates(movieId: number, sessionId: string) {
    const { data } = await client.get(`/movie/${movieId}/account_states`, {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Eliminar calificación de película
   */
  async deleteMovieRating(movieId: number, sessionId: string) {
    const { data } = await client.delete(`/movie/${movieId}/rating`, {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Calificar serie
   */
  async rateTVShow(
    tvId: number,
    sessionId: string,
    rating: number
  ): Promise<FavoriteWatchlistResponse> {
    const { data } = await client.post(
      `/tv/${tvId}/rating`,
      { value: rating },
      { params: { session_id: sessionId } }
    )
    return data
  },

  /**
   * Obtener estado de la cuenta para una serie (incluye rating del usuario)
   */
  async getTVAccountStates(tvId: number, sessionId: string) {
    const { data } = await client.get(`/tv/${tvId}/account_states`, {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Eliminar calificación de serie
   */
  async deleteTVRating(tvId: number, sessionId: string) {
    const { data } = await client.delete(`/tv/${tvId}/rating`, {
      params: { session_id: sessionId },
    })
    return data
  },

  /**
   * Obtener calificaciones del usuario (películas)
   */
  async getRatedMovies(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/rated/movies`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener calificaciones del usuario (series)
   */
  async getRatedTVShows(accountId: number, sessionId: string, page = 1) {
    const { data } = await client.get(`/account/${accountId}/rated/tv`, {
      params: { session_id: sessionId, page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Eliminar sesión (logout)
   */
  async deleteSession(sessionId: string) {
    const { data } = await client.delete('/authentication/session', {
      data: { session_id: sessionId },
    })
    return data
  },
}
