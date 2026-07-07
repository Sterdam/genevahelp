import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, X } from 'lucide-react'
import { CategoryGrid } from './CategoryGrid'
import type { ResourceCategory } from '../../lib/types'

interface CategorySheetProps {
  open: boolean
  selected: ResourceCategory[]
  counts?: Partial<Record<ResourceCategory, number>>
  resultCount: number
  onChange: (categories: ResourceCategory[]) => void
  onClose: () => void
}

const ALL_CATEGORIES: ResourceCategory[] = [
  'food', 'health', 'legal', 'housing', 'language', 'clothing',
  'hygiene', 'wifi', 'education', 'employment', 'finance',
  'children', 'women', 'elderly', 'addiction', 'social', 'disability', 'emergency', 'admin',
]

export function CategorySheet({ open, selected, counts, resultCount, onChange, onClose }: CategorySheetProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  // Multi-select: each tap toggles, the map updates live behind the sheet
  const handleSelect = (category: ResourceCategory) => {
    onChange(
      selected.includes(category)
        ? selected.filter((c) => c !== category)
        : [...selected, category]
    )
  }

  const handleAll = () => onChange([])

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-slide-up flex flex-col max-h-[85dvh]">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-base font-semibold text-gray-900">{t('filters.categories')}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-3 overflow-y-auto">
          <button
            onClick={handleAll}
            className={`w-full mb-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              selected.length === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('filters.allCategories')}
          </button>
          <CategoryGrid
            categories={ALL_CATEGORIES}
            selected={selected}
            counts={counts}
            columns={3}
            onSelect={handleSelect}
          />
        </div>

        {/* Live result count doubles as the close action */}
        <div className="border-t border-gray-100 p-3 bg-white safe-area-bottom">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            {t('search.resultsCount', { count: resultCount })}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
