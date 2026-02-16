import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Resource } from '../lib/types'

function getResourceKey(id: string): string {
  const match = id.match(/-(\d{4})-4000-/)
  return match ? `r_${match[1]}` : id
}

export function useTranslatedResources(resources: Resource[]): Resource[] {
  const { t, i18n } = useTranslation('resources')

  return useMemo(() => {
    if (i18n.language === 'fr') return resources

    return resources.map((resource) => {
      const key = getResourceKey(resource.id)
      const description = t(`${key}.description`, { defaultValue: resource.description })
      const target_audience = resource.target_audience
        ? t(`${key}.target_audience`, { defaultValue: resource.target_audience })
        : null
      const access_conditions = resource.access_conditions
        ? t(`${key}.access_conditions`, { defaultValue: resource.access_conditions })
        : null
      const tags = resource.tags.map((tag) =>
        t(`tag.${tag}`, { defaultValue: tag })
      )

      return { ...resource, description, target_audience, access_conditions, tags }
    })
  }, [resources, i18n.language, t])
}

export function useTranslatedResource(resource: Resource | null): Resource | null {
  const { t, i18n } = useTranslation('resources')

  return useMemo(() => {
    if (!resource || i18n.language === 'fr') return resource

    const key = getResourceKey(resource.id)
    const description = t(`${key}.description`, { defaultValue: resource.description })
    const target_audience = resource.target_audience
      ? t(`${key}.target_audience`, { defaultValue: resource.target_audience })
      : null
    const access_conditions = resource.access_conditions
      ? t(`${key}.access_conditions`, { defaultValue: resource.access_conditions })
      : null
    const tags = resource.tags.map((tag) =>
      t(`tag.${tag}`, { defaultValue: tag })
    )

    return { ...resource, description, target_audience, access_conditions, tags }
  }, [resource, i18n.language, t])
}
