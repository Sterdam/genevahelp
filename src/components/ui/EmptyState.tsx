import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <SearchX size={48} className="text-gray-300 mb-4" />
      <p className="text-gray-500 text-sm">
        {message || t('search.noResults')}
      </p>
    </div>
  )
}
