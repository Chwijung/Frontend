import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService, tokenManager } from './auth'

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

describe('tokenManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('토큰을 저장할 수 있습니다', () => {
    tokenManager.saveToken('test-token')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth-token', 'test-token')
  })

  it('토큰을 가져올 수 있습니다', () => {
    mockLocalStorage.getItem.mockReturnValue('stored-token')
    const token = tokenManager.getToken()
    expect(token).toBe('stored-token')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('auth-token')
  })

  it('토큰을 제거할 수 있습니다', () => {
    tokenManager.removeToken()
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth-token')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user-role')
  })

  it('사용자 역할을 저장하고 가져올 수 있습니다', () => {
    tokenManager.saveUserRole('admin')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-role', 'admin')
    
    mockLocalStorage.getItem.mockReturnValue('admin')
    const role = tokenManager.getUserRole()
    expect(role).toBe('admin')
  })
})

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('올바른 관리자 정보로 로그인이 성공합니다', async () => {
    const result = await authService.login('admin', 'admin123')
    
    expect(result.token).toBeDefined()
    expect(result.role).toBe('admin')
    expect(result.user).toEqual({
      id: 'admin',
      name: '권회은',
      role: 'admin'
    })
  })

  it('잘못된 정보로 로그인 시 에러가 발생합니다', async () => {
    await expect(authService.login('wrong', 'wrong')).rejects.toThrow('아이디 또는 비밀번호가 올바르지 않습니다')
  })

  it('토큰 유효성을 검증할 수 있습니다', () => {
    const validToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.test'
    expect(authService.validateToken(validToken)).toBe(true)
    
    expect(authService.validateToken('invalid-token')).toBe(false)
    expect(authService.validateToken('incomplete.token')).toBe(false)
    expect(authService.validateToken('')).toBe(false)
    expect(authService.validateToken(null)).toBe(false)
  })
}) 