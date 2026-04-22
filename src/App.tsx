import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ToastContainer from './components/ui/Toast'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Learn from './pages/Learn'
import Dashboard from './pages/Dashboard'
import Instructor from './pages/Instructor'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import NotFound from './pages/NotFound'
import { useEffect } from 'react'
import { useAppSelector } from './hooks/redux'

function AppInitializer() {
  const theme = useAppSelector(s => s.ui.theme)
  const language = useAppSelector(s => s.ui.language)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])
  return null
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <AppInitializer />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/learn/:courseId/:lessonId" element={<Learn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout />
      </BrowserRouter>
    </Provider>
  )
}
