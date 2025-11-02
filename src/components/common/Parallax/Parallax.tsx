import React, { useEffect, useRef } from 'react'

interface ParallaxProps {
  speed?: number // 0.0 - 1.0 (más alto = se mueve más)
  className?: string
  background?: React.ReactNode // capa de fondo (gradientes, shapes)
  children?: React.ReactNode
}

const Parallax: React.FC<ParallaxProps> = ({ speed = 0.3, className = '', background, children }) => {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = layerRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const offset = window.scrollY * speed
        el.style.transform = `translate3d(0, ${offset}px, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [speed])

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Capa de fondo con parallax */}
      <div ref={layerRef} className="absolute inset-0 parallax-layer will-change-transform">
        {background}
      </div>

      {/* Contenido encima */}
      <div className="relative">
        {children}
      </div>
    </section>
  )
}

export default Parallax
