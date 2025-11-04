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
      bg: 'var(--error-bg)',
      border: 'var(--error-border)',
      icon: 'var(--error-icon)',
      text: 'var(--error-fg)',
    },
    warning: {
      bg: 'var(--warning-bg)',
      border: 'var(--warning-border)',
      icon: 'var(--warning-icon)',
      text: 'var(--warning-fg)',
    },
    info: {
      bg: 'var(--info-bg)',
      border: 'var(--info-border)',
      icon: 'var(--info-icon)',
      text: 'var(--info-fg)',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className="rounded-lg p-4 flex items-start gap-3 animate-slide-in-down border"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border
      }}
      role="alert"
    >
      <AlertTriangle className="shrink-0 mt-0.5" size={20} style={{ color: styles.icon }} />
      <div className="flex-1">
        <p className="font-medium" style={{ color: styles.text }}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="hover:opacity-70 transition-opacity shrink-0"
          style={{ color: styles.icon }}
          aria-label="Cerrar mensaje"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
