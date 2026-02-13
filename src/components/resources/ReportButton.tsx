import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flag, Send, X, CheckCircle } from 'lucide-react'
import { addReport, REPORT_REASONS } from '../../lib/reports'
import type { ReportReason } from '../../lib/types'

interface ReportButtonProps {
  resourceId: string
  resourceName: string
}

export function ReportButton({ resourceId, resourceName }: ReportButtonProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!reason) return
    addReport(resourceId, resourceName, reason, message)
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setReason('')
      setMessage('')
    }, 1500)
  }

  const lang = i18n.language

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
      >
        <Flag size={12} />
        {t('report.button')}
      </button>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3 animate-fade-in">
      {submitted ? (
        <div className="flex items-center gap-2 py-2 text-green-600">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{t('report.thanks')}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
              <Flag size={12} className="text-red-400" />
              {t('report.title')}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {REPORT_REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors text-left ${
                  reason === r.value
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {lang === 'en' ? r.labelEn : r.labelFr}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('report.placeholder')}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
          />

          <button
            onClick={handleSubmit}
            disabled={!reason}
            className="w-full py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Send size={14} />
            {t('report.submit')}
          </button>
        </>
      )}
    </div>
  )
}
