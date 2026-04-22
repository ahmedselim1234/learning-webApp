import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { useTranslation } from '../../hooks/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-primary-600 mb-4">404</div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('notfound_title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">{t('notfound_sub')}</p>
        <Link to="/"><Button size="lg">{t('notfound_btn')}</Button></Link>
      </div>
    </div>
  )
}
