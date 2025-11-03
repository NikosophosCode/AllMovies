interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size]

  const content = (
    <div className="relative">
      <div className={`${sizeClass} border-4 rounded-full animate-spin glow`} style={{ borderColor: 'var(--border)', borderTopColor: '#ef4444' }} />
      {/* Efecto de brillo adicional */}
      <div className={`${sizeClass} border-4 rounded-full animate-spin absolute inset-0 opacity-50 blur-sm`} style={{ borderColor: 'transparent', borderTopColor: '#ef4444' }} />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center blur-overlay z-50" style={{ backgroundColor: 'var(--overlay)' }}>
        {content}
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-12">
      {content}
    </div>
  )
}

export default LoadingSpinner
