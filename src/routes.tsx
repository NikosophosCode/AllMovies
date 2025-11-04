import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/common/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Trending from '@/pages/Trending'

// Lazy loaded pages
const Movies = lazy(() => import('@/pages/Movies'))
const Series = lazy(() => import('@/pages/Series'))
const MovieDetail = lazy(() => import('@/pages/MovieDetail'))
const SeriesDetail = lazy(() => import('@/pages/SeriesDetail'))
const SeasonDetail = lazy(() => import('@/pages/SeasonDetail'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const TailwindTest = lazy(() => import('@/pages/TailwindTest'))

const Fallback = () => <LoadingSpinner fullScreen />

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/movies"
            element={
              <Suspense fallback={<Fallback />}>
                <Movies />
              </Suspense>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <Suspense fallback={<Fallback />}>
                <MovieDetail />
              </Suspense>
            }
          />
          <Route
            path="/series"
            element={
              <Suspense fallback={<Fallback />}>
                <Series />
              </Suspense>
            }
          />
          <Route
            path="/series/:id"
            element={
              <Suspense fallback={<Fallback />}>
                <SeriesDetail />
              </Suspense>
            }
          />
          <Route
            path="/series/:seriesId/season/:seasonNumber"
            element={
              <Suspense fallback={<Fallback />}>
                <SeasonDetail />
              </Suspense>
            }
          />
          <Route path="/search" element={<Search />} />
          <Route path="/trending" element={<Trending />} />
          <Route
            path="/favorites"
            element={
              <Suspense fallback={<Fallback />}>
                <Favorites />
              </Suspense>
            }
          />
          <Route
            path="/test"
            element={
              <Suspense fallback={<Fallback />}>
                <TailwindTest />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<Fallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
