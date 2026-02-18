/**
 * Post-build script to generate:
 * - sitemap.xml
 * - llms.txt (summary for AI crawlers)
 * - llms-full.txt (complete resource directory)
 *
 * Run after `vite build` — reads demo-data.ts to extract resources.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const BASE_URL = 'https://genevahelp.ch'

// --- Parse resource data from demo-data.ts ---

function extractResources() {
  const raw = readFileSync(join(ROOT, 'src/lib/demo-data.ts'), 'utf-8')

  // Extract each resource object with id, name, description, category, address, phone
  const resources = []
  const idRegex = /id:\s*'([^']+)'/g
  const nameRegex = /name:\s*'([^']*(?:\\.[^']*)*)'/g
  const descRegex = /description:\s*'([^']*(?:\\.[^']*)*)'/g
  const catRegex = /category:\s*'([^']+)'/g
  const addrRegex = /address:\s*'([^']*(?:\\.[^']*)*)'/g
  const phoneRegex = /phone:\s*(?:'([^']*)'|null)/g

  let idMatch, nameMatch, descMatch, catMatch, addrMatch, phoneMatch
  while (
    (idMatch = idRegex.exec(raw)) &&
    (nameMatch = nameRegex.exec(raw)) &&
    (descMatch = descRegex.exec(raw)) &&
    (catMatch = catRegex.exec(raw)) &&
    (addrMatch = addrRegex.exec(raw))
  ) {
    phoneMatch = phoneRegex.exec(raw)
    const unescape = (s) => s.replace(/\\'/g, "'").replace(/\\n/g, ' ').replace(/\\\\/g, '\\')
    resources.push({
      id: idMatch[1],
      name: unescape(nameMatch[1]),
      description: unescape(descMatch[1]),
      category: catMatch[1],
      address: unescape(addrMatch[1]),
      phone: phoneMatch?.[1] || null,
    })
  }

  return resources
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function extractIdNum(id) {
  const match = id.match(/-(\d{4})-4000-/)
  return match ? match[1] : id.slice(0, 8)
}

function resourceSlug(r) {
  return `${slugify(r.name)}-${extractIdNum(r.id)}`
}

// --- Generate sitemap.xml ---

function generateSitemap(resources) {
  const categories = [...new Set(resources.map((r) => r.category))]
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    // Static pages
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.6' },
    { loc: '/emergency', changefreq: 'weekly', priority: '0.9' },

    // Category pages
    ...categories.map((cat) => ({
      loc: `/category/${cat}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),

    // Resource pages
    ...resources.map((r) => ({
      loc: `/resource/${resourceSlug(r)}`,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`

  writeFileSync(join(DIST, 'sitemap.xml'), xml)
  console.log(`  sitemap.xml: ${urls.length} URLs`)
}

// --- Generate llms.txt ---

function generateLlmsTxt(resources) {
  const categories = [...new Set(resources.map((r) => r.category))]
  const categoryCounts = {}
  for (const r of resources) {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1
  }

  const content = `# GenevaHelp — Free Resources in Geneva

> GenevaHelp is a free, open-source interactive map listing all free resources available in Geneva, Switzerland. It covers food aid, health, housing, legal help, language courses, and more.

## Quick Facts
- ${resources.length} verified resources
- ${categories.length} categories
- 32 languages supported
- Fully free and open-source

## Categories
${categories.map((cat) => `- ${cat}: ${categoryCounts[cat]} resources`).join('\n')}

## Key URLs
- Homepage: ${BASE_URL}/
- Emergency help: ${BASE_URL}/emergency
- About: ${BASE_URL}/about
- Suggest a resource: ${BASE_URL}/suggest
${categories.map((cat) => `- ${cat}: ${BASE_URL}/category/${cat}`).join('\n')}

## For more details
See llms-full.txt for the complete resource directory with addresses, phones, and descriptions.
`

  writeFileSync(join(DIST, 'llms.txt'), content)
  console.log(`  llms.txt: ${content.length} bytes`)
}

// --- Generate llms-full.txt ---

function generateLlmsFullTxt(resources) {
  const categories = [...new Set(resources.map((r) => r.category))]

  let content = `# GenevaHelp — Complete Resource Directory
# ${resources.length} free resources in Geneva, Switzerland
# Last updated: ${new Date().toISOString().split('T')[0]}
# Website: ${BASE_URL}

`

  for (const cat of categories.sort()) {
    const catResources = resources.filter((r) => r.category === cat)
    content += `\n## ${cat.toUpperCase()} (${catResources.length} resources)\n\n`

    for (const r of catResources) {
      content += `### ${r.name}\n`
      content += `- Category: ${r.category}\n`
      content += `- Address: ${r.address}\n`
      if (r.phone) content += `- Phone: ${r.phone}\n`
      content += `- Description: ${r.description.slice(0, 200)}\n`
      content += `- URL: ${BASE_URL}/resource/${resourceSlug(r)}\n`
      content += `\n`
    }
  }

  writeFileSync(join(DIST, 'llms-full.txt'), content)
  console.log(`  llms-full.txt: ${content.length} bytes`)
}

// --- Main ---

console.log('Generating SEO files...')
const resources = extractResources()
console.log(`  Found ${resources.length} resources`)
generateSitemap(resources)
generateLlmsTxt(resources)
generateLlmsFullTxt(resources)
console.log('Done!')
