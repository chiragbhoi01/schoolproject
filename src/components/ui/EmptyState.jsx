import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="w-16 h-16 bg-orange-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary/50" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
