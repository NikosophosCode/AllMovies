import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export default function SearchBar({ 
  placeholder = 'Busca películas y series...', 
  autoFocus = false,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" 
          size={24} 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:border-primary-500 transition-colors text-lg"
        />
      </div>
    </form>
  )
}
