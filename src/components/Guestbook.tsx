import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, MessageCircle, CheckCircle, Clock } from 'lucide-react'
import { getApprovedComments, addComment, type Comment } from '../lib/comments'

export function Guestbook() {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getApprovedComments().then(setComments)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    await addComment(name.trim(), message.trim())
    setSubmitting(false)
    setSubmitted(true)
    setName('')
    setMessage('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
          <MessageCircle size={20} className="text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t('guestbook.title')}
        </h2>
      </div>

      <p className="text-sm text-gray-500">
        {t('guestbook.subtitle')}
      </p>

      {/* Approved comments wall */}
      {comments.length > 0 && (
        <div className="space-y-2.5">
          {comments.slice(0, 10).map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-700 leading-relaxed">{c.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs font-medium text-gray-500">
                  {c.author_name || t('guestbook.anonymous')}
                </p>
                <span className="text-gray-300">·</span>
                <p className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString(i18n.language, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form or success */}
      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">
              {t('guestbook.thankYou')}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {t('guestbook.willReview')}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-green-700 underline mt-2"
            >
              {t('guestbook.writeAnother')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={12} />
            {t('guestbook.moderationNotice')}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('guestbook.namePlaceholder')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-300"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder={t('guestbook.messagePlaceholder')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder:text-gray-300"
          />
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {submitting ? '...' : t('guestbook.submit')}
          </button>
        </form>
      )}
    </div>
  )
}
