import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-4">Página no encontrada</p>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        La página que buscas no existe.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
