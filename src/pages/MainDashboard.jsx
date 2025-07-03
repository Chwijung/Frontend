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

function MainDashboard({ navigate }) {
  const [currentCohort, setCurrentCohort] = useState('ai-x-3rd')
  const [alertCount, setAlertCount] = useState(3)

  // 기수별 데이터
  const cohortInfo = {
    'ai-x-3rd': {
      name: 'AI-X 3기',
      number: '3기',
      students: '24명',
      status: '진행중'
    },
    'ai-x-2nd': {
      name: 'AI-X 2기', 
      number: '2기',
      students: '18명',
      status: '완료'
    },
    'ai-x-1st': {
      name: 'AI-X 1기',
      number: '1기', 
      students: '15명',
      status: '완료'
    }
  }

  const currentInfo = cohortInfo[currentCohort]

  // 진행 현황 차트 데이터
  const chartData = {
    labels: ['채점 완료', '채점 대기', '출제 예정'],
    datasets: [{
      data: [35, 45, 20],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  // 실시간 알림 데이터
  const alerts = [
    {
      id: 1,
      message: '최종발표 7월 7일 예정',
      type: 'info',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      message: '2조 6월 25일 멘토링 일지 미작성',
      type: 'info',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200', 
      dotColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      id: 3,
      message: '3조 중간발표 산출물 미제출',
      type: 'alert',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      dotColor: 'bg-green-500 animate-pulse',
      textColor: 'text-green-600'
    },
    {
      id: 4,
      message: '3조 멘토링 일지 미작성',
      type: 'alert',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      dotColor: 'bg-green-500 animate-pulse',
      textColor: 'text-green-600'
    }
  ]

  const handleAlertClick = () => {
    const alertMessages = [
      '1. 김하늘 학습자 멘토링 일지 3일 미작성 (긴급)',
      '2. 7개 과제 채점 대기중 (주의)',
      '3. 이지윤 학습자 출석률 저조 80% - 상담 필요 (주의)'
    ]
    alert(`운영진 긴급 알림이 ${alertCount}개 있습니다!\n\n${alertMessages.join('\n')}`)
  }

  const handleCohortChange = (cohortId) => {
    setCurrentCohort(cohortId)
    logger.info('기수 변경:', cohortId)
  }

  const handleNavigate = (page) => {
    if (page === '수강생·조 관리') {
      navigate('/team-management');
    } else {
      logger.info('페이지 이동:', page);
      alert(`${page} 페이지로 이동합니다. (구현 예정)`);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* 헤더 */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate && navigate('/dashboard')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← 전체 기수 목록으로
              </button>
              <h1 className="text-2xl font-bold text-indigo-700">
                🎓 {currentInfo.name} 통합 운영 시스템
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">운영진: 권회은</span>
              <button 
                onClick={handleAlertClick}
                className="relative bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
              >
                🚨 긴급 알림 
                <span className="bg-white text-red-500 text-xs px-2 py-1 rounded-full ml-1">
                  {alertCount}
                </span>
              </button>
              <button 
                onClick={() => handleNavigate('시스템 관리')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                시스템 관리
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 메인 헤더 */}
        <header className="text-center py-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {currentInfo.name} 교육과정 운영 관리 시스템
          </h2>
          <p className="text-xl text-gray-600">
            {currentInfo.name} 운영진·코치를 위한 통합 관리 플랫폼
          </p>
        </header>

        {/* 핵심 기능 카드 */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* 기수 운영 관리 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate && navigate(`/cohort-detail/${currentCohort}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">{currentInfo.number}</span>
            </div>
            <h3 className="font-semibold text-gray-800">{currentInfo.number} 기수 운영 관리</h3>
            <p className="text-sm text-gray-600 mt-2">기수 상세 관리, 진행률 모니터링, 일정 관리</p>
          </div>

          {/* 팀 관리 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('수강생·조 관리')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-600">{currentInfo.students}</span>
            </div>
            <h3 className="font-semibold text-gray-800">수강생·조 관리</h3>
            <p className="text-sm text-gray-600 mt-2">조 편성, 출석 관리, 수강생 현황</p>
          </div>

          {/* 과제 시스템 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('과제 출제·평가')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-orange-600">7개 대기</span>
            </div>
            <h3 className="font-semibold text-gray-800">과제 출제·평가</h3>
            <p className="text-sm text-gray-600 mt-2">과제 등록, 제출 현황, 채점 관리</p>
          </div>
        </section>

        {/* 추가 기능 카드 */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* 수강생 설문 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('수강생 설문')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6l2 2h6a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H9a2 2 0 00-2 2v0z"></path>
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-green-600">89.3% 완료</span>
                <span className="text-xs text-orange-600">3명 미완료</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800">📝 수강생 설문</h3>
            <p className="text-sm text-gray-600 mt-2">팀 편성용 정보 수집, 설문 관리</p>
          </div>

          {/* 회의 스크럼 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('프로젝트 관리')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h10a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6-4h.01M17 11h.01"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-red-600">진행중</span>
            </div>
            <h3 className="font-semibold text-gray-800">프로젝트 관리</h3>
            <p className="text-sm text-gray-600 mt-2">데일리 체크인, 운영 회의, 진행 점검</p>
          </div>

          {/* 자료 보관소 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('교육자료 관리')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v2zm0 0h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-yellow-600">23% 사용</span>
            </div>
            <h3 className="font-semibold text-gray-800">교육자료 관리</h3>
            <p className="text-sm text-gray-600 mt-2">강의자료, 과제, 제출물 중앙 관리</p>
          </div>
        </section>

        {/* 추가 관리 기능 */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* 수강생 문의 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('수강생 문의')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-red-600">5개 미답변</span>
                <span className="text-xs text-emerald-600">12개 총 문의</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800">💬 수강생 문의</h3>
            <p className="text-sm text-gray-600 mt-2">학습 문의, 기술 지원, 상담 요청 관리</p>
          </div>

          {/* 멘토링 일지 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('멘토링 일지')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-red-600">3개 미작성</span>
                <span className="text-xs text-indigo-600">이번 주</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800">📋 멘토링 일지</h3>
            <p className="text-sm text-gray-600 mt-2">조별 멘토링 기록, 진행 상황 관리</p>
          </div>

          {/* 상담일정 관리 */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleNavigate('상담일정 관리')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-teal-600">15개 예정</span>
                <span className="text-xs text-orange-600">2개 수정 요청</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800">📅 상담일정 관리</h3>
            <p className="text-sm text-gray-600 mt-2">취업 상담, 개별 멘토링 스케줄 관리</p>
          </div>
        </section>

        {/* 스마트 포트폴리오 */}
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl p-8 text-white mb-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">🚀 스마트 포트폴리오 자동 생성기</h3>
            <p className="text-lg opacity-90 mb-6">학생 산출물을 자동으로 수집하여 취업용 포트폴리오 생성</p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-bold text-2xl">100%</p>
                <p className="text-sm">포트폴리오 완성률</p>
                <p className="text-xs opacity-75">↑ 70%에서 개선</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-bold text-2xl">15시간</p>
                <p className="text-sm">강사 시간 절약</p>
                <p className="text-xs opacity-75">주당</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-bold text-2xl">9.2점</p>
                <p className="text-sm">학생 만족도</p>
                <p className="text-xs opacity-75">↑ 7.1에서 개선</p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('포트폴리오 생성기')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              포트폴리오 생성기 열기 →
            </button>
          </div>
        </section>

        {/* 현재 진행 상황 */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* 실시간 알림 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM7 7h10v6H7V7z"></path>
              </svg>
              실시간 알림
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`flex items-center justify-between p-3 ${alert.bgColor} rounded-lg border ${alert.borderColor}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${alert.dotColor} rounded-full`}></div>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className={`text-xs ${alert.textColor}`}>{alert.type === 'info' ? '정보' : '알림'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 진행 현황 차트 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>{currentInfo.name} 진행 현황</span>
            </h3>
            <div className="relative h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MainDashboard 