import type { ReactNode } from 'react'

interface HeroSectionProps {
  children: ReactNode
  className?: string
}

/**
 * Componente Hero optimizado para LCP
 * - Sin efectos de parallax que causan reflows
 * - Layout estable
 * - Optimizado para Core Web Vitals
 */
const HeroSection = ({ children, className = '' }: HeroSectionProps) => {
  return (
    <section 
      className={`relative py-12 md:py-20 ${className}`}
      style={{
        // Altura mínima fija para prevenir layout shifts
        minHeight: '400px',
      }}
    >
      {/* Background decorativo - Sin parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Blur shapes optimizados - Transformaciones CSS puras */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 will-change-transform" 
          style={{ 
            background: 'radial-gradient(closest-side, #ef4444, transparent)',
            filter: 'blur(60px)',
            transform: 'translate3d(0, 0, 0)', // GPU acceleration
          }} 
        />
        <div 
          className="absolute top-0 -right-24 w-96 h-96 rounded-full opacity-20 will-change-transform" 
          style={{ 
            background: 'radial-gradient(closest-side, #6366f1, transparent)',
            filter: 'blur(60px)',
            transform: 'translate3d(0, 0, 0)', // GPU acceleration
          }} 
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

export default HeroSection
