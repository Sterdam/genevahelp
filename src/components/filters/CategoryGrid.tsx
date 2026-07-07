import { useTranslation } from 'react-i18next'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../../lib/constants'
import type { ResourceCategory } from '../../lib/types'

interface CategoryGridProps {
  categories: ResourceCategory[]
  selected?: ResourceCategory[]
  counts?: Partial<Record<ResourceCategory, number>>
  columns?: 2 | 3
  onSelect: (category: ResourceCategory) => void
}

export function CategoryGrid({ categories, selected = [], counts, columns = 2, onSelect }: CategoryGridProps) {
  const { t } = useTranslation()

  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat]
        const emoji = CATEGORY_EMOJI[cat]
        const isActive = selected.includes(cat)
        const count = counts?.[cat]

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 transition-all active:scale-[0.97] ${
              columns === 3 ? 'py-2.5' : 'py-3'
            } ${isActive ? 'text-white shadow-sm' : 'hover:shadow-sm'}`}
            style={
              isActive
                ? { backgroundColor: config.color, borderColor: config.color }
                : { backgroundColor: `${config.color}0d`, borderColor: `${config.color}30` }
            }
          >
            <span className={columns === 3 ? 'text-xl' : 'text-2xl'}>{emoji}</span>
            <span
              className={`font-medium leading-tight text-center ${columns === 3 ? 'text-[11px]' : 'text-xs'} ${
                isActive ? 'text-white' : 'text-gray-700'
              }`}
            >
              {t(`categories.${cat}`)}
              {count != null && count > 0 && (
                <span className={`ms-1 ${isActive ? 'opacity-75' : 'opacity-50'}`}>{count}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
