import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { removeToast } from '../../store/slices/uiSlice'
import type { Toast as ToastType } from '../../types'

const icons = {
  success: (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function ToastItem({ toast }: { toast: ToastType }) {
  const dispatch = useAppDispatch()
  const duration = toast.duration ?? 4000

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, dispatch])

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-4 min-w-[280px] max-w-sm animate-slide-up">
      <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{toast.message}</p>
      <button onClick={() => dispatch(removeToast(toast.id))} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useAppSelector(s => s.ui.toasts)
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}
