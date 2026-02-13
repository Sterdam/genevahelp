import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { SuggestPage } from './pages/SuggestPage'
import { AdminPage } from './pages/AdminPage'

function AppContent() {
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <div className="h-full flex flex-col bg-white">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage mobileView={mobileView} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/suggest" element={<SuggestPage />} />
      </Routes>
      <MobileNav view={mobileView} onViewChange={setMobileView} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
