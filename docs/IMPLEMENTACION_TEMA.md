## Documentación de la implementación del tema (claro/oscuro)

Última actualización: 2025-11-01

Resumen
-------
Este documento explica la nueva implementación del sistema de temas de la aplicación (modo claro/oscuro), los problemas detectados, los cambios aplicados y una guía práctica para que futuros desarrollos integren correctamente el tema sin provocar regresiones o efectos inesperados (FOUC, estilos inconsistentes, conflictos con Tailwind). Está dirigido a desarrolladores del proyecto y revisores de PR.

Motivación y causa raíz
------------------------
- El proyecto usa React + Vite y TailwindCSS (v4.x). Algunas versiones/configuración de Tailwind generan las utilidades `dark:` envueltas bajo media queries `@media (prefers-color-scheme: dark)`, lo que hace que las utilidades compiladas respondan al modo del sistema (media) y no al toggle por clase (ej. `html.dark`).
- Resultado: cuando el ThemeProvider añadía/removía `html.dark` la UI no cambiaba porque muchas utilidades se aplicaban vía `prefers-color-scheme` en CSS compilado.
- Además existía riesgo de FOUC (flash of wrong theme) si el tema no se aplicaba antes de que la hoja de estilos se cargara.

Resumen de la solución aplicada
-------------------------------
1. Early-init script en `index.html`: script inline ejecutado antes de cargar los estilos y la app para fijar el tema inicial usando `localStorage('app-theme')` o `prefers-color-scheme` cuando el valor es `auto`. Evita FOUC.
2. ThemeProvider (`src/context/ThemeContext.tsx`): se actualizó la lógica para soportar los modos `light | dark | auto`, persistencia en `localStorage`, y para aplicar `document.documentElement.classList.toggle('dark', isDark)` y ajustar `document.documentElement.style.colorScheme = 'dark'|'light'` para mejora en navegadores.
3. Estrategia variables-first: se migraron los colores base y estados críticos (fondo, superficie, tarjetas, texto, muteds, acentos) a variables CSS en `src/index.css`, controladas por `:root` y `html.dark`. Esto hace que el toggle funcione independientemente de cómo Tailwind compile `dark:`.
4. Migración parcial de componentes: Layout, Navbar, Footer, MovieCard, Home (hero) y Parallax usan ahora variables CSS para colores y estados. Se añadieron animaciones (float/tilt) y un componente `Parallax` reutilizable.

Archivos clave modificados/añadidos
---------------------------------
- `index.html` — añadido script early-init que lee `localStorage` y aplica `html.dark` antes de cargar CSS/JS.
- `src/index.css` — definiciones de variables CSS (tema claro/oscuro), keyframes y utilidades comunes (scrollbar, parallax-layer). Punto central del theming.
- `src/context/ThemeContext.tsx` — nueva lógica del ThemeProvider (soporte `auto`, listener prefers-color-scheme, persistencia, `color-scheme`).
- `src/components/...` — varios componentes migrados a usar variables CSS para colores (Navbar, Footer, MovieCard, Layout, Home).
- `src/components/common/Parallax/Parallax.tsx` — nuevo componente para efectos de parallax en hero.

Detalles técnicos
-----------------
1) Early-init script (qué hace)

- Lee `localStorage.getItem('app-theme')`. Valores esperados: `'light'`, `'dark'`, `'auto'`.
- Si no hay valor, por defecto se usa `auto`.
- Si el valor es `auto`, consulta `window.matchMedia('(prefers-color-scheme: dark)').matches` para decidir inicialmente.
- Añade o remueve la clase `dark` a `document.documentElement` y ajusta `document.documentElement.style.colorScheme` a `'dark'` o `'light'`.

Ejemplo (resumen, ver `index.html` en repo):

```html
<script>
  (function(){
    try{
      const key = 'app-theme';
      const saved = localStorage.getItem(key) || 'auto';
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved === 'dark' || (saved === 'auto' && prefersDark);
      document.documentElement.classList.toggle('dark', !!isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    }catch(e){/* fail silently */}
  })();
</script>
```

2) ThemeProvider (`src/context/ThemeContext.tsx`) — contrato y comportamiento

- Inputs/outputs: expone un contexto con `theme` y `setTheme(mode)`. `theme.mode` es `'light'|'dark'|'auto'`.
- Efecto: cuando cambia el modo, actualiza `localStorage('app-theme')`, añade/remueve `html.dark` y actualiza `color-scheme`.
- `auto` registra un listener a `matchMedia('(prefers-color-scheme: dark)')` para actualizar el tema si el usuario cambia la preferencia del sistema.

3) Variables CSS (nombres y significado)

- Recomendación de tokens usados (ver `src/index.css`):
  - `--bg` — fondo principal de la app
  - `--surface` — superficies generales (cards, panels)
  - `--card-bg` — fondo de tarjetas/elementos concretos
  - `--border` — color de bordes/dividers
  - `--fg` — color de texto principal
  - `--fg-muted` — texto secundario/muted
  - `--accent` — color primario/acción (botones, links)
  - `--accent-foreground` — color del texto sobre `--accent`
  - `--glass` — color para overlays ligeros (opcional)

- Estructura en `src/index.css`:
  - `:root { /* valores light */ --bg: #fff; --fg: #111; ... }
  - `html.dark { /* valores dark */ --bg: #0b0f13; --fg: #e6eef6; ... }

4) Regla general para componentes nuevos

