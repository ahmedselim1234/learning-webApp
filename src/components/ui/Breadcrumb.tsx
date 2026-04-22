import { Link } from 'react-router-dom'
import type { BreadcrumbItem } from '../../types'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
            {item.href && i < items.length - 1 ? (
              <Link to={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'text-slate-900 dark:text-slate-100 font-medium' : ''}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
