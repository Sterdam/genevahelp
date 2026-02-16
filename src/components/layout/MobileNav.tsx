import { useTranslation } from 'react-i18next'
import { Map, List, Plus, Info } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface MobileNavProps {
  view: 'map' | 'list'
  onViewChange: (view: 'map' | 'list') => void
}

export function MobileNav({ view, onViewChange }: MobileNavProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const NavItem = ({
    icon: IconComponent,
    label,
    active,
    onClick,
    to,
  }: {
    icon: typeof Map
    label: string
    active?: boolean
    onClick?: () => void
    to?: string
  }) => {
    const className = `flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
      active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
    }`

    const content = (
      <>
        <IconComponent size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
        {active && (
          <span className="w-1 h-1 rounded-full bg-blue-600 animate-scale-in" />
        )}
      </>
    )

    if (to) {
      return (
        <Link to={to} className={className}>
          {content}
        </Link>
      )
    }

    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2 max-w-md mx-auto">
        {isHome ? (
          <>
            <NavItem
              icon={Map}
              label={t('nav.map')}
              active={view === 'map'}
              onClick={() => onViewChange('map')}
            />
            <NavItem
              icon={List}
              label={t('nav.list')}
              active={view === 'list'}
              onClick={() => onViewChange('list')}
            />
          </>
        ) : (
          <>
            <NavItem icon={Map} label={t('nav.map')} to="/" />
            <NavItem icon={List} label={t('nav.list')} to="/" />
          </>
        )}
        <NavItem
          icon={Plus}
          label={t('nav.suggest')}
          active={location.pathname === '/suggest'}
          to="/suggest"
        />
        <NavItem
          icon={Info}
          label={t('nav.about')}
          active={location.pathname === '/about'}
          to="/about"
        />
      </div>
    </nav>
  )
}
