import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './App.css'
import { logger } from './utils/logger'
import { tokenManager, authService } from './utils/auth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MainDashboard from './pages/MainDashboard'
import CohortDetailPage from './pages/CohortDetailPage'
import TeamManagement from './pages/TeamManagement'

// TanStack Query 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 3,
    },
  },
})

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState('/login')

  // 초기 라우트 결정
  useEffect(() => {
    const token = tokenManager.getToken()
    if (token && authService.validateToken(token)) {
      logger.info('토큰 유효: 대시보드로 이동')
      setCurrentRoute('/dashboard')
    } else {
      logger.info('토큰 없음 또는 무효: 로그인 페이지 표시')
      setCurrentRoute('/login')
    }
  }, [])

  const navigate = (route) => {
    logger.info('네비게이션:', route)
    setCurrentRoute(route)
  }

  const handleLogin = async (id, password) => {
    return authService.login(id, password)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {currentRoute === '/login' && (
        <LoginPage onLogin={handleLogin} navigate={navigate} />
      )}
      {currentRoute === '/dashboard' && (
        <DashboardPage navigate={navigate} />
      )}
      {currentRoute === '/main-dashboard' && (
        <MainDashboard navigate={navigate} />
      )}
      {currentRoute.startsWith('/cohort-detail/') && (
        <CohortDetailPage navigate={navigate} />
      )}
      {currentRoute === '/team-management' && (
        <TeamManagement navigate={navigate} />
      )}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App 