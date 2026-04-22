import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/redux'
import { setCredentials } from '../../store/slices/authSlice'
import { addToast } from '../../store/slices/uiSlice'
import { useTranslation } from '../../hooks/useTranslation'
import Button from '../../components/ui/Button'
import type { User } from '../../types'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t, lang } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) { setError('All fields are required.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: '',
      enrolledCourses: [],
      completedLessons: [],
      wishlist: [],
      joinedAt: new Date().toISOString().split('T')[0],
    }
    dispatch(setCredentials({ user: newUser, token: `mock_token_${newUser.id}` }))
    dispatch(addToast({ type: 'success', message: `${t('db_welcome')}, ${newUser.name.split(' ')[0]}!` }))
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          {/* Brand logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white">
              {lang === 'ar' ? 'منصة التعلم' : 'EduPlatform'}
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('register_title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('register_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('register_name')}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('register_name_ph')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('login_email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('register_email_ph')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('login_password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('register_pass_ph')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <Button type="submit" className="w-full text-base" isLoading={loading}>{t('register_btn')}</Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {t('register_have')}{' '}
          <Link to="/auth/login" className="text-primary-600 dark:text-primary-400 font-black hover:underline">{t('register_signin')}</Link>
        </p>
      </div>
    </div>
  )
}
