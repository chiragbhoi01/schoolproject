import { cn } from '../../utils/helpers'

export function Badge({ children, variant = 'blue', className }) {
  const variants = {
    green: 'bg-green-50 text-green-700 border border-green-100',
    red: 'bg-red-50 text-red-700 border border-red-100',
    orange: 'bg-orange-50 text-orange-700 border border-orange-100',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100',
    teal: 'bg-teal-50 text-teal-700 border border-teal-100',
    gray: 'bg-gray-50 text-gray-600 border border-gray-100',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
      variants[variant] || variants.blue,
      className
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', variant: 'green' },
    warning: { label: 'Warning', variant: 'orange' },
    critical: { label: 'Critical', variant: 'red' },
    completed: { label: 'Completed', variant: 'blue' },
    upcoming: { label: 'Upcoming', variant: 'purple' },
    inactive: { label: 'Inactive', variant: 'gray' },
  }
  const config = map[status] || map.active
  return <Badge variant={config.variant}><span className="w-1.5 h-1.5 rounded-full bg-current" />{config.label}</Badge>
}
