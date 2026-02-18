import type { Resource } from './types'

const BASE_URL = 'https://genevahelp.ch'

/** Strip accents, lowercase, hyphens — URL-friendly slug */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Extract 4-digit number from resource ID (e.g. "a1b2c3d4-0001-4000-..." → "0001") */
function extractIdNum(id: string): string {
  const match = id.match(/-(\d{4})-4000-/)
  return match ? match[1] : id.slice(0, 8)
}

/** Generate a unique slug for a resource: "{slugified-name}-{4digit-id}" */
export function resourceSlug(resource: Resource): string {
  return `${slugify(resource.name)}-${extractIdNum(resource.id)}`
}

/** Extract the ID number from a resource slug */
export function resourceNumFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d{4})$/)
  return match ? match[1] : null
}

/** Find a resource by slug from a list */
export function findResourceBySlug(resources: Resource[], slug: string): Resource | null {
  const num = resourceNumFromSlug(slug)
  if (!num) return null
  return resources.find((r) => extractIdNum(r.id) === num) ?? null
}

/** Generate category slug */
export function categorySlug(category: string): string {
  return slugify(category)
}

/** Build full canonical URL */
export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`
}

export { BASE_URL }
