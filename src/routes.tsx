import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/common/Layout'
import Home from '@/pages/Home'
import Movies from '@/pages/Movies'
import Series from '@/pages/Series'
import Search from '@/pages/Search'
import Trending from '@/pages/Trending'
import NotFound from '@/pages/NotFound'
import TailwindTest from '@/pages/TailwindTest'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/test" element={<TailwindTest />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
