export interface User {
  id: number
  username: string
  name?: string
  avatar?: {
    gravatar?: {
      hash: string
    }
  }
  iso_639_1?: string
  iso_3166_1?: string
}

export interface AuthSession {
  sessionId: string
  requestToken?: string
  username?: string
  userId?: number
  expiresAt: string
}

export interface Favorite {
  mediaType: 'movie' | 'tv'
  mediaId: number
  addedAt: string
}

export interface WatchlistItem {
  mediaType: 'movie' | 'tv'
  mediaId: number
  addedAt: string
}

export interface UserList {
  id: number
  name: string
  description: string
  itemCount: number
  items: WatchlistItem[]
  createdAt: string
  updatedAt: string
}
