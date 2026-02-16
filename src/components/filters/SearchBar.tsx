import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative">
      <Search
        size={18}
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          focused ? 'text-blue-500' : 'text-gray-400'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t('search.placeholder')}
        className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          focused
            ? 'bg-white border-blue-300 shadow-sm'
            : 'bg-gray-100 border-gray-200'
        }`}
      />
      <button
        onClick={handleClear}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all ${
          value ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Clear search"
        tabIndex={value ? 0 : -1}
      >
        <X size={16} />
      </button>
    </div>
  )
}
