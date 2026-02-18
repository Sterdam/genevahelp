import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  canonical: string
  ogType?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * SEO head component using React 19 native metadata hoisting.
 * Renders <title>, <meta>, <link> directly — React 19 hoists them to <head>.
 * Uses useEffect for JSON-LD script injection.
 */
export function SEOHead({ title, description, canonical, ogType = 'website', noindex, jsonLd }: SEOHeadProps) {
  // JSON-LD must be injected via useEffect since React 19 doesn't hoist <script> with type="application/ld+json"
  useEffect(() => {
    if (!jsonLd) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'dynamic'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [jsonLd])

  const desc = description.slice(0, 160)

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content="GenevaHelp" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
    </>
  )
}
