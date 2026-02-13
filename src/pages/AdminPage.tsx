import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  Database,
  Flag,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Trash2,
  Eye,
  MapPin,
  Shield,
  Plus,
  Mail,
  Phone,
  Globe,
  User,
} from 'lucide-react'
import { login, logout, isAuthenticated } from '../lib/auth'
import { getReports, resolveReport, dismissReport, deleteReport, REPORT_REASONS } from '../lib/reports'
import { verifyResource, getAllVerifications, getFreshness, getFreshnessConfig } from '../lib/verification'
import { getSuggestions, approveSuggestion, rejectSuggestion, deleteSuggestion, type ResourceSuggestion } from '../lib/suggestions'
import { DEMO_RESOURCES } from '../lib/demo-data'
import { CATEGORY_CONFIG } from '../lib/constants'
import type { Report } from '../lib/types'

type Tab = 'dashboard' | 'resources' | 'reports' | 'suggestions'

export function AdminPage() {
  const [authed, setAuthed] = useState(isAuthenticated())

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />
  }

  return <AdminDashboard onLogout={() => { logout(); setAuthed(false) }} />
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{t('admin.login')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false) }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              {t('admin.loginError')}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            {t('admin.loginButton')}
          </button>
        </form>
      </div>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [reports, setReports] = useState<Report[]>(getReports())
  const [suggestions, setSuggestions] = useState<ResourceSuggestion[]>(getSuggestions())

  const refreshReports = () => setReports(getReports())
  const refreshSuggestions = () => setSuggestions(getSuggestions())

  const pendingReports = reports.filter((r) => r.status === 'pending')
  const resolvedReports = reports.filter((r) => r.status !== 'pending')
  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending')

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
    { id: 'resources', label: t('admin.resources'), icon: Database },
    { id: 'suggestions', label: t('admin.suggestions'), icon: Plus, count: pendingSuggestions.length },
    { id: 'reports', label: t('admin.reports'), icon: Flag, count: pendingReports.length },
  ]

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Admin header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} />
          <span className="font-semibold text-sm">{t('admin.login')}</span>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <LogOut size={14} />
          {t('admin.logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              tab === t.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={16} />
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'dashboard' && (
          <DashboardView
            totalResources={DEMO_RESOURCES.length}
            pendingCount={pendingReports.length}
            resolvedCount={resolvedReports.length}
            pendingSuggestionsCount={pendingSuggestions.length}
            t={t}
          />
        )}
        {tab === 'resources' && <ResourcesView t={t} />}
        {tab === 'suggestions' && (
          <SuggestionsView
            suggestions={suggestions}
            onApprove={(id) => { approveSuggestion(id); refreshSuggestions() }}
            onReject={(id) => { rejectSuggestion(id); refreshSuggestions() }}
            onDelete={(id) => { deleteSuggestion(id); refreshSuggestions() }}
            t={t}
          />
        )}
        {tab === 'reports' && (
          <ReportsView
            reports={reports}
            onResolve={(id) => { resolveReport(id); refreshReports() }}
            onDismiss={(id) => { dismissReport(id); refreshReports() }}
            onDelete={(id) => { deleteReport(id); refreshReports() }}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

function DashboardView({
  totalResources,
  pendingCount,
  resolvedCount,
  pendingSuggestionsCount,
  t,
}: {
  totalResources: number
  pendingCount: number
  resolvedCount: number
  pendingSuggestionsCount: number
  t: (key: string) => string
}) {
  const verifications = getAllVerifications()
  const verifiedCount = DEMO_RESOURCES.filter((r) => verifications[r.id]).length
  const unverifiedCount = totalResources - verifiedCount

  const stats = [
    { label: t('admin.totalResources'), value: totalResources, icon: Database, color: 'bg-blue-50 text-blue-600' },
    { label: t('admin.pendingSuggestions'), value: pendingSuggestionsCount, icon: Plus, color: 'bg-purple-50 text-purple-600' },
    { label: t('admin.pendingReports'), value: pendingCount, icon: Flag, color: 'bg-red-50 text-red-600' },
    { label: t('admin.needsVerification'), value: unverifiedCount, icon: Clock, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Ressources par catégorie</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
            const count = DEMO_RESOURCES.filter((r) => r.category === cat).length
            if (count === 0) return null
            return (
              <div key={cat} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-gray-600 truncate">{config.label}</span>
                <span className="text-gray-900 font-medium ml-auto">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ResourcesView({ t }: { t: (key: string) => string }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unverified' | 'stale'>('all')
  const [, forceUpdate] = useState(0)

  const filtered = useMemo(() => {
    let result = DEMO_RESOURCES

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.category.includes(q) || r.address.toLowerCase().includes(q)
      )
    }

    if (filter === 'unverified') {
      result = result.filter((r) => getFreshness(r.id) === 'unknown')
    } else if (filter === 'stale') {
      result = result.filter((r) => {
        const f = getFreshness(r.id)
        return f === 'stale' || f === 'aging'
      })
    }

    return result
  }, [search, filter])

  const handleVerify = (resourceId: string) => {
    verifyResource(resourceId)
    forceUpdate((n) => n + 1)
  }

  const verifications = getAllVerifications()
  const unverifiedCount = DEMO_RESOURCES.filter((r) => !verifications[r.id]).length

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.searchResources')}
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'unverified' | 'stale')}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="all">Tous ({DEMO_RESOURCES.length})</option>
          <option value="unverified">Non vérifiés ({unverifiedCount})</option>
          <option value="stale">À revérifier</option>
        </select>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} ressources</p>

      <div className="space-y-1.5">
        {filtered.map((resource) => {
          const config = CATEGORY_CONFIG[resource.category]
          const freshness = getFreshness(resource.id)
          const freshnessConfig = getFreshnessConfig(freshness)
          const verification = verifications[resource.id]

          return (
            <div
              key={resource.id}
              className="bg-white rounded-lg border border-gray-200 px-3 py-2.5 flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <config.icon size={16} style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{resource.name}</p>
                  {freshness === 'fresh' && <CheckCircle size={12} className="text-green-500 shrink-0" />}
                  {freshness === 'aging' && <Clock size={12} className="text-amber-500 shrink-0" />}
                  {freshness === 'stale' && <AlertTriangle size={12} className="text-red-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span style={{ color: config.color }}>{config.label}</span>
                  {verification && (
                    <span className={`${freshnessConfig.color}`}>
                      {new Date(verification.verified_at).toLocaleDateString('fr-CH')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleVerify(resource.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                  freshness === 'fresh'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 bg-gray-50 hover:bg-green-50 hover:text-green-600'
                }`}
                title={t('admin.verify')}
              >
                <CheckCircle size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReportsView({
  reports,
  onResolve,
  onDismiss,
  onDelete,
  t,
}: {
  reports: Report[]
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  onDelete: (id: string) => void
  t: (key: string) => string
}) {
  const pending = reports.filter((r) => r.status === 'pending')
  const resolved = reports.filter((r) => r.status !== 'pending')

  if (reports.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Flag size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{t('admin.noReports')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pending reports */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Flag size={14} className="text-red-500" />
            {t('admin.pendingReports')} ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((report) => (
              <ReportCard key={report.id} report={report} onResolve={onResolve} onDismiss={onDismiss} onDelete={onDelete} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved reports */}
      {resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <CheckCircle size={14} />
            {t('admin.resolvedReports')} ({resolved.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {resolved.map((report) => (
              <ReportCard key={report.id} report={report} onResolve={onResolve} onDismiss={onDismiss} onDelete={onDelete} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReportCard({
  report,
  onResolve,
  onDismiss,
  onDelete,
  t,
}: {
  report: Report
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  onDelete: (id: string) => void
  t: (key: string) => string
}) {
  const reasonLabel = REPORT_REASONS.find((r) => r.value === report.reason)?.labelFr || report.reason
  const isPending = report.status === 'pending'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{report.resource_name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isPending ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {reasonLabel}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(report.created_at).toLocaleDateString('fr-CH')}
            </span>
          </div>
          {report.message && (
            <p className="text-xs text-gray-500 mt-1.5 italic">"{report.message}"</p>
          )}
        </div>

        {isPending ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onResolve(report.id)}
              className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              {t('admin.resolve')}
            </button>
            <button
              onClick={() => onDismiss(report.id)}
              className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('admin.dismiss')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onDelete(report.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ========== Suggestions View ========== */

function SuggestionsView({
  suggestions,
  onApprove,
  onReject,
  onDelete,
  t,
}: {
  suggestions: ResourceSuggestion[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  t: (key: string) => string
}) {
  const pending = suggestions.filter((s) => s.status === 'pending')
  const reviewed = suggestions.filter((s) => s.status !== 'pending')

  if (suggestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Plus size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{t('admin.noSuggestions')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Plus size={14} className="text-purple-500" />
            {t('admin.pendingSuggestions')} ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onApprove={onApprove} onReject={onReject} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <CheckCircle size={14} />
            {t('admin.reviewedSuggestions')} ({reviewed.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {reviewed.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onApprove={onApprove} onReject={onReject} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SuggestionCard({
  suggestion: s,
  onApprove,
  onReject,
  onDelete,
}: {
  suggestion: ResourceSuggestion
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isPending = s.status === 'pending'
  const catConfig = s.category ? CATEGORY_CONFIG[s.category] : null

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
              {catConfig && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
                >
                  {catConfig.label}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                s.status === 'approved' ? 'bg-green-100 text-green-700' :
                s.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {s.status === 'approved' ? 'Approuvé' : s.status === 'rejected' ? 'Rejeté' : 'En attente'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {s.address && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={11} className="shrink-0" />
                  {s.address}
                </span>
              )}
              <span>{new Date(s.created_at).toLocaleDateString('fr-CH')}</span>
            </div>
            {s.description && (
              <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{s.description}</p>
            )}
          </div>

          {isPending ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onApprove(s.id)}
                className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                Approuver
              </button>
              <button
                onClick={() => onReject(s.id)}
                className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Rejeter
              </button>
            </div>
          ) : (
            <button
              onClick={() => onDelete(s.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Masquer les détails' : 'Voir tous les détails'}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-3 py-3 bg-gray-50 space-y-2">
          {/* Contact info of the resource */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {s.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Phone size={11} className="text-gray-400" />
                {s.phone}
              </div>
            )}
            {s.email && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Mail size={11} className="text-gray-400" />
                {s.email}
              </div>
            )}
            {s.website && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Globe size={11} className="text-gray-400" />
                <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate">
                  {s.website}
                </a>
              </div>
            )}
          </div>

          {s.opening_hours && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Horaires</p>
              <p className="text-xs text-gray-600 whitespace-pre-line">{s.opening_hours}</p>
            </div>
          )}
          {s.target_audience && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Public cible</p>
              <p className="text-xs text-gray-600">{s.target_audience}</p>
            </div>
          )}
          {s.access_conditions && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Conditions d'accès</p>
              <p className="text-xs text-gray-600">{s.access_conditions}</p>
            </div>
          )}
          {s.languages_spoken && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Langues</p>
              <p className="text-xs text-gray-600">{s.languages_spoken}</p>
            </div>
          )}
          {s.wheelchair_accessible != null && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Accessible PMR</p>
              <p className="text-xs text-gray-600">{s.wheelchair_accessible ? 'Oui' : 'Non'}</p>
            </div>
          )}

          {/* Submitter info - highlighted */}
          <div className="bg-white rounded-lg border border-gray-200 p-2.5 mt-2">
            <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <User size={12} />
              Soumis par
            </p>
            <div className="space-y-0.5">
              {s.submitter_name && (
                <p className="text-xs text-gray-600">{s.submitter_name}</p>
              )}
              <p className="text-xs text-blue-600 font-medium">{s.submitter_contact}</p>
              {s.submitter_relation && (
                <p className="text-xs text-gray-500 italic">
                  {s.submitter_relation === 'user' ? 'Utilise ce lieu' :
                   s.submitter_relation === 'staff' ? 'Travaille / bénévole' :
                   s.submitter_relation === 'organization' ? 'Représente l\'organisation' :
                   'Autre'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
