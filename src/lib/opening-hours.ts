// Day aliases indexed by Date.getDay() — data uses French keys, some entries English
const DAY_ALIASES: string[][] = [
  ['sunday', 'dimanche'],
  ['monday', 'lundi'],
  ['tuesday', 'mardi'],
  ['wednesday', 'mercredi'],
  ['thursday', 'jeudi'],
  ['friday', 'vendredi'],
  ['saturday', 'samedi'],
]

const STRUCTURED_DAY_KEYS = new Set(DAY_ALIASES.flat())

const TIME_RANGE_RE = /(\d{1,2})[:hH](\d{2})?\s*[-–]\s*(\d{1,2})[:hH](\d{2})?/g

/**
 * Returns whether the resource is open right now, or null when hours are
 * missing, free-text only, or unparsable (no badge shown in that case).
 */
export function isOpenNow(
  hours: Record<string, string> | null | undefined,
  now: Date = new Date()
): boolean | null {
  if (!hours) return null

  const hasStructuredDays = Object.keys(hours).some((k) =>
    STRUCTURED_DAY_KEYS.has(k.toLowerCase())
  )
  if (!hasStructuredDays) return null

  const value = DAY_ALIASES[now.getDay()]
    .map((alias) => hours[alias])
    .find(Boolean)
  if (!value) return false

  const ranges = [...value.matchAll(TIME_RANGE_RE)]
  if (ranges.length === 0) return null

  const minutes = now.getHours() * 60 + now.getMinutes()
  return ranges.some((m) => {
    const start = parseInt(m[1], 10) * 60 + parseInt(m[2] || '0', 10)
    const end = parseInt(m[3], 10) * 60 + parseInt(m[4] || '0', 10)
    return minutes >= start && minutes < end
  })
}
