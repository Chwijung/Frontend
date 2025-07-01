import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// 테스트용 QueryClient 설정
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

const renderWithQueryClient = (ui) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('로그인 페이지가 기본으로 렌더링됩니다', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    renderWithQueryClient(<App />)
    
    expect(screen.getByText('🔐 AI-X 시스템')).toBeDefined()
    expect(screen.getByText('운영자 로그인이 필요합니다')).toBeDefined()
  })

  it('유효한 토큰이 있으면 대시보드가 렌더링됩니다', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'auth-token') return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.test'
      if (key === 'user-role') return 'admin'
      return null
    })
    
    renderWithQueryClient(<App />)
    
    expect(screen.getByText('📁 AI-X 전체 기수 관리')).toBeDefined()
    expect(screen.getByText('🚪 로그아웃')).toBeDefined()
  })

  it('앱이 시작될 때 로그 메시지가 출력됩니다', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    mockLocalStorage.getItem.mockReturnValue(null)
    
    renderWithQueryClient(<App />)
    
    expect(consoleSpy).toHaveBeenCalledWith('[INFO] AI-X 교육과정 운영 시스템이 시작되었습니다.')
    
    consoleSpy.mockRestore()
  })
}) 