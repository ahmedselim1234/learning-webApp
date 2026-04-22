interface AvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-2xl' }

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  return src ? (
    <img
      src={src}
      alt={name}
      className={`rounded-full object-cover bg-slate-200 ${sizeClasses[size]} ${className}`}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  ) : (
    <div className={`rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {initials(name)}
    </div>
  )
}
