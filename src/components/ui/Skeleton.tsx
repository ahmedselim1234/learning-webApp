type SkeletonVariant = 'text' | 'card' | 'avatar' | 'thumbnail'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  lines?: number
}

const base = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded'

export default function Skeleton({ variant = 'text', className = '', lines = 3 }: SkeletonProps) {
  if (variant === 'avatar') return <div className={`${base} rounded-full w-10 h-10 ${className}`} />
  if (variant === 'thumbnail') return <div className={`${base} w-full aspect-video rounded-lg ${className}`} />
  if (variant === 'card') {
    return (
      <div className={`space-y-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl ${className}`}>
        <div className={`${base} w-full aspect-video`} />
        <div className={`${base} h-4 w-3/4`} />
        <div className={`${base} h-3 w-1/2`} />
        <div className="flex justify-between">
          <div className={`${base} h-3 w-1/4`} />
          <div className={`${base} h-3 w-1/5`} />
        </div>
      </div>
    )
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${base} h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}
