import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  dismissible?: boolean
  variant?: 'error' | 'warning' | 'info'
}

const ErrorMessage = ({
  message,
  onDismiss,
  dismissible = true,
  variant = 'error',
}: ErrorMessageProps) => {
  const [visible, setVisible] = useState(true)

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  const variantStyles = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-300',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-300',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-300',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex items-start gap-3 animate-slide-in-down`}
      role="alert"
    >
      <AlertTriangle className={`${styles.icon} shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        <p className={`${styles.text} font-medium`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`${styles.icon} hover:opacity-70 transition-opacity shrink-0`}
          aria-label="Cerrar mensaje"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
