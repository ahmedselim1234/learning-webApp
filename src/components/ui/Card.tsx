import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-8' }

export default function Card({ children, hover = false, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : 'shadow-sm',
        paddingClasses[padding],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
