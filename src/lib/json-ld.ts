import type { Resource, ResourceCategory } from './types'
import { resourceSlug, canonicalUrl, BASE_URL } from './seo-utils'
import { CATEGORY_EMOJI } from './constants'

const DAY_MAP: Record<string, string> = {
  lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday',
  jeudi: 'Thursday', vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday',
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

/** Build LocalBusiness/CivicStructure JSON-LD for a single resource */
export function buildResourceJsonLd(resource: Resource): Record<string, unknown> {
  const url = canonicalUrl(`/resource/${resourceSlug(resource)}`)

  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': resource.category === 'health' ? 'MedicalOrganization'
      : resource.category === 'legal' ? 'LegalService'
      : resource.category === 'education' || resource.category === 'language' ? 'EducationalOrganization'
      : 'CivicStructure',
    name: resource.name,
    description: resource.description,
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: resource.address,
      addressLocality: 'Geneva',
      addressRegion: 'GE',
      addressCountry: 'CH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: resource.latitude,
      longitude: resource.longitude,
    },
    isAccessibleForFree: true,
  }

  if (resource.phone) result.telephone = resource.phone
  if (resource.email) result.email = resource.email
  if (resource.website) result.sameAs = resource.website

  // Opening hours
  const specs: string[] = []
  for (const [key, value] of Object.entries(resource.opening_hours)) {
    if (key === 'notes') continue
    const day = DAY_MAP[key.toLowerCase()]
    if (!day || !value) continue
    // Parse "11:30-13:00, 18:00-19:30" format
    const times = value.split(',').map((t: string) => t.trim())
    for (const time of times) {
      specs.push(`${day.slice(0, 2)} ${time}`)
    }
  }
  if (specs.length > 0) result.openingHours = specs

  if (resource.wheelchair_accessible != null) {
    result.publicAccess = true
  }

  return result
}

/** Build ItemList JSON-LD for a category page */
export function buildCategoryJsonLd(
  _category: ResourceCategory,
  categoryLabel: string,
  resources: Resource[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Free ${categoryLabel} in Geneva`,
    description: `${resources.length} free ${categoryLabel.toLowerCase()} resources in Geneva`,
    numberOfItems: resources.length,
    itemListElement: resources.slice(0, 30).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      url: canonicalUrl(`/resource/${resourceSlug(r)}`),
    })),
  }
}

/** Build FAQPage JSON-LD */
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** Build BreadcrumbList JSON-LD */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Build WebSite JSON-LD with SearchAction */
export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GenevaHelp',
    url: BASE_URL,
    description: 'Interactive map of all free resources in Geneva',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** Map category key to emoji for display */
export function getCategoryEmoji(category: ResourceCategory): string {
  return CATEGORY_EMOJI[category] || '📍'
}
