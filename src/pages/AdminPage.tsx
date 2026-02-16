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
  MapPin,
  Shield,
  Plus,
  Mail,
  Phone,
  Globe,
  User,
  Pencil,
  EyeOff,
  Eye,
  Save,
} from 'lucide-react'
import { login, logout, isAuthenticated } from '../lib/auth'
import { getReports, resolveReport, dismissReport, deleteReport, REPORT_REASONS } from '../lib/reports'
import { verifyResource, getAllVerifications, getFreshness } from '../lib/verification'
import { getSuggestions, approveSuggestion, rejectSuggestion, deleteSuggestion, type ResourceSuggestion } from '../lib/suggestions'
import {
  getAllAdminResources,
  getHiddenIds,
  toggleHideResource,
  deleteResource as adminDeleteResource,
  editResource,
  addResource,
  CATEGORY_OPTIONS,
} from '../lib/resource-admin'
import { CATEGORY_CONFIG } from '../lib/constants'
import type { Resource, ResourceCategory, Report } from '../lib/types'

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
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              tab === tabItem.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tabItem.icon size={16} />
            {tabItem.label}
            {tabItem.count != null && tabItem.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                {tabItem.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'dashboard' && (
          <DashboardView
            pendingCount={pendingReports.length}
            pendingSuggestionsCount={pendingSuggestions.length}
          />
        )}
        {tab === 'resources' && <ResourcesView />}
        {tab === 'suggestions' && (
          <SuggestionsView
            suggestions={suggestions}
            onApprove={(id) => { approveSuggestion(id); refreshSuggestions() }}
            onReject={(id) => { rejectSuggestion(id); refreshSuggestions() }}
            onDelete={(id) => { deleteSuggestion(id); refreshSuggestions() }}
          />
        )}
        {tab === 'reports' && (
          <ReportsView
            reports={reports}
            onResolve={(id) => { resolveReport(id); refreshReports() }}
            onDismiss={(id) => { dismissReport(id); refreshReports() }}
            onDelete={(id) => { deleteReport(id); refreshReports() }}
          />
        )}
      </div>
    </div>
  )
}

