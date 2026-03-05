import { supabase } from './supabase'

const COMMENTS_KEY = 'genevemap_comments'

export interface Comment {
  id: string
  author_name: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at: string
  reviewed_at?: string
}

// --- localStorage fallback ---

function getLocalComments(): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalComments(comments: Comment[]): void {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
}

// --- Public API ---

export async function getApprovedComments(): Promise<Comment[]> {
  if (!supabase) return getLocalComments().filter((c) => c.status === 'approved')

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch comments:', error)
    return []
  }

  return data || []
}

export async function getAllComments(): Promise<Comment[]> {
  if (!supabase) return getLocalComments()

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch comments:', error)
    return getLocalComments()
  }

  return data || []
}

export async function addComment(author_name: string, message: string): Promise<Comment | null> {
  if (!supabase) {
    const comment: Comment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      author_name,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    const comments = getLocalComments()
    comments.unshift(comment)
    saveLocalComments(comments)
    return comment
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ author_name: author_name || '', message, status: 'pending' })
    .select()
    .single()

  if (error) {
    console.error('Failed to add comment:', error)
    return null
  }

  return data
}

export async function approveComment(id: string): Promise<void> {
  if (!supabase) {
    const comments = getLocalComments()
    const c = comments.find((c) => c.id === id)
    if (c) { c.status = 'approved'; c.reviewed_at = new Date().toISOString(); saveLocalComments(comments) }
    return
  }

  await supabase.from('comments').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id)
}

export async function rejectComment(id: string): Promise<void> {
  if (!supabase) {
    const comments = getLocalComments()
    const c = comments.find((c) => c.id === id)
    if (c) { c.status = 'rejected'; c.reviewed_at = new Date().toISOString(); saveLocalComments(comments) }
    return
  }

  await supabase.from('comments').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
}

export async function deleteComment(id: string): Promise<void> {
  if (!supabase) {
    saveLocalComments(getLocalComments().filter((c) => c.id !== id))
    return
  }

  await supabase.from('comments').delete().eq('id', id)
}
