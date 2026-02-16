import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="animate-float">
        <SearchX size={48} className="text-gray-300 mb-4" />
      </div>
      <p className="text-gray-500 text-sm">
        {message || t('search.noResults')}
      </p>
      <p className="text-gray-400 text-xs mt-1">
        {t('search.noResultsHint')}
      </p>
    </div>
  )
}
