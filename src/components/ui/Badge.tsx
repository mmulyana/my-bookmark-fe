import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'folder' | 'tag'
}

export const Badge = ({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors'

  const variants = {
    default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border border-slate-200 text-slate-600 bg-white',
    folder: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    tag: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
  }

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