- Preferir variables CSS para colores y estados visuales críticos.
- Para utilidades de layout (padding, gap, flex, grid), usar clases Tailwind.
- Evitar mezclar `dark:` de Tailwind para colores críticos; si se usa, asegurar que Tailwind esté configurado para `darkMode: 'class'` y que la versión de Tailwind compile `dark:` como clases (si se prefiere esta aproximación en lugar de variables). Dado el historial del proyecto, la estrategia variables-first es la recomendada y más robusta.

Cómo añadir un nuevo componente compatible con el tema (paso a paso)
---------------------------------------------------------------
1. Define los tokens necesarios en `src/index.css` si no existen (p. ej. `--badge-bg`, `--badge-fg`). Añade valores para `:root` y `html.dark`.
2. En el JSX/TSX del componente, usa clases Tailwind para layout y variables CSS para colores:

```tsx
<div className="p-4 rounded-md" style={{background: 'var(--card-bg)', color: 'var(--fg)'}}>
  <h3 className="text-lg font-semibold">Título</h3>
  <p className="text-sm text-[var(--fg-muted)]">Descripción</p>
</div>
```

3. Si necesitas hover/focus states, añade clases CSS que usen variables:

```css
.btn-accent{
  background: var(--accent);
  color: var(--accent-foreground);
}
.btn-accent:hover{ background: color-mix(in srgb, var(--accent) 80%, black 20%); }
/* ó usar utilidades Tailwind para sombras/borde y variables para colores */
```

4. Pruebas manuales:
  - Inicia `npm run dev`.
  - Comprueba el toggle del tema desde la UI y observa que los colores cambian.
  - Cambia `localStorage('app-theme')` en la consola y recarga para probar early-init.

Consejos para evitar errores comunes
----------------------------------
- No dependas únicamente de `dark:` de Tailwind para colores esenciales. Con Tailwind v4 la compilación puede colocarlos bajo `prefers-color-scheme`.
- Mantén el set de tokens centralizado en `src/index.css`. No inventes nombres distintos para el mismo significado (`--surface` vs `--card-bg`), crea un mapeo claro.
- Añade nuevas variables para estados (hover, active) solo cuando realmente varíen entre temas.
- Para assets (SVGs/íconos), prefiere íconos inline o soporta `currentColor` para que hereden `--fg`.
- Siempre aplica `document.documentElement.style.colorScheme` además de `html.dark` para mejorar integración con controles nativos (scrollbars, inputs) en algunos navegadores.

Pruebas y validación (checklist)
--------------------------------
- [ ] Dev server: `npm run dev` — comprobar toggle y navegación.
- [ ] Build de producción: `npm run build` — confirmar que no hay errores.
- [ ] Revisar `dist/assets/*.css` — buscar reglas inesperadas `@media (prefers-color-scheme: dark)` que puedan afectar a utilidades críticas. Si existen, revisar si esas utilidades han sido reemplazadas por variables o reconfigurar Tailwind.
- [ ] Accesibilidad: comprobar contraste con Lighthouse o axe (ratio mínimo 4.5:1 para texto normal). Ajustar tokens si es necesario.
- [ ] Probar FOUC: recargar la página en una sesión nueva y verificar que el tema correcto se aplica antes de que se renderice el contenido.

Comandos útiles
---------------
Usar PowerShell (en el repo):

```powershell
npm run dev
npm run build
```

Revisiones y PRs
----------------
Al revisar PRs que toquen estilos o componentes con color, seguir esta checklist para evitar regresiones:

1. ¿Se usaron variables CSS para colores en lugar de confiar en `dark:`? Si no, justificar por qué.
2. ¿Se actualizó `src/index.css` para incluir nuevos tokens y valores dark/light? (si aplica)
3. ¿Se probó el cambio con `app-theme` en `'light'`, `'dark'` y `'auto'`? ¿Se comprobó la persistencia tras recarga?
4. ¿Se comprobó que no haya FOUC (tema aplicado antes de mostrar contenido)?
5. ¿Se ejecutó el build (`npm run build`) y se inspeccionó el CSS de salida en `dist/assets/`?

Próximas mejoras recomendadas
----------------------------
- Migrar el resto de componentes a variables CSS para obtener consistencia completa.
- Exponer los tokens (o un subset) desde `ThemeContext` como un objeto JS, para que componentes JS puedan leer valores (por ejemplo, para generar dinámicamente tonalidades). Evitar inline styles por defecto; preferir CSS vars.
- Añadir pruebas visuales/regresivas (Percy, Chromatic o Playwright visual comparison) para detectar cambios involuntarios de estilo.
- Añadir una pequeña suite de tests de accesibilidad automatizados (axe) en la CI.
- Considerar una transición a una versión más reciente de Tailwind si se desea usar `dark:` de forma segura con `class` (documentar el cambio y revisar configuración `darkMode`).

Notas finales
------------
La estrategia variables-first aporta robustez entre versiones y configuraciones de Tailwind. Mantener el diseño tokenizado (variables) ayuda a que los cambios de tema no dependan de cómo el generador de CSS produzca `dark:`. El early-init previene FOUC y el ThemeProvider mantiene la experiencia reactiva (incluyendo `auto`).

Archivos implicados (resumen)

- `index.html` — early-init theme script
- `src/index.css` — tokens, keyframes, utilidades
- `src/context/ThemeContext.tsx` — ThemeProvider
- `src/components/common/Parallax/Parallax.tsx` — componente parallax
- `src/components/common/Layout/Layout.tsx`, `Navbar`, `Footer`, `MovieCard`, `Home` — migrados a variables

Si quieres, puedo:
- Generar una lista automática de componentes que aún usan `dark:` de Tailwind para priorizar migración.
- Añadir un pequeño script de Node que valide la presencia de tokens nuevos en `src/index.css` y falle la CI si faltan.

Fin de documento
