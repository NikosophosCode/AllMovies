import { describe, it, expect, vi, beforeEach } from 'vitest'
import { movieService } from '../movies'
import client from '../api/client'

vi.mock('../api/client')

describe('movieService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPopular', () => {
    it('should fetch popular movies', async () => {
      const mockResponse = {
        page: 1,
        results: [
          { id: 1, title: 'Test Movie 1' },
          { id: 2, title: 'Test Movie 2' },
        ],
        total_pages: 10,
        total_results: 100,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      const result = await movieService.getPopular()

      expect(result).toEqual(mockResponse)
      expect(client.get).toHaveBeenCalledWith(
        expect.stringContaining('/movie/popular'),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 1,
            language: 'es-ES',
          }),
        })
      )
    })

    it('should fetch popular movies with specific page', async () => {
      const mockResponse = {
        page: 2,
        results: [],
        total_pages: 10,
        total_results: 100,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      await movieService.getPopular(2)

      expect(client.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
          }),
        })
      )
    })
  })

  describe('getNowPlaying', () => {
    it('should fetch now playing movies', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Now Playing Movie' }],
        total_pages: 5,
        total_results: 50,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      const result = await movieService.getNowPlaying()

      expect(result).toEqual(mockResponse)
      expect(client.get).toHaveBeenCalled()
    })
  })

  describe('getTopRated', () => {
    it('should fetch top rated movies', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Top Rated Movie' }],
        total_pages: 5,
        total_results: 50,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      const result = await movieService.getTopRated()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getUpcoming', () => {
    it('should fetch upcoming movies', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Upcoming Movie' }],
        total_pages: 5,
        total_results: 50,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      const result = await movieService.getUpcoming()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getTrending', () => {
    it('should fetch trending movies by day', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Trending Movie' }],
        total_pages: 5,
        total_results: 50,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      const result = await movieService.getTrending('day')

      expect(result).toEqual(mockResponse)
      expect(client.get).toHaveBeenCalledWith(
        expect.stringContaining('/trending/movie/day'),
        expect.any(Object)
      )
    })

    it('should fetch trending movies by week', async () => {
      const mockResponse = {
        page: 1,
        results: [],
        total_pages: 5,
        total_results: 50,
      }

      vi.mocked(client.get).mockResolvedValue({ data: mockResponse })

      await movieService.getTrending('week')

      expect(client.get).toHaveBeenCalledWith(
        expect.stringContaining('/trending/movie/week'),
        expect.any(Object)
      )
    })
  })
})
