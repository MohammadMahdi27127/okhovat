const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

export function saveUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('user')
  return u ? JSON.parse(u) : null
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    clearTokens()
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.detail || data.message || 'خطا در ارتباط با سرور')
  }
  return data
}

// Auth
export async function login(groupCode: string, password: string) {
  const data = await request('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ group_code: groupCode, password }),
  })
  setTokens(data.access, data.refresh)
  saveUser(data.user)
  return data
}

export async function getMe() {
  const user = await request('/auth/me/')
  saveUser(user)
  return user
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return request('/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })
}

export async function forgotPassword(groupCode: string) {
  return request('/auth/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ group_code: groupCode }),
  })
}

export async function resetPassword(groupCode: string, code: string, newPassword: string) {
  const data = await request('/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify({ group_code: groupCode, code, new_password: newPassword }),
  })
  if (data.access) {
    setTokens(data.access, data.refresh)
    saveUser(data.user)
  }
  return data
}

export async function uploadAvatar(file: File) {
  const form = new FormData()
  form.append('avatar', file)
  const data = await request('/auth/avatar/', {
    method: 'POST',
    body: form,
  })
  if (data.user) saveUser(data.user)
  return data
}

// Posts
export async function getPosts(params?: { type?: string; trending?: boolean }) {
  const q = new URLSearchParams()
  if (params?.type) q.set('type', params.type)
  if (params?.trending) q.set('trending', '1')
  const query = q.toString() ? `?${q}` : ''
  return request(`/posts/${query}`)
}

export async function createPost(data: {
  title?: string
  content: string
  post_type?: string
  related_ring?: number
  related_workgroup?: number
  media?: File | null
}) {
  if (data.media) {
    const form = new FormData()
    if (data.title) form.append('title', data.title)
    form.append('content', data.content)
    if (data.post_type) form.append('post_type', data.post_type)
    if (data.related_ring) form.append('related_ring', String(data.related_ring))
    if (data.related_workgroup) form.append('related_workgroup', String(data.related_workgroup))
    form.append('media', data.media)
    return request('/posts/', { method: 'POST', body: form })
  }
  return request('/posts/', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      post_type: data.post_type,
      related_ring: data.related_ring,
      related_workgroup: data.related_workgroup,
    }),
  })
}

export async function deletePost(id: number) {
  return request(`/posts/${id}/`, { method: 'DELETE' })
}

export async function toggleLike(id: number) {
  return request(`/posts/${id}/like/`, { method: 'POST' })
}

export async function toggleRecommend(id: number) {
  return request(`/posts/${id}/recommend/`, { method: 'POST' })
}

export async function toggleBookmark(id: number) {
  return request(`/posts/${id}/bookmark/`, { method: 'POST' })
}

export async function getComments(postId: number) {
  return request(`/posts/${postId}/comments/`)
}

export async function addComment(postId: number, content: string) {
  return request(`/posts/${postId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

// Growth
export async function getGrowthLogs(userId?: number) {
  const q = userId ? `?user=${userId}` : ''
  return request(`/growth/${q}`)
}

export async function createGrowthLog(data: {
  date: string
  sport_hours?: number
  study_pages?: number
  group_responsibility?: string
  personal_skill?: string
  leisure?: string
  publish_to_posts?: boolean
  extra_data?: Record<string, unknown>
}) {
  return request('/growth/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Rings & Workgroups
export async function getRings() {
  return request('/rings/')
}

export async function getWorkgroups() {
  return request('/workgroups/')
}

export async function getWorkgroupDetail(slug: string) {
  return request(`/workgroups/${slug}/`)
}

export async function createWorkgroupContent(
  slug: string,
  data: { title?: string; body?: string; data?: object; media?: File | null }
) {
  const form = new FormData()
  if (data.title) form.append('title', data.title)
  if (data.body) form.append('body', data.body)
  if (data.data) form.append('data', JSON.stringify(data.data))
  if (data.media) form.append('media', data.media)
  return request(`/workgroups/${slug}/content/`, {
    method: 'POST',
    body: form,
  })
}

// Users
export async function searchUsers(search?: string) {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  return request(`/users/${q}`)
}

export async function suspendUser(userId: number, days: 1 | 3) {
  return request(`/users/${userId}/suspend/`, {
    method: 'POST',
    body: JSON.stringify({ days }),
  })
}

// Coach messages
export async function getMessages(params?: { recipient?: number; inbox?: boolean }) {
  const q = new URLSearchParams()
  if (params?.recipient) q.set('recipient', String(params.recipient))
  if (params?.inbox) q.set('inbox', '1')
  const query = q.toString() ? `?${q}` : ''
  return request(`/messages/${query}`)
}

export async function sendCoachMessage(recipientId: number, body: string) {
  return request('/messages/', {
    method: 'POST',
    body: JSON.stringify({ recipient_id: recipientId, body }),
  })
}

export async function markMessageRead(id: number) {
  return request(`/messages/${id}/read/`, { method: 'POST' })
}

// Admin
export async function getAdminStats() {
  return request('/admin/stats/')
}

// Analytics
export async function trackInteraction(data: {
  page: string
  section?: string
  element_type?: string
  element_id?: string
  action?: string
  session_id?: string
}) {
  return request('/interactions/', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch(() => {})
}
