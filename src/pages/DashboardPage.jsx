import React, { useState, useEffect, useRef } from 'react'
import { tokenManager, authService } from '../utils/auth'
import { logger } from '../utils/logger'

// 기수 데이터
const cohortData = [
  {
    id: 'ai-x-3rd',
    name: 'AI-X 3기',
    period: '2025.06.18 ~ 2025.08.30',
    status: '진행 중',
    statusColor: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    action: '접속하기'
  },
  {
    id: 'ai-x-2nd',
    name: 'AI-X 2기',
    period: '2025.03.01 ~ 2025.05.20',
    status: '종료',
    statusColor: 'gray',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    action: '아카이브 보기'
  },
  {
    id: 'ai-x-1st',
    name: 'AI-X 1기',
    period: '2024.10.01 ~ 2024.12.15',
    status: '종료',
    statusColor: 'gray',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    action: '아카이브 보기'
  },
  {
    id: 'ai-x-4th',
    name: 'AI-X 4기',
    period: '2025.09.01 ~ 2025.11.15',
    status: '기획 중',
    statusColor: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    action: '기획 보기'
  }
]

function DashboardPage({ navigate }) {
  const [selectedCohort, setSelectedCohort] = useState('')
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [newCohortForm, setNewCohortForm] = useState({
    cohortName: '',
    startDate: '',
    endDate: '',
    orientationDate: '',
    deepLearning1Date: '',
    deepLearning2Date: '',
    careerLectureDate: '',
    miniProjectDate: '',
    planningPresentationDate: '',
    collaborationLectureDate: '',
    midPresentationDate: '',
    industryLectureDate: '',
    finalPresentationDate: '',
    expectedStudents: '',
    operationMode: 'hybrid',
    cohortStatus: 'planning'
  })

  const scrollContainerRef = useRef(null)

  useEffect(() => {
    updateScrollButtons()
  }, [])

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      logger.info('로그아웃')
      authService.logout()
      if (navigate) {
        navigate('/login')
      }
    }
  }

  const goToCohort = (cohortId) => {
    if (cohortId) {
      logger.info('기수 선택:', cohortId)
      if (navigate) {
        navigate('/main-dashboard')
      }
    }
  }

  const scrollCohortList = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 320 // 카드 폭 + 간격
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount
    } else {
      container.scrollLeft += scrollAmount
    }
    
    setTimeout(updateScrollButtons, 100)
  }

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setShowLeftButton(container.scrollLeft > 0)
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  const handleFormChange = (field, value) => {
    setNewCohortForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const createNewCohort = (event) => {
    event.preventDefault()
    
    const { cohortName, startDate, endDate, expectedStudents, operationMode, cohortStatus } = newCohortForm
    
    // 주요 일정 요약 생성
    const scheduleItems = []
    if (newCohortForm.orientationDate) scheduleItems.push(`OT: ${newCohortForm.orientationDate}`)
    if (newCohortForm.deepLearning1Date) scheduleItems.push(`딥러닝 특강 1일차: ${newCohortForm.deepLearning1Date}`)
    if (newCohortForm.deepLearning2Date) scheduleItems.push(`딥러닝 특강 2일차: ${newCohortForm.deepLearning2Date}`)
    if (newCohortForm.careerLectureDate) scheduleItems.push(`취업 특강: ${newCohortForm.careerLectureDate}`)
    if (newCohortForm.miniProjectDate) scheduleItems.push(`미니프로젝트 발표: ${newCohortForm.miniProjectDate}`)
    if (newCohortForm.planningPresentationDate) scheduleItems.push(`기획 발표: ${newCohortForm.planningPresentationDate}`)
    if (newCohortForm.collaborationLectureDate) scheduleItems.push(`협업 특강: ${newCohortForm.collaborationLectureDate}`)
    if (newCohortForm.midPresentationDate) scheduleItems.push(`중간 발표: ${newCohortForm.midPresentationDate}`)
    if (newCohortForm.industryLectureDate) scheduleItems.push(`현직자 특강: ${newCohortForm.industryLectureDate}`)
    if (newCohortForm.finalPresentationDate) scheduleItems.push(`최종발표: ${newCohortForm.finalPresentationDate}`)
    
    const scheduleText = scheduleItems.length > 0 ? `\n\n주요 일정:\n${scheduleItems.join('\n')}` : ''
    
    const operationModeText = {
      'hybrid': '하이브리드',
      'online': '온라인',
      'offline': '오프라인'
    }[operationMode]
    
    const statusText = {
      'planning': '기획 중',
      'recruiting': '모집 중',
      'ready': '시작 대기'
    }[cohortStatus]
    
    const confirmMessage = `${cohortName}을(를) 생성하시겠습니까?
      
기간: ${startDate} ~ ${endDate}
예상 수강생: ${expectedStudents || '미정'}명
운영 방식: ${operationModeText}
상태: ${statusText}${scheduleText}`
    
    if (window.confirm(confirmMessage)) {
      const cohortData = {
        name: cohortName,
        startDate,
        endDate,
        schedule: {
          orientation: newCohortForm.orientationDate,
          deepLearning1: newCohortForm.deepLearning1Date,
          deepLearning2: newCohortForm.deepLearning2Date,
          careerLecture: newCohortForm.careerLectureDate,
          miniProject: newCohortForm.miniProjectDate,
          planningPresentation: newCohortForm.planningPresentationDate,
          collaborationLecture: newCohortForm.collaborationLectureDate,
          midPresentation: newCohortForm.midPresentationDate,
          industryLecture: newCohortForm.industryLectureDate,
          finalPresentation: newCohortForm.finalPresentationDate
        },
        settings: {
          expectedStudents: expectedStudents || null,
          operationMode,
          status: cohortStatus
        }
      }
      
      logger.info('새 기수 생성:', cohortData)
      alert(`${cohortName}이(가) 성공적으로 생성되었습니다!\n해당 기수 페이지로 이동합니다.`)
      
      // 폼 초기화
      setNewCohortForm({
        cohortName: '',
        startDate: '',
        endDate: '',
        orientationDate: '',
        deepLearning1Date: '',
        deepLearning2Date: '',
        careerLectureDate: '',
        miniProjectDate: '',
        planningPresentationDate: '',
        collaborationLectureDate: '',
        midPresentationDate: '',
        industryLectureDate: '',
        finalPresentationDate: '',
        expectedStudents: '',
        operationMode: 'hybrid',
        cohortStatus: 'planning'
      })
    }
  }

  return (
    <div className="p-6" style={{ overflowX: 'hidden' }}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 헤더 */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">📁 AI-X 전체 기수 관리</h1>
            <p className="text-gray-600">운영자 권회은 님, 총 3개 기수를 관리 중입니다.</p>
          </div>
          <div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              🚪 로그아웃
            </button>
          </div>
        </header>

        {/* 전체 기수 목록 */}
        <section className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🗂 기수 목록</h2>
            <select 
              className="border p-2 rounded w-full md:w-1/3 ml-4" 
              value={selectedCohort}
              onChange={(e) => {
                setSelectedCohort(e.target.value)
                goToCohort(e.target.value)
              }}
            >
              <option value="" disabled>기수를 선택하세요</option>
              <option value="ai-x-3rd">AI-X 3기 (진행 중)</option>
              <option value="ai-x-2nd">AI-X 2기 (종료)</option>
              <option value="ai-x-1st">AI-X 1기 (종료)</option>
              <option value="ai-x-4th">AI-X 4기 (기획 중)</option>
            </select>
          </div>
          
          {/* 스와이프 가능한 기수 카드 컨테이너 */}
          <div className="relative">
            {/* 좌측 스크롤 버튼 */}
            <button 
              onClick={() => scrollCohortList('left')}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors ${
                showLeftButton ? 'opacity-100' : 'opacity-30 pointer-events-none'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            {/* 우측 스크롤 버튼 */}
            <button 
              onClick={() => scrollCohortList('right')}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors ${
                showRightButton ? 'opacity-100' : 'opacity-30 pointer-events-none'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            {/* 스크롤 가능한 기수 카드 리스트 */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth mx-8 hide-scrollbar"
              onScroll={updateScrollButtons}
            >
              
              {cohortData.map((cohort) => (
                <div 
                  key={cohort.id}
                  className={`flex-shrink-0 w-80 border rounded-lg p-4 text-sm ${cohort.bgColor}`}
                >
                  <h3 className="font-bold">{cohort.name}</h3>
                  <p>운영 기간: {cohort.period}</p>
                  <p>
                    상태: <span className={`font-semibold ${cohort.textColor}`}>{cohort.status}</span>
                  </p>
                  <button 
                    onClick={() => goToCohort(cohort.id)}
                    className="mt-2 text-blue-600 underline"
                  >
                    {cohort.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 신규 기수 생성 */}
        <section className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">➕ 새 기수 생성</h2>
          <form className="space-y-4" onSubmit={createNewCohort}>
            {/* 기본 정보 */}
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">기수 이름</label>
                <input 
                  type="text" 
                  placeholder="예: AI-X 4기" 
                  className="w-full border p-2 rounded text-sm" 
                  required
                  value={newCohortForm.cohortName}
                  onChange={(e) => handleFormChange('cohortName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">시작일</label>
                <input 
                  type="date" 
                  className="w-full border p-2 rounded text-sm" 
                  required
                  value={newCohortForm.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">종료일</label>
                <input 
                  type="date" 
                  className="w-full border p-2 rounded text-sm" 
                  required
                  value={newCohortForm.endDate}
                  onChange={(e) => handleFormChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* 주요 일정 */}
            <div className="border-t pt-4">
              <h3 className="text-base font-semibold mb-3">📅 주요 일정</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">OT (오리엔테이션)</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.orientationDate}
                    onChange={(e) => handleFormChange('orientationDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">딥러닝 특강 1일차</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.deepLearning1Date}
                    onChange={(e) => handleFormChange('deepLearning1Date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">딥러닝 특강 2일차</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.deepLearning2Date}
                    onChange={(e) => handleFormChange('deepLearning2Date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">취업 특강</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.careerLectureDate}
                    onChange={(e) => handleFormChange('careerLectureDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">미니프로젝트 발표</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.miniProjectDate}
                    onChange={(e) => handleFormChange('miniProjectDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">기획 발표</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.planningPresentationDate}
                    onChange={(e) => handleFormChange('planningPresentationDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">협업 특강</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.collaborationLectureDate}
                    onChange={(e) => handleFormChange('collaborationLectureDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">중간 발표</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.midPresentationDate}
                    onChange={(e) => handleFormChange('midPresentationDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">현직자 특강</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.industryLectureDate}
                    onChange={(e) => handleFormChange('industryLectureDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">최종발표</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.finalPresentationDate}
                    onChange={(e) => handleFormChange('finalPresentationDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 추가 설정 */}
            <div className="border-t pt-4">
              <h3 className="text-base font-semibold mb-3">⚙️ 기수 설정</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">예상 수강생 수</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    className="w-full border p-2 rounded text-sm" 
                    min="1" 
                    max="100"
                    value={newCohortForm.expectedStudents}
                    onChange={(e) => handleFormChange('expectedStudents', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">운영 방식</label>
                  <select 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.operationMode}
                    onChange={(e) => handleFormChange('operationMode', e.target.value)}
                  >
                    <option value="hybrid">하이브리드</option>
                    <option value="online">온라인</option>
                    <option value="offline">오프라인</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">기수 상태</label>
                  <select 
                    className="w-full border p-2 rounded text-sm"
                    value={newCohortForm.cohortStatus}
                    onChange={(e) => handleFormChange('cohortStatus', e.target.value)}
                  >
                    <option value="planning">기획 중</option>
                    <option value="recruiting">모집 중</option>
                    <option value="ready">시작 대기</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold text-sm">
              📝 기수 생성하기
            </button>
          </form>
        </section>

      </div>
    </div>
  )
}

export default DashboardPage 