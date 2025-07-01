import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { logger } from '../utils/logger'

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend)

function CohortDetailPage({ navigate }) {
  // URL에서 cohortId 추출
  const getCurrentCohortId = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      const matches = path.match(/\/cohort-detail\/(.+)/)
      return matches ? matches[1] : 'ai-x-3rd'
    }
    return 'ai-x-3rd'
  }

  const [currentCohort, setCurrentCohort] = useState(getCurrentCohortId())

  // 기수별 상세 데이터
  const cohortData = {
    'ai-x-3rd': {
      name: 'AI-X 3기',
      status: '진행중',
      statusColor: 'bg-blue-600',
      period: '2025.06.18 ~ 2025.08.30',
      students: '24명 (8개 조)',
      progress: 45,
      currentPhase: '현재 중간 발표 준비중'
    },
    'ai-x-2nd': {
      name: 'AI-X 2기',
      status: '완료',
      statusColor: 'bg-green-600',
      period: '2025.03.01 ~ 2025.05.20',
      students: '18명 (6개 조)',
      progress: 100,
      currentPhase: '과정 완료'
    },
    'ai-x-1st': {
      name: 'AI-X 1기',
      status: '완료',
      statusColor: 'bg-green-600',
      period: '2024.10.01 ~ 2024.12.15',
      students: '15명 (5개 조)',
      progress: 100,
      currentPhase: '과정 완료'
    }
  }

  const currentInfo = cohortData[currentCohort] || cohortData['ai-x-3rd']

  // 실시간 통계 데이터
  const statistics = [
    {
      value: '24',
      label: '수강생',
      color: 'text-blue-800',
      bgColor: 'bg-blue-200',
      borderColor: 'border-blue-200',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      )
    },
    {
      value: '18',
      label: '과제 제출',
      color: 'text-green-800',
      bgColor: 'bg-green-200',
      borderColor: 'border-green-200',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      value: '6',
      label: '미제출',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-200',
      borderColor: 'border-yellow-200',
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      value: '32',
      label: '멘토링 기록',
      color: 'text-purple-800',
      bgColor: 'bg-purple-200',
      borderColor: 'border-purple-200',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      )
    }
  ]

  // 다음 일정 데이터
  const upcomingSchedule = [
    {
      title: '📊 중간 발표',
      date: '07.25 (목)',
      description: '멘토링 10회차 - 각 조별 중간 발표',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      dateColor: 'text-orange-600'
    },
    {
      title: '💼 현직자 특강',
      date: '07.27 (토)',
      description: '중간 발표 주 토요일',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      dateColor: 'text-blue-600'
    }
  ]

  // 빠른 관리 메뉴
  const quickMenus = [
    {
      title: '수강생 관리',
      icon: (
        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      ),
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => handleNavigate('수강생 관리')
    },
    {
      title: '조 관리',
      icon: (
        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => handleNavigate('조 관리')
    },
    {
      title: '멘토링',
      icon: (
        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      ),
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      action: () => handleNavigate('멘토링')
    },
    {
      title: '프로젝트',
      icon: (
        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      ),
      bgColor: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      action: () => handleNavigate('프로젝트')
    }
  ]

  // 전체 일정 데이터
  const scheduleWeeks = [
    {
      title: '1주차 (2025.06.18 - 2025.06.24)',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      events: [
        { title: '📝 OT 및 팀 매칭', date: '06.18 (수)' },
        { title: '📚 딥러닝 특강 1일차', date: '06.19 (목)' },
        { title: '📚 딥러닝 특강 2일차', date: '06.20 (금)' },
        { title: 'ℹ️ 과정 안내', date: '06.21 (토)' }
      ]
    },
    {
      title: '2주차 (2025.06.25 - 2025.07.01)',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      events: [
        { title: '💼 취업 특강 (멘토링 4회차)', date: '06.27 (목)' },
        { title: '📊 미니프로젝트 발표 (멘토링 3회차)', date: '06.28 (금)' }
      ]
    },
    {
      title: '3-4주차 (2025.07.02 - 2025.07.15)',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      events: [
        { title: '📋 기획 발표 (멘토링 5회차)', date: '07.04 (목)' },
        { title: '🤝 협업 특강', date: '07.06 (토)' }
      ]
    },
    {
      title: '5-6주차 (2025.07.16 - 2025.07.29) - 현재 진행중',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-800',
      isCurrent: true,
      events: [
        { title: '📊 중간 발표 (멘토링 10회차)', date: '07.25 (목) - 예정', isUpcoming: true },
        { title: '💼 현직자 특강', date: '07.27 (토)' }
      ]
    },
    {
      title: '7-8주차 (2025.07.30 - 2025.08.12)',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      events: [
        { title: '⚡ 최종 발표 D-2', date: '08.10 (토)' },
        { title: '⚡ 최종 발표 D-1', date: '08.11 (일)' },
        { title: '🎉 최종 발표', date: '08.12 (월)' }
      ]
    }
  ]

  const handleNavigate = (page) => {
    logger.info('페이지 이동:', page)
    alert(`${page} 페이지로 이동합니다. (구현 예정)`)
  }

  const handleEditCohortInfo = () => {
    alert('기수 정보 수정 모달을 엽니다.\n\n수정 가능 항목:\n• 기수 이름\n• 교육 기간\n• 수강생 수\n• 멘토링 일정')
  }

  const handleGenerateReport = () => {
    alert('📊 기수 보고서를 생성합니다...\n\n포함 내용:\n• 수강생 현황 및 출석률\n• 과제 제출 통계\n• 멘토링 기록 요약\n• 프로젝트 진행 상황\n• 예산 사용 내역')
  }

  const handleModifySchedule = () => {
    alert('📅 일정 수정 모드로 전환합니다.\n\n수정 가능 항목:\n• 일정 날짜 변경\n• 새 일정 추가\n• 일정 삭제\n• 일정 설명 수정')
  }

  const handleExportSchedule = () => {
    if (confirm('일정을 어떤 형식으로 내보내시겠습니까?\n\nOK: Excel 파일\nCancel: PDF 파일')) {
      alert('📊 Excel 형식으로 일정을 내보냅니다.')
    } else {
      alert('📄 PDF 형식으로 일정을 내보냅니다.')
    }
  }

  const handleBackToDashboard = () => {
    navigate && navigate('/main-dashboard')
  }

  // URL 변경 감지 및 cohortId 업데이트
  useEffect(() => {
    const cohortId = getCurrentCohortId()
    if (cohortData[cohortId]) {
      setCurrentCohort(cohortId)
    }
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDashboard}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← 메인페이지로
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                📅 {currentInfo.name} 상세 관리
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">운영자: 권회은</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 기수 상태 정보 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-blue-800">{currentInfo.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`${currentInfo.statusColor} text-white px-3 py-1 rounded-full text-sm`}>
                  {currentInfo.status}
                </span>
                <span className="text-gray-600">📅 {currentInfo.period}</span>
                <span className="text-gray-600">👥 {currentInfo.students}</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">진행률:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${currentInfo.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{currentInfo.progress}%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{currentInfo.currentPhase}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleEditCohortInfo}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                ✏️ 정보 수정
              </button>
              <button 
                onClick={handleGenerateReport}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                📊 보고서 생성
              </button>
            </div>
          </div>
        </section>

        {/* 빠른 통계 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            실시간 통계
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className={`bg-white p-6 rounded-lg border ${stat.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className={`text-sm ${stat.color}`}>{stat.label}</div>
                  </div>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주요 일정 및 관리 메뉴 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 다음 일정 */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              다음 일정
            </h2>
            <div className="space-y-3">
              {upcomingSchedule.map((schedule, index) => (
                <div key={index} className={`${schedule.bgColor} border ${schedule.borderColor} p-3 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${schedule.textColor}`}>{schedule.title}</span>
                    <span className={`text-sm ${schedule.dateColor}`}>{schedule.date}</span>
                  </div>
                  <p className={`text-sm ${schedule.dateColor} mt-1`}>{schedule.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 빠른 관리 메뉴 */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              빠른 관리
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickMenus.map((menu, index) => (
                <button 
                  key={index}
                  onClick={menu.action}
                  className={`${menu.bgColor} text-white p-3 rounded-lg ${menu.hoverColor} transition-colors`}
                >
                  {menu.icon}
                  <div className="text-sm">{menu.title}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* 전체 일정 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {currentInfo.name} 전체 일정
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleModifySchedule}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                ✏️ 일정 수정
              </button>
              <button 
                onClick={handleExportSchedule}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                📤 일정 내보내기
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {scheduleWeeks.map((week, weekIndex) => (
              <div 
                key={weekIndex} 
                className={`border ${week.isCurrent ? 'border-2 ' + week.borderColor : week.borderColor} rounded-lg p-4 ${week.bgColor}`}
              >
                <h3 className={`font-bold ${week.textColor} mb-2`}>{week.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {week.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="space-y-2">
                      <div className={`flex items-center justify-between p-2 bg-white rounded border ${event.isUpcoming ? 'border-orange-300' : ''}`}>
                        <span className="text-sm">{event.title}</span>
                        <span className={`text-xs ${event.isUpcoming ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                          {event.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CohortDetailPage 