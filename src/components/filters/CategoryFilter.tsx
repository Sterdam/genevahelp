import { useTranslation } from 'react-i18next'
import { CATEGORY_CONFIG } from '../../lib/constants'
import type { ResourceCategory } from '../../lib/types'

interface CategoryFilterProps {
  selected: ResourceCategory[]
  onChange: (categories: ResourceCategory[]) => void
}

const VISIBLE_CATEGORIES: ResourceCategory[] = [
  'food', 'health', 'legal', 'housing', 'language', 'clothing',
  'hygiene', 'wifi', 'education', 'employment', 'finance',
  'children', 'women', 'elderly', 'addiction', 'social', 'emergency', 'admin',
]

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

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
        const Icon = config.icon
        const isActive = selected.includes(cat)
        const label = lang === 'en' ? config.labelEn : config.label

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
            <Icon size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
