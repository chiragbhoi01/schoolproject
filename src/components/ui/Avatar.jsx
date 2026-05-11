import { cn, getInitials, getAvatarColor } from '../../utils/helpers'

export function Avatar({ name, size = 'md', className }) {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  }
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center text-white font-bold flex-shrink-0',
      sizes[size],
      getAvatarColor(name),
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
