import { useTranslation } from 'react-i18next'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../../lib/constants'
import type { ResourceCategory } from '../../lib/types'

interface CategoryFilterProps {
  selected: ResourceCategory[]
  onChange: (categories: ResourceCategory[]) => void
  counts?: Record<ResourceCategory, number>
}

const VISIBLE_CATEGORIES: ResourceCategory[] = [
  'food', 'health', 'legal', 'housing', 'language', 'clothing',
  'hygiene', 'wifi', 'education', 'employment', 'finance',
  'children', 'women', 'elderly', 'addiction', 'social', 'disability', 'emergency', 'admin',
]

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  const { t } = useTranslation()

  const toggle = (category: ResourceCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category))
    } else {
      onChange([...selected, category])
    }
  }

  const clearAll = () => onChange([])

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={clearAll}
        className={`category-pill shrink-0 ${
          selected.length === 0
            ? 'bg-blue-600 text-white border-blue-600'
            : 'category-pill--inactive'
        }`}
      >
        {t('filters.allCategories')}
      </button>

      {VISIBLE_CATEGORIES.map((cat) => {
        const config = CATEGORY_CONFIG[cat]
        const emoji = CATEGORY_EMOJI[cat]
        const isActive = selected.includes(cat)
        const count = counts?.[cat]

        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`category-pill shrink-0 ${
              isActive ? 'category-pill--active' : 'category-pill--inactive'
            }`}
            style={
              isActive
                ? { backgroundColor: config.color, borderColor: config.color }
                : undefined
            }
          >
            <span>{emoji}</span>
            {t(`categories.${cat}`)}
            {count != null && count > 0 && (
              <span className={`text-[10px] ${isActive ? 'opacity-75' : 'opacity-50'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
