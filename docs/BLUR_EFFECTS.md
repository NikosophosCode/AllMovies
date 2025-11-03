# Sistema de Efectos Blur Modernos

**Fecha:** 2025-11-02  
**Versión:** 1.0

## 📋 Índice

1. [Resumen](#resumen)
2. [Clases de Blur Disponibles](#clases-de-blur-disponibles)
3. [Guía de Uso](#guía-de-uso)
4. [Ejemplos Prácticos](#ejemplos-prácticos)
5. [Compatibilidad con Temas](#compatibilidad-con-temas)

---

## Resumen

Este documento describe el sistema de efectos blur implementado en el proyecto AllMovies. Todos los efectos son **completamente compatibles con modo claro/oscuro** y siguen la arquitectura de variables CSS del proyecto (no dependen de utilidades `dark:` de Tailwind).

### Características principales:

- ✅ Compatible con modo claro y oscuro
- ✅ Efectos de glassmorphism modernos
- ✅ Optimizado para rendimiento (GPU acceleration)
- ✅ Transiciones suaves y animaciones
- ✅ Accesibilidad mejorada

---

## Clases de Blur Disponibles

### 1. **Blur Básico**

#### `.blur-card`
- **Uso:** Elementos flotantes como cards y tooltips
- **Intensidad:** 12px blur + 180% saturación
- **Ejemplo:** Tarjetas de películas, badges

```css
backdrop-filter: blur(12px) saturate(180%);
```

#### `.blur-overlay`
- **Uso:** Overlays y modales
- **Intensidad:** 20px blur + 160% saturación
- **Ejemplo:** Modales de confirmación, overlays de imágenes

```css
backdrop-filter: blur(20px) saturate(160%);
```

#### `.blur-nav`
- **Uso:** Barras de navegación sticky/fixed
- **Intensidad:** 24px blur + 200% saturación
- **Ejemplo:** Navbar, sidebar

```css
backdrop-filter: blur(24px) saturate(200%);
```

#### `.blur-hero`
- **Uso:** Secciones hero y efectos especiales
- **Intensidad:** 40px blur + 150% saturación
- **Ejemplo:** Hero sections, fondos de parallax

```css
backdrop-filter: blur(40px) saturate(150%);
```

---

### 2. **Glass Morphism**

#### `.glass-morphism`
- **Descripción:** Efecto de vidrio completo con bordes y sombras
- **Modo claro:** Fondo blanco semitransparente con borde claro
- **Modo oscuro:** Fondo oscuro semitransparente con borde sutil

**Características:**
- Background semitransparente
- Blur de 16px
- Borde con transparencia
- Box-shadow adaptativo

**Ejemplo de uso:**
```tsx
<div className="glass-morphism rounded-2xl p-8">
  Contenido con efecto cristal
</div>
```

#### `.glass-card`
- **Descripción:** Tarjetas con efecto de vidrio (más sutil que `.glass-morphism`)
- **Interactivo:** Incluye estados hover con transformaciones

**Estados:**
- **Normal:** Background 50% opaco, blur 12px
- **Hover:** Background 60% opaco, sombra aumentada, translateY(-2px)

**Ejemplo de uso:**
```tsx
<div className="glass-card rounded-lg p-6">
  Tarjeta con efecto cristal
</div>
```

---

### 3. **Elementos Interactivos**

#### `.blur-button`
- **Descripción:** Botones flotantes con efecto blur
- **Interactivo:** Efecto hover con scale(1.05)

**Características:**
- Background semitransparente adaptativo
- Blur de 10px
- Transiciones suaves en hover
- Bordes con transparencia

**Ejemplo de uso:**
```tsx
<button className="blur-button p-3 rounded-full">
  <Icon size={20} />
</button>
```

---

### 4. **Efectos Especiales**

#### `.frosted`
- **Descripción:** Efecto de vidrio esmerilado (frosted glass)
- **Intensidad:** 20px blur + 200% saturación

**Ejemplo de uso:**
```tsx
<footer className="frosted border-t">
  Contenido del footer
</footer>
```

#### `.blur-gradient-light`
- **Descripción:** Overlay con gradiente y blur
- **Gradiente:** 135deg desde semitransparente a más transparente

**Ejemplo de uso:**
```tsx
<div className="blur-gradient-light absolute inset-0">
  Overlay con gradiente
</div>
```

---

### 5. **Efectos Visuales Adicionales**

#### `.shimmer`
- **Descripción:** Efecto de brillo animado que se mueve horizontalmente
- **Animación:** 3s infinite

**Ejemplo de uso:**
```tsx
<div className="shimmer rounded-lg p-4">
  Contenido con brillo animado
</div>
```

#### `.glow`
- **Descripción:** Efecto de resplandor rojo (accent color)
- **Sombras:** Múltiples capas con diferentes intensidades

**Ejemplo de uso:**
```tsx
<div className="w-3 h-3 rounded-full bg-yellow-500 glow">
  Indicador con resplandor
</div>
```

#### `.glow-hover`
- **Descripción:** Efecto de resplandor activado en hover
- **Transición:** 0.3s ease

**Ejemplo de uso:**
```tsx
<button className="glow-hover p-4 rounded-lg">
  Botón con resplandor en hover
</button>
```

---

## Guía de Uso

### Cuándo usar cada clase:

| Elemento | Clase Recomendada | Razón |
|----------|-------------------|-------|
| Navbar sticky | `.blur-nav` | Máxima legibilidad sobre contenido |
| Tarjetas de películas | `.glass-card` | Efecto moderno con hover |
| Modales/Dialogs | `.blur-overlay` | Foco en el contenido del modal |
| Hero sections | `.glass-morphism` | Impacto visual máximo |
| Botones flotantes | `.blur-button` | Consistencia y modernidad |
| Footer | `.frosted` | Separación visual sutil |
| Loading overlays | `.blur-overlay` | Indicación clara de bloqueo |
| Badges/Chips | `.glass-card` o `.blur-card` | Legibilidad y diseño limpio |

---

## Ejemplos Prácticos

### Ejemplo 1: Card de Película
```tsx
<div className="glass-card rounded-xl overflow-hidden glow-hover">
  <img src={posterUrl} alt={title} />
  <div className="p-4">
    <h3>{title}</h3>
    <div className="glass-morphism rounded-lg p-2 inline-flex items-center gap-2">
      <Star className="fill-yellow-500" />
      <span>{rating}</span>
    </div>
  </div>
</div>
```

### Ejemplo 2: Navbar con Blur
```tsx
<nav className="sticky top-0 blur-nav" style={{ backgroundColor: 'var(--surface)' }}>
  <div className="flex items-center gap-4">
    <Logo />
    <NavLinks />
    <button className="blur-button rounded-lg p-2">
      <Search />
    </button>
  </div>
</nav>
```

### Ejemplo 3: Hero Section
```tsx
<section className="relative overflow-hidden">
  {/* Fondo con blur shapes */}
  <div className="absolute inset-0">
    <div className="w-96 h-96 blur-hero rounded-full" 
         style={{ background: 'radial-gradient(closest-side, #ef4444, transparent)' }} />
  </div>
  
  {/* Contenido */}
  <div className="glass-morphism rounded-2xl p-12">
    <h1 className="glow">Welcome to AllMovies</h1>
  </div>
</section>
```

### Ejemplo 4: Modal con Overlay
```tsx
<div className="fixed inset-0 blur-overlay z-50" style={{ backgroundColor: 'var(--overlay)' }}>
  <div className="glass-morphism rounded-2xl p-8 max-w-lg mx-auto mt-24">
    <h2>Confirm Action</h2>
    <p>Are you sure?</p>
    <div className="flex gap-4">
      <button className="blur-button px-6 py-2 rounded-lg">Cancel</button>
      <button className="bg-red-600 px-6 py-2 rounded-lg glow-hover">Confirm</button>
    </div>
  </div>
</div>
```

---

## Compatibilidad con Temas

Todas las clases de blur están diseñadas para funcionar automáticamente con el sistema de temas del proyecto:

### Modo Claro
- Backgrounds más claros y transparentes
- Bordes blancos con baja opacidad
- Sombras más suaves

### Modo Oscuro (html.dark)
- Backgrounds más oscuros
- Bordes con opacidad reducida
- Sombras más intensas y profundas

**Ejemplo de implementación:**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.5); /* Modo claro */
}

html.dark .glass-card {
  background: rgba(15, 23, 42, 0.5); /* Modo oscuro */
}
```

---

## Animaciones Incluidas

### `.animate-float`
- **Duración:** 4s
- **Efecto:** Movimiento vertical suave (-12px)
- **Uso:** Elementos decorativos, badges

### `.animate-tilt`
- **Duración:** 8s
- **Efecto:** Rotación sutil (±0.5deg)
- **Uso:** Shapes de fondo, elementos decorativos

### `.pulse-soft`
- **Duración:** 2s
- **Efecto:** Pulso suave de opacidad y escala
- **Uso:** Indicadores, badges importantes

---

## Rendimiento y Buenas Prácticas

### ✅ Hacer:
- Usar `will-change: transform` para elementos animados
- Aplicar blur a elementos pequeños cuando sea posible
- Combinar con `transform: translate3d(0,0,0)` para GPU acceleration
- Limitar el número de elementos con blur simultáneos en viewport

### ❌ Evitar:
- Aplicar blur a elementos muy grandes (fullscreen)
- Usar blur en elementos que se animan constantemente
- Combinar múltiples niveles de blur innecesarios
- Aplicar blur a texto cuando sea crítico para legibilidad

---

## Soporte de Navegadores

Todas las propiedades incluyen prefijos para compatibilidad:

```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px); /* Safari support */
```

**Navegadores soportados:**
- Chrome/Edge 76+
- Firefox 103+
- Safari 9+ (con prefijo)
- Opera 63+

---

## Mantenimiento

Al añadir nuevos efectos blur:

1. Definir la clase en `src/index.css`
2. Incluir versión para modo oscuro con `html.dark`
3. Añadir prefijos `-webkit-` para Safari
4. Documentar en este archivo
5. Probar en ambos modos (claro/oscuro)
6. Validar rendimiento en dispositivos móviles

---

## Migración desde Tailwind dark:

Si encuentras código usando `backdrop-blur-*` de Tailwind, reemplázalo con las clases custom:

```tsx
// ❌ Antes (no funciona con el sistema de temas)
<div className="backdrop-blur-md dark:backdrop-blur-lg">

// ✅ Después (compatible con variables CSS)
<div className="blur-card">
```

---

**Última actualización:** 2 de noviembre, 2025  
**Mantenedor:** NikosophosCode
