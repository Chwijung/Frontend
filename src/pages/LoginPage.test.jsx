import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './LoginPage'

// 테스트용 QueryClient 설정
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. 로그인 폼 렌더링 테스트
  it('로그인 폼이 올바르게 렌더링됩니다', () => {
    renderWithQueryClient(<LoginPage />)
    
    expect(screen.getByText('🔐 AI-X 시스템')).toBeDefined()
    expect(screen.getByText('운영자 로그인이 필요합니다')).toBeDefined()
    expect(screen.getByPlaceholderText('운영자 아이디')).toBeDefined()
    expect(screen.getByPlaceholderText('비밀번호')).toBeDefined()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDefined()
  })

  // 2. 이메일/비밀번호 입력 필드 테스트
  it('이메일과 비밀번호 입력이 가능합니다', () => {
    renderWithQueryClient(<LoginPage />)
    
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    
    fireEvent.change(idInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    
    expect(idInput.value).toBe('admin')
    expect(passwordInput.value).toBe('admin123')
  })

  // 3. 폼 검증 로직 테스트
  it('빈 필드로 제출 시 검증 에러가 표시됩니다', async () => {
    renderWithQueryClient(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: '로그인' })
    fireEvent.click(submitButton)
    
    // HTML5 required 속성에 의한 검증
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    expect(idInput.validity.valueMissing).toBe(true)
  })

  // 4. 로그인 API 호출 테스트
  it('올바른 정보로 로그인 시 API가 호출됩니다', async () => {
    const mockOnLogin = vi.fn()
    renderWithQueryClient(<LoginPage onLogin={mockOnLogin} />)
    
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    fireEvent.change(idInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('admin', 'admin123')
    })
  })

  // 5. JWT 토큰 저장 테스트
  it('로그인 성공 시 토큰이 localStorage에 저장됩니다', async () => {
    const mockToken = 'mock-jwt-token'
    const mockOnLogin = vi.fn().mockResolvedValue({ token: mockToken, role: 'admin' })
    
    renderWithQueryClient(<LoginPage onLogin={mockOnLogin} />)
    
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    fireEvent.change(idInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth-token', mockToken)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-role', 'admin')
    })
  })

  // 6. 권한별 리다이렉션 테스트
  it('관리자 권한으로 로그인 시 대시보드로 이동합니다', async () => {
    const mockNavigate = vi.fn()
    const mockOnLogin = vi.fn().mockResolvedValue({ token: 'token', role: 'admin' })
    
    renderWithQueryClient(<LoginPage onLogin={mockOnLogin} navigate={mockNavigate} />)
    
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    fireEvent.change(idInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  // 7. 자동 로그인 테스트
  it('기존 토큰이 있으면 자동 로그인됩니다', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'auth-token') return 'existing-token'
      if (key === 'user-role') return 'admin'
      return null
    })
    
    const mockNavigate = vi.fn()
    renderWithQueryClient(<LoginPage navigate={mockNavigate} />)
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  // 8. 에러 처리 테스트
  it('로그인 실패 시 에러 메시지가 표시됩니다', async () => {
    const mockOnLogin = vi.fn().mockRejectedValue(new Error('로그인에 실패했습니다'))
    
    renderWithQueryClient(<LoginPage onLogin={mockOnLogin} />)
    
    const idInput = screen.getByPlaceholderText('운영자 아이디')
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const submitButton = screen.getByRole('button', { name: '로그인' })
    
    fireEvent.change(idInput, { target: { value: 'wrong' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('로그인에 실패했습니다')).toBeDefined()
    })
  })
}) 