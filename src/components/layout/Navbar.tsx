import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { toggleTheme, toggleLanguage } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'
import { useTranslation } from '../../hooks/useTranslation'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t, lang } = useTranslation()
  const { user, isAuthenticated } = useAppSelector(s => s.auth)
  const theme = useAppSelector(s => s.ui.theme)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) navigate(`/courses?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white hidden sm:block">
            {lang === 'ar' ? 'منصة التعلم' : 'EduPlatform'}
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {t('nav_home')}
          </Link>
          <Link to="/courses" className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {t('nav_courses')}
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('nav_search')}
              className={`w-full ${lang === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400`}
            />
          </div>
        </form>

        <div className={`${lang === 'ar' ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5`}>
          {/* Language toggle */}
          <button
            onClick={() => dispatch(toggleLanguage())}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-black border border-slate-200 dark:border-slate-700"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {lang === 'ar' ? 'EN' : 'ع'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden md:block">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 animate-fade-in`}>
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    {t('nav_dashboard')}
                  </Link>
                  {user.role === 'instructor' && (
                    <Link to="/instructor" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                      {t('nav_studio')}
                    </Link>
                  )}
                  <hr className="my-1 border-slate-200 dark:border-slate-700" />
                  <button onClick={() => { dispatch(logout()); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {t('nav_signout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>{t('nav_signin')}</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/auth/register')}>{t('nav_start')}</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
