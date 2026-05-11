import { motion } from 'framer-motion'
import { cn, getAttendanceBg } from '../../utils/helpers'

export function ProgressBar({ value, max = 100, color, className, showLabel = false, size = 'md' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const bgColor = color || getAttendanceBg(pct)

  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', bgColor)}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-10 text-right flex-shrink-0">{pct.toFixed(0)}%</span>
      )}
    </div>
  )
}
