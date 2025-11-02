import { useEffect, useState } from 'react'

export default function TailwindTest() {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    console.log('=== TAILWIND DEBUG ===')
    console.log('HTML classList:', document.documentElement.classList.toString())
    console.log('Computed styles on body:', window.getComputedStyle(document.body).backgroundColor)
    
    // Verificar si hay errores en la consola
    console.log('Body background:', window.getComputedStyle(document.body).backgroundColor)
    
    // Verificar estado inicial
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const handleToggle = () => {
    console.log('🔘 Botón clickeado!')
    const html = document.documentElement
    const hadDark = html.classList.contains('dark')
    
    if (hadDark) {
      html.classList.remove('dark')
      setIsDark(false)
      console.log('☀️ Cambiado a modo CLARO')
    } else {
      html.classList.add('dark')
      setIsDark(true)
      console.log('🌙 Cambiado a modo OSCURO')
    }
    
    console.log('Classes actuales:', html.classList.toString())
    
    // Forzar re-render
    setTimeout(() => {
      console.log('Body background después:', window.getComputedStyle(document.body).backgroundColor)
    }, 100)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold text-red-500">TailwindCSS Test</h1>
      
      <div className="p-4 bg-yellow-400 text-black font-bold">
        Modo actual: {isDark ? '🌙 OSCURO' : '☀️ CLARO'}
      </div>
      
      {/* Test de colores básicos */}
      <div className="p-4 bg-blue-500 text-white">
        Si ves esto en AZUL con texto BLANCO, Tailwind funciona
      </div>
      
      {/* Test de dark mode */}
      <div className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700">
        En modo claro: fondo blanco, texto negro
        <br />
        En modo oscuro: fondo gris oscuro, texto blanco
      </div>
      
      {/* Test de padding responsive */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-green-500 text-white">
        Padding responsivo: 16px → 24px → 32px
      </div>
      
      {/* Botón para toggle dark mode */}
      <button
        onClick={handleToggle}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
      >
        Toggle Dark Mode Manual
      </button>
    </div>
  )
}
