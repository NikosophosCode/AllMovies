import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSlide from './HeroSlide'
import type { Movie } from '@/types'

interface HeroSliderProps {
  movies: Movie[]
  autoPlayInterval?: number
}

const HeroSlider = ({ movies, autoPlayInterval = 5000 }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const timeoutRef = useRef<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const slidesCount = movies.length

  // Navigate to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesCount)
  }, [slidesCount])

  // Navigate to previous slide
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slidesCount) % slidesCount)
  }, [slidesCount])

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slidesCount <= 1) return

    timeoutRef.current = window.setTimeout(() => {
      goToNext()
    }, autoPlayInterval)

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, isAutoPlaying, autoPlayInterval, goToNext, slidesCount])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
        setIsAutoPlaying(false)
      } else if (e.key === 'ArrowRight') {
        goToNext()
        setIsAutoPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  // Touch/Swipe support for mobile
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      goToNext()
      setIsAutoPlaying(false)
    }

    if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      goToPrevious()
      setIsAutoPlaying(false)
    }
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero Slider"
      aria-live="polite"
    >
      {/* Slides */}
      {movies.map((movie, index) => (
        <HeroSlide
          key={movie.id}
          movie={movie}
          isActive={index === currentIndex}
          priority={index === 0 || index === 1}
        />
      ))}

      {/* Navigation Arrows */}
      {slidesCount > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={() => {
              goToPrevious()
              setIsAutoPlaying(false)
            }}
            className="absolute left-4 sm:left-8 top-1/3 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Next Button */}
          <button
            onClick={() => {
              goToNext()
              setIsAutoPlaying(false)
            }}
            className="absolute right-4 sm:right-8 top-1/3 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {slidesCount > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index)
                setIsAutoPlaying(false)
              }}
              className={`group relative transition-all duration-300 focus:outline-none ${
                index === currentIndex ? 'w-8 sm:w-12' : 'w-2 sm:w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            >
              {/* Background bar */}
              <div
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/40 group-hover:bg-white/60'
                }`}
              />
              
              {/* Progress bar for active slide */}
              {index === currentIndex && isAutoPlaying && (
                <div
                  className="absolute top-0 left-0 h-full bg-red-600 rounded-full origin-left"
                  style={{
                    animation: `progress ${autoPlayInterval}ms linear`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {slidesCount > 1 && (
        <div className="absolute top-6 right-6 z-20 hidden sm:block">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isAutoPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
        </div>
      )}
    </div>
  )
}

export default HeroSlider
