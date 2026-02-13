const VERIFICATION_KEY = 'genevemap_verifications'

interface VerificationRecord {
  resource_id: string
  verified_at: string
  verified_by: string
  notes?: string
}

function getVerifications(): Record<string, VerificationRecord> {
  try {
    const raw = localStorage.getItem(VERIFICATION_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveVerifications(data: Record<string, VerificationRecord>): void {
  localStorage.setItem(VERIFICATION_KEY, JSON.stringify(data))
}

export function verifyResource(resourceId: string, notes?: string): void {
  const data = getVerifications()
  data[resourceId] = {
    resource_id: resourceId,
    verified_at: new Date().toISOString(),
    verified_by: 'admin',
    notes,
  }
  saveVerifications(data)
}

export function getVerification(resourceId: string): VerificationRecord | null {
  return getVerifications()[resourceId] || null
}

export function getAllVerifications(): Record<string, VerificationRecord> {
  return getVerifications()
}

export type FreshnessLevel = 'fresh' | 'aging' | 'stale' | 'unknown'

export function getFreshness(resourceId: string): FreshnessLevel {
  const verification = getVerification(resourceId)
  if (!verification) return 'unknown'

  const daysSince = (Date.now() - new Date(verification.verified_at).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSince < 30) return 'fresh'
  if (daysSince < 90) return 'aging'
  return 'stale'
}

export function getFreshnessConfig(level: FreshnessLevel) {
  switch (level) {
    case 'fresh':
      return { color: 'text-green-600', bg: 'bg-green-100', label: 'Vérifié récemment', labelEn: 'Recently verified' }
    case 'aging':
      return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'À revérifier bientôt', labelEn: 'Due for re-verification' }
    case 'stale':
      return { color: 'text-red-600', bg: 'bg-red-100', label: 'Vérification expirée', labelEn: 'Verification expired' }
    case 'unknown':
      return { color: 'text-gray-400', bg: 'bg-gray-100', label: 'Non vérifié', labelEn: 'Not verified' }
  }
}

/** Resources that need verification (never verified or stale), sorted oldest first */
export function getResourcesNeedingVerification(resourceIds: string[]): string[] {
  const verifications = getVerifications()
  return resourceIds
    .map((id) => ({ id, record: verifications[id] }))
    .filter(({ record }) => !record || getFreshness(record.resource_id) === 'stale')
    .sort((a, b) => {
      if (!a.record) return -1
      if (!b.record) return 1
      return new Date(a.record.verified_at).getTime() - new Date(b.record.verified_at).getTime()
    })
    .map(({ id }) => id)
}
