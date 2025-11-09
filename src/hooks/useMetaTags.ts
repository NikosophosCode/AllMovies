import { useEffect } from 'react'

interface MetaTags {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'movie' | 'tv.show' | 'video.movie' | 'video.tv_show'
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Hook para gestionar meta tags dinámicamente
 * Útil para SEO y compartir en redes sociales
 */
export const useMetaTags = (meta: MetaTags) => {
  useEffect(() => {
    // Actualizar title
    document.title = `${meta.title} | AllMovies`

    // Helper para actualizar o crear meta tag
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let tag = document.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        if (attribute === 'property') {
          tag.setAttribute('property', selector.match(/\[property="([^"]+)"\]/)?.[1] || '')
        } else {
          tag.setAttribute('name', selector.match(/\[name="([^"]+)"\]/)?.[1] || '')
        }
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', value)
    }

    // Meta description
    updateMetaTag('meta[name="description"]', 'name', meta.description)

    // Keywords
    if (meta.keywords && meta.keywords.length > 0) {
      updateMetaTag('meta[name="keywords"]', 'name', meta.keywords.join(', '))
    }

    // Author
    if (meta.author) {
      updateMetaTag('meta[name="author"]', 'name', meta.author)
    }

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description },
      { property: 'og:type', content: meta.type || 'website' },
      { property: 'og:url', content: meta.url || window.location.href },
      { property: 'og:site_name', content: 'AllMovies' },
      { property: 'og:locale', content: 'es_ES' },
    ]

    if (meta.image) {
      ogTags.push(
        { property: 'og:image', content: meta.image },
        { property: 'og:image:alt', content: meta.title },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' }
      )
    }

    if (meta.publishedTime) {
      ogTags.push({ property: 'article:published_time', content: meta.publishedTime })
    }

    if (meta.modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: meta.modifiedTime })
    }

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: meta.image ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: meta.title },
      { name: 'twitter:description', content: meta.description },
      { name: 'twitter:site', content: '@allmovies' },
      { name: 'twitter:creator', content: '@allmovies' },
    ]

    if (meta.image) {
      twitterTags.push(
        { name: 'twitter:image', content: meta.image },
        { name: 'twitter:image:alt', content: meta.title }
      )
    }

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = meta.url || window.location.href

    // JSON-LD Schema (para rich snippets)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': meta.type === 'movie' ? 'Movie' : 'WebPage',
      name: meta.title,
      description: meta.description,
      url: meta.url || window.location.href,
      ...(meta.image && { image: meta.image }),
    }

    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(jsonLd)

  }, [meta])
}
