// 토큰 관리 유틸리티
export const tokenManager = {
  saveToken(token) {
    localStorage.setItem('auth-token', token)
  },

  getToken() {
    return localStorage.getItem('auth-token')
  },

  removeToken() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-role')
  },

  saveUserRole(role) {
    localStorage.setItem('user-role', role)
  },

  getUserRole() {
    return localStorage.getItem('user-role')
  }
}

// 간단한 JWT 토큰 생성 (테스트용)
function generateTestToken(user, role) {
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }))
  const payload = btoa(JSON.stringify({ user, role }))
  const signature = 'test'
  
  return `${header}.${payload}.${signature}`
}

// 인증 서비스
export const authService = {
  async login(id, password) {
    // 테스트용 간단한 인증 로직
    if (id === 'admin' && password === 'admin123') {
      const token = generateTestToken('admin', 'admin')
      const user = {
        id: 'admin',
        name: '권회은',
        role: 'admin'
      }
      
      return {
        token,
        role: 'admin',
        user
      }
    }
    
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
  },

  validateToken(token) {
    if (!token || typeof token !== 'string') {
      return false
    }
    
    // 간단한 JWT 형식 검증
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }
    
    // 각 부분이 비어있지 않은지 확인
    return parts[0] && parts[1] && parts[2]
  },

  logout() {
    tokenManager.removeToken()
  }
} 