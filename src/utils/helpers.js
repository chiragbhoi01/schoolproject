import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getAvatarColor(name) {
  const colors = [
    'bg-orange-500',
    'bg-red-500',
    'bg-amber-500',
    'bg-green-600',
    'bg-teal-600',
    'bg-blue-600',
    'bg-violet-600',
    'bg-pink-600',
  ]
  if (!name) return colors[0]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export function getStatusColor(status) {
  switch (status) {
    case 'active': return 'badge-green'
    case 'warning': return 'badge-orange'
    case 'critical': return 'badge-red'
    case 'completed': return 'badge-blue'
    case 'upcoming': return 'badge-purple'
    default: return 'badge-blue'
  }
}

export function getActivityTypeColor(type) {
  const map = {
    Assignment: 'badge-orange',
    Quiz: 'badge-blue',
    Seminar: 'badge-purple',
    Workshop: 'badge-green',
    Practical: 'badge-red',
    Sports: 'badge bg-teal-50 text-teal-700',
  }
  return map[type] || 'badge-blue'
}

export function getAttendanceColor(pct) {
  if (pct >= 90) return 'text-green-600'
  if (pct >= 75) return 'text-orange-500'
  return 'text-red-600'
}

export function getAttendanceBg(pct) {
  if (pct >= 90) return 'bg-green-500'
  if (pct >= 75) return 'bg-orange-500'
  return 'bg-red-500'
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export function getDaysUntil(dateStr) {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `${diff} days left`
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'badge-red'
    case 'medium': return 'badge-orange'
    case 'low': return 'badge-green'
    default: return 'badge-blue'
  }
}
