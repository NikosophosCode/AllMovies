import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col transition-all duration-300" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Navbar />
      <main className="flex-1 px-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
