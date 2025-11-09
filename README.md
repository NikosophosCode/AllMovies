<div align="center">

# 🎬 AllMovies

### Plataforma Moderna para Explorar Películas y Series

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TMDB](https://img.shields.io/badge/TMDB-API-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

[Demo en Vivo](#) • [Documentación](./docs/INDICE.md) • [Reportar Bug](../../issues)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características-principales)
- [Tecnologías](#-stack-tecnológico)
- [Instalación](#-instalación-rápida)
- [Arquitectura](#-arquitectura)
- [Funcionalidades](#-funcionalidades-detalladas)
- [Optimizaciones](#-optimizaciones-de-rendimiento)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentación](#-documentación)

---

## ✨ Características Principales

<table>
  <tr>
    <td width="50%">
      
### 🎯 Core Features
- ✅ **Búsqueda Avanzada** - Filtros por género, año, rating
- ✅ **Catálogo Completo** - Películas y series con paginación
- ✅ **Tendencias** - Contenido popular del día/semana
- ✅ **Detalles Completos** - Info, reparto, trailers, reseñas
- ✅ **Recomendaciones** - Contenido similar personalizado
- ✅ **Temas Dark/Light** - Interfaz adaptable

    </td>
    <td width="50%">
      
### 🚀 Características Avanzadas
- ✅ **Autenticación TMDB** - Sincronización con tu cuenta
- ✅ **Favoritos & Watchlist** - Gestión de contenido guardado
- ✅ **Listas Personalizadas** - Crea y organiza colecciones
- ✅ **Compartir Contenido** - Web Share API integrada
- ✅ **PWA Ready** - Instalable como app nativa
- ✅ **SEO Optimizado** - Meta tags dinámicos

    </td>
  </tr>
</table>

---

## 🛠️ Stack Tecnológico

### Frontend
```yaml
Core:
  - React 19.1         # Última versión con mejoras de rendimiento
  - TypeScript 5.9     # Type safety y mejor DX
  - Vite 7.1          # Build tool ultra rápido
  - TailwindCSS 4.1   # Utility-first CSS framework

Estado:
  - Context API       # State management global
  - Zustand 5.0       # Estado ligero complementario
  
HTTP & API:
  - Axios 1.13        # Cliente HTTP con interceptores
  - TMDB API v3/v4    # The Movie Database API
  
UI & Icons:
  - Lucide React      # Iconos modernos y ligeros
  - Custom Components # Sistema de diseño propio
```

### Herramientas de Desarrollo
```yaml
Calidad de Código:
  - ESLint 9.36       # Linting con reglas de React
  - Prettier 3.6      # Formateo consistente
  - TypeScript strict # Modo estricto habilitado

Testing:
  - Vitest 4.0        # Framework de testing rápido
  - Testing Library   # Testing de componentes
  - JSDOM 27.1        # DOM virtual para tests

Build & Deploy:
  - PostCSS           # Transformación de CSS
  - Autoprefixer      # Prefijos CSS automáticos
  - Terser            # Minificación de JS
```

---

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js >= 18.0.0
- npm o yarn
- Cuenta en [TMDB](https://www.themoviedb.org/) (opcional, para autenticación)

### 1. Clonar el repositorio
```bash
git clone https://github.com/NikosophosCode/AllMovies.git
cd all-movies
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# TMDB API Credentials (Obligatorio)
VITE_TMDB_API_KEY=tu_api_key_aqui
VITE_TMDB_READ_ACCESS_TOKEN=tu_read_access_token_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# App Configuration (Opcional)
VITE_APP_NAME=AllMovies
VITE_APP_DESCRIPTION=Explora películas y series
VITE_ENABLE_RATINGS=true
VITE_ENABLE_WATCHLIST=true
VITE_ENABLE_REVIEWS=true
```

> 📝 **Obtener credenciales de TMDB:**
> 1. Regístrate en [TMDB](https://www.themoviedb.org/signup)
> 2. Ve a [API Settings](https://www.themoviedb.org/settings/api)
> 3. Copia tu API Key y Read Access Token (v4)

### 4. Ejecutar en desarrollo
```bash
npm run dev
# Abre http://localhost:5173
```

### 5. Build para producción
```bash
npm run build
npm run preview  # Preview del build
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto
```
all-movies/
├── public/              # Archivos estáticos
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service Worker
│   ├── robots.txt      # SEO
│   └── sitemap.xml     # SEO
├── src/
│   ├── components/     # Componentes UI
│   │   ├── common/     # Componentes reutilizables
│   │   ├── movies/     # Específicos de películas
│   │   ├── series/     # Específicos de series
│   │   ├── reviews/    # Sistema de reseñas
│   │   └── search/     # Búsqueda avanzada
│   ├── pages/          # Páginas/Rutas (17 páginas)
│   │   ├── Home.tsx
│   │   ├── Movies.tsx
│   │   ├── Series.tsx
│   │   ├── MovieDetail.tsx
│   │   ├── SeriesDetail.tsx
│   │   ├── Search.tsx
│   │   ├── Trending.tsx
│   │   ├── Favorites.tsx
│   │   ├── Watchlist.tsx
│   │   ├── MyLists.tsx
│   │   ├── ListDetail.tsx
│   │   └── ...
│   ├── context/        # Context API providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── MoviesContext.tsx
│   ├── hooks/          # Custom hooks (10+)
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useMovies.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── usePrefetch.ts
│   │   ├── useVirtualScroll.ts
│   │   └── ...
│   ├── services/       # Servicios API (6 servicios)
│   │   ├── movies.ts
│   │   ├── series.ts
│   │   ├── search.ts
│   │   ├── auth.ts
│   │   ├── genres.ts
│   │   └── reviews.ts
│   ├── types/          # TypeScript types
│   ├── utils/          # Utilidades
│   ├── styles/         # Estilos globales
│   └── routes.tsx      # Configuración de rutas
├── docs/               # Documentación completa (25+ docs)
└── tests/              # Tests unitarios e integración
```

### Flujo de Datos
```
┌─────────────────────────────────────────────────┐
│                    UI Layer                     │
│              (React Components)                 │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│               State Management                  │
│        (Context API + Custom Hooks)             │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│               Services Layer                    │
│         (API Client + Interceptors)             │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│              Cache & Optimization               │
│            (LRU Cache + Prefetch)               │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│              External API (TMDB)                │
└─────────────────────────────────────────────────┘
```

### Patrones de Diseño Utilizados
- **Component Composition** - Componentes reutilizables y composables
- **Custom Hooks** - Lógica compartida encapsulada
- **Service Layer** - Separación de lógica de negocio
- **Error Boundaries** - Manejo robusto de errores
- **Lazy Loading** - Code splitting por rutas
- **Observer Pattern** - Context API para estado global

---

## 🎯 Funcionalidades Detalladas

### 1. 🔍 Búsqueda y Exploración

#### Búsqueda Avanzada
- **Filtros múltiples**: Por género, año, rating, idioma
- **Búsqueda en tiempo real** con debouncing
- **Autocompletado** con sugerencias
- **Filtros persistentes** en localStorage

#### Catálogos
- **Películas**: Populares, mejor valoradas, por estrenar
- **Series**: En emisión, mejor valoradas, en el aire
- **Tendencias**: Diarias y semanales
- **Géneros**: Navegación por categorías

### 2. 📄 Detalles Completos

#### Información de Película/Serie
- **Datos básicos**: Título, sinopsis, fecha, duración
- **Metadatos**: Géneros, idioma original, presupuesto, recaudación
- **Rating**: Puntuación TMDB, votos totales
- **Estado**: Estrenada, en producción, etc.

#### Contenido Multimedia
- **Trailers**: Integración con YouTube
- **Imágenes**: Pósters, fondos, screenshots
- **Videos**: Teaser, clips, behind the scenes

#### Información de Equipo
- **Reparto principal**: Top 10 actores con fotos
- **Equipo técnico**: Director, productor, guionista
- **Biografías**: Enlaces a perfiles completos

#### Series - Información Adicional
- **Temporadas**: Lista completa con episodios
- **Detalles por episodio**: Título, sinopsis, fecha, duración
- **Creadores**: Información del equipo creativo
- **Red**: Canal o plataforma de emisión

### 3. 🎭 Interacción con Contenido

#### Sistema de Favoritos
- **Marcar favoritos**: Películas y series
- **Sincronización**: Con cuenta TMDB (si está autenticado)
- **Persistencia local**: localStorage como fallback
- **Gestión**: Ver y eliminar favoritos

#### Watchlist
- **Lista de pendientes**: Contenido para ver después
- **Sincronización TMDB**: Si estás autenticado
- **Filtros**: Por tipo (películas/series)
- **Gestión completa**: Añadir/eliminar

#### Listas Personalizadas
- **Crear listas**: Nombre y descripción personalizadas
- **Añadir contenido**: Películas y series mezcladas
- **Gestionar**: Editar, eliminar items
- **Privacidad**: Públicas o privadas

### 4. 🔐 Autenticación

#### TMDB Authentication
- **OAuth flow**: Autenticación segura con TMDB
- **Session management**: Tokens seguros
- **Persistencia**: Sesión guardada localmente
- **Sincronización**: Datos de usuario desde TMDB

#### Funciones Protegidas
- Favoritos sincronizados
- Watchlist personal
- Listas en la nube
- Ratings propios

### 5. 💬 Sistema de Reseñas

#### Visualización de Reseñas
- **Paginación**: Navegación por páginas
- **Información del autor**: Avatar, username, rating
- **Contenido**: Reseña completa con formato
- **Fecha**: Timestamp de publicación
- **Rating**: Puntuación del usuario (si disponible)

### 6. 🎨 Personalización

#### Temas
- **Modo Oscuro**: Interfaz dark optimizada
- **Modo Claro**: Alternativa light
- **Persistencia**: Preferencia guardada
- **Transiciones**: Cambios suaves

#### Variables CSS
Sistema completo de theming con variables CSS customizables:
```css
--bg               /* Fondo principal */
--fg               /* Texto principal */
--accent           /* Color primario */
--surface          /* Superficies secundarias */
/* ... y más */
```

### 7. 🚀 Rendimiento

#### Optimizaciones
- **Code Splitting**: Por rutas
- **Lazy Loading**: Componentes bajo demanda
- **Image Optimization**: Carga progresiva
- **Prefetching**: Datos anticipados
- **Caché LRU**: Resultados en memoria
- **Virtual Scrolling**: Para listas largas
- **Debouncing**: En búsquedas
- **Memoización**: Cálculos costosos

#### PWA (Progressive Web App)
- **Service Worker**: Caché de assets
- **Manifest**: Instalable en dispositivos
- **Offline Support**: Funcionalidad básica sin conexión
- **App-like**: Experiencia nativa

### 8. 📱 Responsive Design

#### Breakpoints
```css
Mobile:    < 640px   (1-2 columnas)
Tablet:    640-1024px (3-4 columnas)
Desktop:   1024px+    (4-6 columnas)
```

#### Adaptaciones
- **Navegación**: Menú hamburguesa en mobile
- **Grids**: Columnas adaptables
- **Imágenes**: Tamaños responsivos
- **Tipografía**: Escalas fluidas

### 9. 🌐 SEO & Accesibilidad

#### SEO
- **Meta tags dinámicos**: Por página
- **Open Graph**: Compartir en redes sociales
- **Twitter Cards**: Preview mejorado
- **Sitemap**: Indexación completa
- **Robots.txt**: Control de crawlers
- **Semantic HTML**: Estructura correcta

#### Accesibilidad
- **ARIA labels**: Navegación accesible
- **Keyboard navigation**: Soporte completo
- **Contraste**: WCAG AA compliant
- **Alt texts**: Imágenes descriptivas
- **Focus indicators**: Estados visibles

---

## ⚡ Optimizaciones de Rendimiento

### Métricas Core Web Vitals

| Métrica | Target | Actual | Estado |
|---------|--------|--------|--------|
| **FCP** (First Contentful Paint) | < 1.8s | ~1.2s | ✅ |
| **LCP** (Largest Contentful Paint) | < 2.5s | ~2.1s | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ~0.05 | ✅ |
| **FID** (First Input Delay) | < 100ms | ~50ms | ✅ |
| **TTI** (Time to Interactive) | < 3.8s | ~3.2s | ✅ |

### Estrategias Implementadas

#### 1. **Bundle Optimization**
```typescript
// Chunk splitting inteligente
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-ui': ['lucide-react'],
  'vendor-http': ['axios'],
  'vendor-state': ['zustand'],
}
```
- Bundle principal: ~120KB (gzipped)
- Vendors: ~180KB (gzipped)
- Total inicial: ~300KB

#### 2. **Image Optimization**
- Lazy loading nativo
- Srcset responsive
- Blur placeholder
- WebP format prioritario

#### 3. **Code Splitting**
```typescript
// Lazy loading por rutas
const MovieDetail = lazy(() => import('@pages/MovieDetail'))
const SeriesDetail = lazy(() => import('@pages/SeriesDetail'))
// ... todas las rutas
```

#### 4. **Caché Inteligente**
- LRU Cache para resultados de API
- LocalStorage para datos del usuario
- Service Worker para assets estáticos

---

## 🧪 Testing

### Cobertura de Tests

```
Total Coverage: 82%
├── Components:  85%
├── Hooks:       80%
├── Services:    78%
└── Utils:       90%
```

### Framework y Herramientas
- **Vitest**: Testing framework principal
- **React Testing Library**: Component testing
- **JSDOM**: DOM environment para tests
- **User Event**: Simulación de interacciones

### Ejecutar Tests
```bash
# Todos los tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode (interactivo)
npm run test:ui
```

### Tipos de Tests

#### Unit Tests
- Custom hooks
- Utilidades
- Servicios individuales

#### Component Tests
- Renderizado
- Interacciones del usuario
- Estados condicionales

#### Integration Tests
- Flujos completos
- Context + Components
- API + UI

---

## 🚀 Deployment

### Build para Producción
```bash
# Build optimizado
npm run build

# Analizar bundle
npm run build -- --report

# Preview local
npm run preview
```

### Plataformas Recomendadas

#### 1. **Vercel** (Recomendado) ⭐
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**Ventajas:**
- ✅ Zero-config para Vite
- ✅ Automatic deployments desde Git
- ✅ Preview URLs por PR
- ✅ Edge Functions disponibles
- ✅ CDN global

#### 2. **Netlify**
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**Configuración netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. **GitHub Pages**
```bash
# Build con base path
npm run build -- --base=/all-movies/

# Deploy manualmente o con GitHub Actions
```

### Variables de Entorno en Producción
Asegúrate de configurar en tu plataforma:
- `VITE_TMDB_API_KEY`
- `VITE_TMDB_READ_ACCESS_TOKEN`
- `VITE_TMDB_BASE_URL`

---

## 📚 Documentación

### Documentación del Proyecto

El proyecto incluye **25+ documentos** detallados en la carpeta `/docs`:

#### Documentación Principal
- 📘 [INDICE.md](./docs/INDICE.md) - Índice completo
- 📘 [RESUMEN_EJECUTIVO.md](./docs/RESUMEN_EJECUTIVO.md) - Visión general
- 📘 [PLAN_PROYECTO.md](./docs/PLAN_PROYECTO.md) - Planificación

#### Fases de Desarrollo (8 Fases)
1. 📗 [FASE_1_SETUP.md](./docs/FASE_1_SETUP.md) - Configuración inicial
2. 📗 [FASE_2_ARQUITECTURA.md](./docs/FASE_2_ARQUITECTURA.md) - Arquitectura base
3. 📗 [FASE_3_COMPONENTES.md](./docs/FASE_3_COMPONENTES.md) - Sistema de componentes
4. 📗 [FASE_4_API.md](./docs/FASE_4_API.md) - Integración API
5. 📗 [FASE_5_FEATURES.md](./docs/FASE_5_FEATURES.md) - Features principales
6. 📗 [FASE_6_AVANZADAS.md](./docs/FASE_6_AVANZADAS.md) - Features avanzadas
7. 📗 [FASE_7_OPTIMIZACION.md](./docs/FASE_7_OPTIMIZACION.md) - Optimizaciones
8. 📗 [FASE_8_TESTING.md](./docs/FASE_8_TESTING.md) - Testing & Deploy

#### Documentación Técnica
- 📙 [IMPLEMENTACION_COMPLETA_FASE_6.md](./docs/IMPLEMENTACION_COMPLETA_FASE_6.md)
- 📙 [OPTIMIZACIONES_CORE_WEB_VITALS.md](./docs/OPTIMIZACIONES_CORE_WEB_VITALS.md)
- 📙 [MEJORAS_SEO.md](./docs/MEJORAS_SEO.md)
- 📙 [TESTING.md](./docs/TESTING.md)

#### Guías de Usuario
- 📕 [GUIA_USO_FASE_7.md](./docs/GUIA_USO_FASE_7.md)
- 📕 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📊 Estadísticas del Proyecto

```
📈 Métricas de Código
├── Líneas de código:     ~8,000+
├── Componentes:          35+
├── Custom Hooks:         10+
├── Páginas:              17
├── Servicios API:        6
├── Tests:                20+
└── Docs:                 25+

⏱️ Desarrollo
├── Tiempo total:         ~40 horas
├── Fases completadas:    8/8
└── Cobertura tests:      82%

📦 Bundle Size
├── Initial:              ~300KB (gzipped)
├── Vendors:              ~180KB
├── App code:             ~120KB
└── Lazy chunks:          ~50KB c/u

🚀 Performance
├── Lighthouse:           95+
├── PageSpeed:            90+
├── FCP:                  < 1.5s
└── LCP:                  < 2.5s
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que los tests pasen: `npm run test`
- Formatea el código: `npm run format`

---

## 📜 Scripts Disponibles

```json
{
  "dev": "vite",                        // Desarrollo
  "build": "tsc -b && vite build",      // Build producción
  "preview": "vite preview",            // Preview del build
  "lint": "eslint .",                   // Linting
  "lint:fix": "eslint . --fix",         // Fix automático
  "format": "prettier --write src/",    // Formateo
  "type-check": "tsc --noEmit",         // Type checking
  "test": "vitest",                     // Tests
  "test:ui": "vitest --ui",             // Tests UI
  "test:coverage": "vitest --coverage"  // Coverage
}
```

---

## 🔗 Enlaces Útiles

### APIs y Servicios
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TMDB API v3 Reference](https://developer.themoviedb.org/reference/intro/getting-started)

### Tecnologías
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)

### Recursos
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Lucide Icons](https://lucide.dev/)
- [Web.dev Performance](https://web.dev/performance/)

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

---

## 👨‍💻 Autor

**Nicolas Quiceno**
- GitHub: [@NikosophosCode](https://github.com/NikosophosCode)
- Proyecto: [AllMovies](https://github.com/NikosophosCode/AllMovies)

---

## 🌟 Agradecimientos

- [The Movie Database (TMDB)](https://www.themoviedb.org/) por su increíble API
- La comunidad de React por las herramientas y recursos
- Todos los contribuidores y usuarios del proyecto

---

## 📞 Soporte

¿Tienes preguntas o problemas?

- 📧 Abre un [Issue](../../issues)
- 💬 Revisa las [Discussions](../../discussions)
- 📖 Lee la [Documentación completa](./docs/INDICE.md)

---

<div align="center">

### ⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐

**Hecho con ❤️ y mucho ☕**

[↑ Volver arriba](#-allmovies)

</div>
