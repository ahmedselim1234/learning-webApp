import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

export default function Footer() {
  const { t, lang } = useTranslation()

  const quickLinks = [
    { labelKey: 'nav_home' as const, to: '/' },
    { labelKey: 'nav_courses' as const, to: '/courses' },
    { labelKey: 'nav_dashboard' as const, to: '/dashboard' },
    { labelKey: 'nav_studio' as const, to: '/instructor' },
  ]

  const categories = [
    { label: t('courses_web'), cat: 'Web Development' },
    { label: t('courses_data'), cat: 'Data Science' },
    { label: t('courses_design'), cat: 'Design' },
    { label: t('courses_mobile'), cat: 'Mobile' },
    { label: t('courses_cloud'), cat: 'Cloud' },
    { label: t('courses_security'), cat: 'Cybersecurity' },
  ]

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
              <span className="font-black text-white text-xl">
                {lang === 'ar' ? 'منصة التعلم' : 'EduPlatform'}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{t('footer_tagline')}</p>
            <div className="flex gap-3 mt-5">
              {[
                { name: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map(social => (
                <a key={social.name} href="#" aria-label={social.name}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors flex items-center justify-center group">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-black mb-4">{t('footer_links')}</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(link => (
                <li key={link.labelKey}>
                  <Link to={link.to} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={lang === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                    </svg>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-black mb-4">{t('footer_cats')}</h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map(cat => (
                <li key={cat.cat}>
                  <Link to={`/courses?category=${encodeURIComponent(cat.cat)}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={lang === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                    </svg>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} {lang === 'ar' ? 'منصة التعلم' : 'EduPlatform'}. {t('footer_rights')}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-slate-400 transition-colors">{t('footer_terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
