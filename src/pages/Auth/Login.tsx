import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/redux'
import { setCredentials } from '../../store/slices/authSlice'
import { addToast } from '../../store/slices/uiSlice'
import { useTranslation } from '../../hooks/useTranslation'
import Button from '../../components/ui/Button'
import usersData from '../../data/users.json'
import type { User } from '../../types'

const users = usersData as User[]

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError(t('login_email') + ' / ' + t('login_password')); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const user = users.find(u => u.email === email.trim())
    if (!user) { setError('No account found with this email.'); setLoading(false); return }
    dispatch(setCredentials({ user, token: `mock_token_${user.id}` }))
    dispatch(addToast({ type: 'success', message: `${t('db_welcome')}, ${user.name.split(' ')[0]}!` }))
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('login_title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('login_sub')}</p>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl px-4 py-3 mb-5 text-xs text-primary-700 dark:text-primary-300">
          <p className="font-black mb-1">{t('login_demo')}</p>
          <p>alex@example.com · maria@example.com · sarah@example.com</p>
          <p className="text-primary-500 mt-0.5">{t('login_demo_pass')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('login_email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('login_password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <Button type="submit" className="w-full text-base" isLoading={loading}>{t('login_btn')}</Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {t('login_no_account')}{' '}
          <Link to="/auth/register" className="text-primary-600 dark:text-primary-400 font-black hover:underline">{t('login_create')}</Link>
        </p>
      </div>
    </div>
  )
}
