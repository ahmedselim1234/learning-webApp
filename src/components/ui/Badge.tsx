import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'beginner' | 'intermediate' | 'advanced'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  primary:      'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  accent:       'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  success:      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  danger:       'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  info:         'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  beginner:     'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  advanced:     'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
