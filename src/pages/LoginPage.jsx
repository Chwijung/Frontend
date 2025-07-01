import React, { useEffect, useState } from 'react'
import { authService, tokenManager } from '../utils/auth'
import { logger } from '../utils/logger'

function LoginPage({ onLogin, navigate }) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 자동 로그인 체크
  useEffect(() => {
    const token = tokenManager.getToken()
    const role = tokenManager.getUserRole()
    
    if (token && authService.validateToken(token)) {
      logger.info('기존 토큰으로 자동 로그인')
      if (navigate) {
        navigate('/dashboard')
      }
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(event.target)
      const id = formData.get('id')
      const password = formData.get('password')
      
      logger.info('로그인 시도:', id)
      
      let result
      if (onLogin) {
        result = await onLogin(id, password)
      } else {
        result = await authService.login(id, password)
      }
      
      // 토큰과 역할 저장
      tokenManager.saveToken(result.token)
      tokenManager.saveUserRole(result.role)
      
      logger.info('로그인 성공:', result.user?.name || result.role)
      
      // 권한별 리다이렉션
      if (navigate) {
        if (result.role === 'admin') {
          navigate('/dashboard')
        } else {
          navigate('/dashboard') // 현재는 모든 권한이 대시보드로
        }
      }
    } catch (err) {
      logger.error('로그인 실패:', err.message)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96 max-w-sm mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">🔐 AI-X 시스템</h1>
          <p className="text-gray-600">운영자 로그인이 필요합니다</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">아이디</label>
            <input 
              type="text" 
              name="id"
              className="w-full border p-3 rounded-lg" 
              placeholder="운영자 아이디" 
              required 
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input 
              type="password" 
              name="password"
              className="w-full border p-3 rounded-lg" 
              placeholder="비밀번호" 
              required 
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>테스트 계정: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 