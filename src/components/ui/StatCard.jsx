import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

export function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend, index = 0 }) {
  const colorMap = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/10' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card p-5 flex items-start gap-4"
    >
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', c.bg)}>
        <Icon className={cn('w-6 h-6', c.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
            <span>{trend >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="skeleton w-12 h-12 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-7 w-16 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    </div>
  )
}