function DashboardView({
  pendingCount,
  pendingSuggestionsCount,
}: {
  pendingCount: number
  pendingSuggestionsCount: number
}) {
  const { t } = useTranslation()
  const allResources = getAllAdminResources()
  const totalResources = allResources.length
  const verifications = getAllVerifications()
  const verifiedCount = allResources.filter((r) => verifications[r.id]).length
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
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('adminExtra.categoryBreakdown')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
            const count = allResources.filter((r) => r.category === cat).length
            if (count === 0) return null
            return (
              <div key={cat} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-gray-600 truncate">{t(`categories.${cat}`)}</span>
                <span className="text-gray-900 font-medium ml-auto">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ResourcesView() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'hidden' | 'unverified'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [, forceUpdate] = useState(0)

  const refresh = () => forceUpdate((n) => n + 1)

  const allResources = getAllAdminResources()
  const hiddenIds = getHiddenIds()

  const filtered = useMemo(() => {
    let result = allResources

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.category.includes(q) || r.address.toLowerCase().includes(q)
      )
    }

    if (filter === 'hidden') {
      result = result.filter((r) => hiddenIds.has(r.id))
    } else if (filter === 'unverified') {
      result = result.filter((r) => getFreshness(r.id) === 'unknown')
    }

    return result
  }, [search, filter, allResources, hiddenIds])

  const handleVerify = (id: string) => { verifyResource(id); refresh() }
  const handleHide = (id: string) => { toggleHideResource(id); refresh() }
  const handleDelete = (id: string) => {
    if (!confirm('Supprimer cette ressource ?')) return
    adminDeleteResource(id)
    refresh()
  }

  const hiddenCount = hiddenIds.size

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {/* Toolbar */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">Tous ({allResources.length})</option>
          <option value="hidden">Masqués ({hiddenCount})</option>
          <option value="unverified">Non vérifiés</option>
        </select>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null) }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} ressources</p>

      {/* Add / Edit Form */}
      {(showAddForm || editingId) && (
        <ResourceForm
          resource={editingId ? allResources.find((r) => r.id === editingId) : undefined}
          onSave={(data) => {
            if (editingId) {
              editResource(editingId, data)
            } else {
              addResource(data as Parameters<typeof addResource>[0])
            }
            setEditingId(null)
            setShowAddForm(false)
            refresh()
          }}
          onCancel={() => { setEditingId(null); setShowAddForm(false) }}
          t={t}
        />
      )}

      {/* Resource list */}
      <div className="space-y-1.5">
        {filtered.map((resource) => {
          const config = CATEGORY_CONFIG[resource.category]
          const isHidden = hiddenIds.has(resource.id)
          const freshness = getFreshness(resource.id)

          return (
            <div
              key={resource.id}
              className={`bg-white rounded-lg border px-3 py-2.5 flex items-center gap-3 ${
                isHidden ? 'border-amber-200 bg-amber-50/30 opacity-60' : 'border-gray-200'
              }`}
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
                  {isHidden && <EyeOff size={12} className="text-amber-500 shrink-0" />}
                  {freshness === 'fresh' && <CheckCircle size={12} className="text-green-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span style={{ color: config.color }}>{t(`categories.${resource.category}`)}</span>
                  <span className="truncate">{resource.address}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => handleVerify(resource.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    freshness === 'fresh' ? 'text-green-500' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'
                  }`}
                  title="Vérifier"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => { setEditingId(resource.id); setShowAddForm(false) }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleHide(resource.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isHidden ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                  title={isHidden ? 'Rendre visible' : 'Masquer'}
                >
                  {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ========== Resource Form (Add / Edit) ========== */

interface ResourceFormProps {
  resource?: Resource
  onSave: (data: Partial<Resource>) => void
  onCancel: () => void
  t: (key: string) => string
}

function ResourceForm({ resource, onSave, onCancel, t }: ResourceFormProps) {
  const [name, setName] = useState(resource?.name || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [category, setCategory] = useState<ResourceCategory>(resource?.category || 'food')
  const [address, setAddress] = useState(resource?.address || '')
  const [latitude, setLatitude] = useState(resource?.latitude?.toString() || '46.2044')
  const [longitude, setLongitude] = useState(resource?.longitude?.toString() || '6.1432')
  const [phone, setPhone] = useState(resource?.phone || '')
  const [email, setEmail] = useState(resource?.email || '')
  const [website, setWebsite] = useState(resource?.website || '')
  const [targetAudience, setTargetAudience] = useState(resource?.target_audience || '')
  const [accessConditions, setAccessConditions] = useState(resource?.access_conditions || '')
  const [languages, setLanguages] = useState(resource?.languages_spoken?.join(', ') || 'fr')
  const [tags, setTags] = useState(resource?.tags?.join(', ') || '')
  const [wheelchair, setWheelchair] = useState<boolean | null>(resource?.wheelchair_accessible ?? null)
  const [verified, setVerified] = useState(resource?.verified ?? false)
  const [source, setSource] = useState(resource?.source || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !address.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      address: address.trim(),
      latitude: parseFloat(latitude) || 46.2044,
      longitude: parseFloat(longitude) || 6.1432,
      phone: phone.trim() || null,
      email: email.trim() || null,
      website: website.trim() || null,
      target_audience: targetAudience.trim() || null,
      access_conditions: accessConditions.trim() || null,
      languages_spoken: languages.split(',').map((l) => l.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      wheelchair_accessible: wheelchair,
      verified,
      source: source.trim() || null,
      opening_hours: resource?.opening_hours || {},
    })
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">
          {resource ? 'Modifier la ressource' : 'Ajouter une ressource'}
        </h3>
        <button type="button" onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      {/* Row 1: Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nom *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Catégorie *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as ResourceCategory)} className={inputClass}>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} required />
      </div>

      {/* Address + Coords */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Adresse *</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Latitude</label>
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Téléphone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Site web</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
      </div>

      {/* Audience + Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Public cible</label>
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Conditions d'accès</label>
          <input type="text" value={accessConditions} onChange={(e) => setAccessConditions(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Languages, Tags, Source */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Langues (séparées par virgule)</label>
          <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className={inputClass} placeholder="fr, en, ar" />
        </div>
        <div>
          <label className={labelClass}>Tags (séparés par virgule)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="repas, gratuit" />
        </div>
        <div>
          <label className={labelClass}>Source</label>
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={wheelchair === true}
            onChange={(e) => setWheelchair(e.target.checked ? true : null)}
            className="rounded border-gray-300"
          />
          Accessible fauteuil roulant
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="rounded border-gray-300"
          />
          Vérifié
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Save size={14} />
          {resource ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

function ReportsView({
  reports,
  onResolve,
  onDismiss,
  onDelete,
}: {
  reports: Report[]
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()
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
              <ReportCard key={report.id} report={report} onResolve={onResolve} onDismiss={onDismiss} onDelete={onDelete} />
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
              <ReportCard key={report.id} report={report} onResolve={onResolve} onDismiss={onDismiss} onDelete={onDelete} />
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
}: {
  report: Report
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { t, i18n } = useTranslation()
  const reasonDef = REPORT_REASONS.find((r) => r.value === report.reason)
  const reasonLabel = reasonDef ? t(reasonDef.labelKey) : report.reason
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
              {new Date(report.created_at).toLocaleDateString(i18n.language)}
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
}: {
  suggestions: ResourceSuggestion[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()
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
  const { t, i18n } = useTranslation()
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
              {catConfig && s.category && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
                >
                  {t(`categories.${s.category}`)}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                s.status === 'approved' ? 'bg-green-100 text-green-700' :
                s.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {s.status === 'approved' ? t('adminExtra.approved') : s.status === 'rejected' ? t('adminExtra.rejected') : t('adminExtra.pending')}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {s.address && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={11} className="shrink-0" />
                  {s.address}
                </span>
              )}
              <span>{new Date(s.created_at).toLocaleDateString(i18n.language)}</span>
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
                {t('adminExtra.approve')}
              </button>
              <button
                onClick={() => onReject(s.id)}
                className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                {t('adminExtra.reject')}
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
          {expanded ? t('adminExtra.hideDetails') : t('adminExtra.showDetails')}
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
              <p className="text-xs font-medium text-gray-500 mb-0.5">{t('resource.hours')}</p>
              <p className="text-xs text-gray-600 whitespace-pre-line">{s.opening_hours}</p>
            </div>
          )}
          {s.target_audience && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{t('resource.audience')}</p>
              <p className="text-xs text-gray-600">{s.target_audience}</p>
            </div>
          )}
          {s.access_conditions && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{t('resource.access')}</p>
              <p className="text-xs text-gray-600">{s.access_conditions}</p>
            </div>
          )}
          {s.languages_spoken && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{t('resource.languages')}</p>
              <p className="text-xs text-gray-600">{s.languages_spoken}</p>
            </div>
          )}
          {s.wheelchair_accessible != null && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{t('resource.wheelchair')}</p>
              <p className="text-xs text-gray-600">{s.wheelchair_accessible ? t('common.yes') : t('common.no')}</p>
            </div>
          )}

          {/* Submitter info - highlighted */}
          <div className="bg-white rounded-lg border border-gray-200 p-2.5 mt-2">
            <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <User size={12} />
              {t('adminExtra.submittedBy')}
            </p>
            <div className="space-y-0.5">
              {s.submitter_name && (
                <p className="text-xs text-gray-600">{s.submitter_name}</p>
              )}
              <p className="text-xs text-blue-600 font-medium">{s.submitter_contact || t('adminExtra.noContact')}</p>
              {s.submitter_relation && (
                <p className="text-xs text-gray-500 italic">
                  {s.submitter_relation === 'user' ? t('suggest.relationUser') :
                   s.submitter_relation === 'staff' ? t('suggest.relationStaff') :
                   s.submitter_relation === 'organization' ? t('suggest.relationOrg') :
                   t('suggest.relationOther')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
