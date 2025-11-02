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
    <div className={`${sizeClass} border-4 border-slate-700 dark:border-slate-800 border-t-red-600 rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm z-50">
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
