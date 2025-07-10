import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CohortDetailPage from './CohortDetailPage'

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Doughnut: vi.fn(() => <div data-testid="doughnut-chart">Chart</div>),
}))

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
}))

// Mock window.location
const mockLocation = {
  pathname: '/cohort-detail/ai-x-3rd'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

// Mock alert and confirm
global.alert = vi.fn()
global.confirm = vi.fn()

describe('CohortDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocation.pathname = '/cohort-detail/ai-x-3rd'
  })

  // 1. 페이지 기본 렌더링 테스트
  it('기수 상세 관리 페이지가 올바르게 렌더링됩니다', () => {
    render(<CohortDetailPage />)
    
    expect(screen.getByText('📅 AI-X 3기 상세 관리')).toBeDefined()
    expect(screen.getByText('AI-X 3기')).toBeDefined()
    expect(screen.getByText('운영자: 권회은')).toBeDefined()
  })

  // 2. 기수 상태 정보 표시 테스트
  it('기수 상태 정보가 올바르게 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    // 기수 상태 정보 확인
    expect(screen.getByText('진행중')).toBeDefined()
    expect(screen.getByText('📅 2025.06.18 ~ 2025.08.30')).toBeDefined()
    expect(screen.getByText('👥 24명 (8개 조)')).toBeDefined()
    expect(screen.getByText('45%')).toBeDefined()
    expect(screen.getByText('현재 중간 발표 준비중')).toBeDefined()
  })

  // 3. 실시간 통계 표시 테스트
  it('실시간 통계가 올바르게 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    expect(screen.getByText('실시간 통계')).toBeDefined()
    expect(screen.getByText('24')).toBeDefined()
    expect(screen.getByText('수강생')).toBeDefined()
    expect(screen.getByText('18')).toBeDefined()
    expect(screen.getByText('과제 제출')).toBeDefined()
    expect(screen.getByText('6')).toBeDefined()
    expect(screen.getByText('미제출')).toBeDefined()
    expect(screen.getByText('32')).toBeDefined()
    expect(screen.getByText('멘토링 기록')).toBeDefined()
  })

  // 4. 다음 일정 표시 테스트
  it('다음 일정이 올바르게 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    expect(screen.getByText('다음 일정')).toBeDefined()
    expect(screen.getByText('📊 중간 발표')).toBeDefined()
    expect(screen.getByText('07.25 (목)')).toBeDefined()
    expect(screen.getAllByText('💼 현직자 특강')).toHaveLength(2) // 다음 일정과 전체 일정에 중복 존재
    expect(screen.getAllByText('07.27 (토)')).toHaveLength(2) // 다음 일정과 전체 일정에 중복 존재
  })

  // 5. 빠른 관리 메뉴 테스트
  it('빠른 관리 메뉴가 올바르게 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    expect(screen.getByText('빠른 관리')).toBeDefined()
    expect(screen.getByText('수강생 관리')).toBeDefined()
    expect(screen.getByText('조 관리')).toBeDefined()
    expect(screen.getByText('멘토링')).toBeDefined()
    expect(screen.getByText('프로젝트')).toBeDefined()
  })

  // 6. 전체 일정 표시 테스트
  it('전체 일정이 올바르게 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    expect(screen.getByText('AI-X 3기 전체 일정')).toBeDefined()
    expect(screen.getByText('1주차 (2025.06.18 - 2025.06.24)')).toBeDefined()
    expect(screen.getByText('5-6주차 (2025.07.16 - 2025.07.29) - 현재 진행중')).toBeDefined()
  })

  // 7. 뒤로가기 네비게이션 테스트
  it('뒤로가기 버튼 클릭 시 대시보드로 이동합니다', () => {
    const mockNavigate = vi.fn()
    render(<CohortDetailPage navigate={mockNavigate} />)
    
    const backButton = screen.getByText('← 기수 전체보기로')
    fireEvent.click(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  // 8. 정보 수정 버튼 테스트
  it('정보 수정 버튼 클릭 시 모달이 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    const editButton = screen.getByText('✏️ 정보 수정')
    fireEvent.click(editButton)
    
    expect(global.alert).toHaveBeenCalledWith(
      '기수 정보 수정 모달을 엽니다.\n\n수정 가능 항목:\n• 기수 이름\n• 교육 기간\n• 수강생 수\n• 멘토링 일정'
    )
  })

  // 9. 보고서 생성 버튼 테스트
  it('보고서 생성 버튼 클릭 시 보고서 생성 알림이 표시됩니다', () => {
    render(<CohortDetailPage />)
    
    const reportButton = screen.getByText('📊 보고서 생성')
    fireEvent.click(reportButton)
    
    expect(global.alert).toHaveBeenCalledWith(
      '📊 기수 보고서를 생성합니다...\n\n포함 내용:\n• 수강생 현황 및 출석률\n• 과제 제출 통계\n• 멘토링 기록 요약\n• 프로젝트 진행 상황\n• 예산 사용 내역'
    )
  })

  // 10. 일정 수정 버튼 테스트
  it('일정 수정 버튼 클릭 시 수정 모드로 전환됩니다', () => {
    render(<CohortDetailPage />)
    
    const modifyButton = screen.getByText('✏️ 일정 수정')
    fireEvent.click(modifyButton)
    
    expect(global.alert).toHaveBeenCalledWith(
      '📅 일정 수정 모드로 전환합니다.\n\n수정 가능 항목:\n• 일정 날짜 변경\n• 새 일정 추가\n• 일정 삭제\n• 일정 설명 수정'
    )
  })

  // 11. 일정 내보내기 테스트
  it('일정 내보내기 Excel 버튼 테스트', () => {
    global.confirm.mockReturnValue(true)
    render(<CohortDetailPage />)
    
    const exportButton = screen.getByText('📤 일정 내보내기')
    fireEvent.click(exportButton)
    
    expect(global.confirm).toHaveBeenCalledWith(
      '일정을 어떤 형식으로 내보내시겠습니까?\n\nOK: Excel 파일\nCancel: PDF 파일'
    )
    expect(global.alert).toHaveBeenCalledWith('📊 Excel 형식으로 일정을 내보냅니다.')
  })

  // 12. 일정 내보내기 PDF 테스트
  it('일정 내보내기 PDF 버튼 테스트', () => {
    global.confirm.mockReturnValue(false)
    render(<CohortDetailPage />)
    
    const exportButton = screen.getByText('📤 일정 내보내기')
    fireEvent.click(exportButton)
    
    expect(global.alert).toHaveBeenCalledWith('📄 PDF 형식으로 일정을 내보냅니다.')
  })

  // 13. 빠른 관리 메뉴 클릭 테스트
  it('빠른 관리 메뉴 버튼들이 올바르게 동작합니다', () => {
    render(<CohortDetailPage />)
    
    const studentButton = screen.getByText('수강생 관리')
    const teamButton = screen.getByText('조 관리')
    const mentoringButton = screen.getByText('멘토링')
    const projectButton = screen.getByText('프로젝트')
    
    
    fireEvent.click(teamButton)
    expect(global.alert).toHaveBeenCalledWith('조 관리 페이지로 이동합니다. (구현 예정)')
    
    fireEvent.click(mentoringButton)
    expect(global.alert).toHaveBeenCalledWith('멘토링 페이지로 이동합니다. (구현 예정)')
    
    fireEvent.click(projectButton)
    expect(global.alert).toHaveBeenCalledWith('프로젝트 페이지로 이동합니다. (구현 예정)')
  })

  // 14. 다른 기수 URL 테스트
  it('다른 기수 URL로 접근 시 해당 기수 정보가 표시됩니다', () => {
    mockLocation.pathname = '/cohort-detail/ai-x-2nd'
    render(<CohortDetailPage />)
    
    expect(screen.getByText('📅 AI-X 2기 상세 관리')).toBeDefined()
    expect(screen.getByText('AI-X 2기')).toBeDefined()
    expect(screen.getByText('완료')).toBeDefined()
    expect(screen.getByText('100%')).toBeDefined()
  })

  // 15. 잘못된 기수 ID 처리 테스트
  it('잘못된 기수 ID로 접근 시 기본 기수가 표시됩니다', () => {
    mockLocation.pathname = '/cohort-detail/invalid-cohort'
    render(<CohortDetailPage />)
    
    expect(screen.getByText('📅 AI-X 3기 상세 관리')).toBeDefined()
    expect(screen.getByText('AI-X 3기')).toBeDefined()
  })
}) 