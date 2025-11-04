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
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--input-placeholder)' }}
          size={24} 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-lg"
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--input-fg)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--input-border-focus)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
        />
      </div>
    </form>
  )
}
