import React, { useState } from 'react';

// TODO: 실제 데이터/이벤트 핸들러는 추후 구현

const TeamManagement = ({ navigate }) => {
  // 더미 상태
  const [formationMethod, setFormationMethod] = useState('balanced');
  const [teamSize, setTeamSize] = useState('5');
  const [consider, setConsider] = useState({
    gender: true,
    major: true,
    experience: true,
    personality: false,
  });

  // 더미 팀 데이터
  const teams = [
    {
      id: 1,
      name: '1조 - AI Innovators',
      color: 'blue',
      size: 4,
      members: [
        { name: '김하늘', leader: true },
        { name: '박민서' },
        { name: '송지우' },
        { name: '최예린' },
      ],
      mentor: '정기수',
    },
    {
      id: 2,
      name: '2조 - Data Wizards',
      color: 'green',
      size: 5,
      members: [
        { name: '이현서', leader: true },
        { name: '최창재' },
        { name: '배경관' },
        { name: '한소영' },
        { name: '김민수' },
      ],
      mentor: '김영희',
    },
    {
      id: 3,
      name: '3조 - Vision Masters',
      color: 'purple',
      size: 4,
      members: [
        { name: '강민준', leader: true },
        { name: '윤서진' },
        { name: '정다은' },
        { name: '이지원' },
      ],
      mentor: '박철수',
    },
    {
      id: 4,
      name: '4조 - Deep Learners',
      color: 'red',
      size: 5,
      members: [
        { name: '오태현', leader: true },
        { name: '이수빈' },
        { name: '정유진' },
        { name: '박지민' },
        { name: '최수연' },
      ],
      mentor: '이정훈',
    },
  ];

  // 수강생 더미 데이터
  const [studentSearch, setStudentSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const students = [
    { name: '김하늘', team: '1조', teamColor: 'blue', role: '👑 리더', roleColor: 'yellow', initial: '김', avatarColor: 'bg-blue-500' },
    { name: '이현서', team: '2조', teamColor: 'green', role: '👑 리더', roleColor: 'yellow', initial: '이', avatarColor: 'bg-green-500' },
    { name: '강민준', team: '3조', teamColor: 'purple', role: '👑 리더', roleColor: 'yellow', initial: '강', avatarColor: 'bg-purple-500' },
    { name: '오태현', team: '4조', teamColor: 'red', role: '👑 리더', roleColor: 'yellow', initial: '오', avatarColor: 'bg-red-500' },
    { name: '김도윤', team: '5조', teamColor: 'yellow', role: '👑 리더', roleColor: 'yellow', initial: '김', avatarColor: 'bg-yellow-500' },
    { name: '박민서', team: '1조', teamColor: 'blue', role: '멤버', roleColor: 'gray', initial: '박', avatarColor: 'bg-blue-400' },
    { name: '송지우', team: '1조', teamColor: 'blue', role: '멤버', roleColor: 'gray', initial: '송', avatarColor: 'bg-blue-400' },
    { name: '최예린', team: '1조', teamColor: 'blue', role: '멤버', roleColor: 'gray', initial: '최', avatarColor: 'bg-blue-400' },
    { name: '최창재', team: '2조', teamColor: 'green', role: '멤버', roleColor: 'gray', initial: '최', avatarColor: 'bg-green-400' },
    { name: '배경관', team: '2조', teamColor: 'green', role: '멤버', roleColor: 'gray', initial: '배', avatarColor: 'bg-green-400' },
  ];

  // 필터링된 학생 목록
  const filteredStudents = students.filter(s =>
    (studentSearch === '' || s.name.includes(studentSearch)) &&
    (teamFilter === '' || s.team === teamFilter + '조')
  );

  // 더미 핸들러
  const handleFormationMethod = (e) => setFormationMethod(e.target.value);
  const handleTeamSize = (e) => setTeamSize(e.target.value);
  const handleConsider = (key) => setConsider((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleStudentSearch = (e) => setStudentSearch(e.target.value);
  const handleTeamFilter = (e) => setTeamFilter(e.target.value);
  const handleExport = () => alert('명단 내보내기 기능은 추후 구현됩니다.');
  const handleAddStudent = () => alert('수강생 추가 기능은 추후 구현됩니다.');
  const handleRemoveStudent = (name) => alert(`${name} 삭제 기능은 추후 구현됩니다.`);

  const handleGoToDashboard = () => {
    navigate('/main-dashboard');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button onClick={handleGoToDashboard} className="text-indigo-600 hover:text-indigo-800">← 메인으로</button>
              <h1 className="text-2xl font-bold text-indigo-700">👥 팀 관리 시스템</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">운영자: 권회은</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 자동 조 편성 시스템 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            자동 조 편성 시스템
          </h2>
          <form className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">조 편성 방식</label>
              <select value={formationMethod} onChange={handleFormationMethod} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="balanced">균형 편성 (전공/성비 고려)</option>
                <option value="skill">실력 균등 분배</option>
                <option value="preference">선호도 기반</option>
                <option value="random">완전 랜덤</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">조당 인원 수</label>
              <select value={teamSize} onChange={handleTeamSize} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="4">4명</option>
                <option value="5">5명</option>
                <option value="6">6명</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">편성 고려사항</label>
              <div className="grid md:grid-cols-4 gap-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={consider.gender} onChange={() => handleConsider('gender')} className="mr-2" />
                  <span className="text-sm">성비 균등</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={consider.major} onChange={() => handleConsider('major')} className="mr-2" />
                  <span className="text-sm">전공 분산</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={consider.experience} onChange={() => handleConsider('experience')} className="mr-2" />
                  <span className="text-sm">경험 수준</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={consider.personality} onChange={() => handleConsider('personality')} className="mr-2" />
                  <span className="text-sm">성격 유형</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex space-x-4">
                <button type="button" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">자동 조 편성 실행</button>
                <button type="button" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">수동 편성 모드</button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800">설문 데이터 현황</h4>
                    <p className="text-sm text-blue-700">
                      <span>25명 완료 / 28명 전체 (89.3%)</span>
                      <span className="mx-2">•</span>
                      <span>마지막 업데이트: 2024.01.11 14:30</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">설문 데이터 불러오기</button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">설문 관리</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* 현재 조 편성 현황 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            AI-X 3기 조 편성 현황
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className={`border border-${team.color}-200 rounded-lg p-4 bg-${team.color}-50`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <input type="text" value={team.name} readOnly className={`font-bold text-${team.color}-800 bg-transparent border-b border-${team.color}-300 focus:outline-none focus:border-${team.color}-600`} />
                  </div>
                  <span className={`bg-${team.color}-600 text-white px-2 py-1 rounded-full text-xs`}>{team.size}명</span>
                </div>
                <div className="space-y-2 text-sm">
                  {team.members.map((member, idx) => (
                    <div key={idx} className={`flex items-center justify-between cursor-pointer hover:bg-${team.color}-100 p-1 rounded`}>
                      <span>{member.name} {member.leader && '👑'}</span>
                      <button className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <p>담당 멘토: <input type="text" value={team.mentor} readOnly className={`bg-transparent border-b border-gray-300 focus:outline-none focus:border-${team.color}-600 text-gray-800 font-medium`} style={{ width: 60 }} /></p>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className={`bg-${team.color}-600 text-white px-3 py-1 rounded text-xs hover:bg-${team.color}-700`}>관리</button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">진행률</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 수강생 관리 섹션 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              수강생 관리
            </h2>
            <button onClick={handleAddStudent} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">수강생 추가</button>
          </div>
          {/* 검색 및 필터 */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input type="text" value={studentSearch} onChange={handleStudentSearch} placeholder="이름으로 검색..." className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <select value={teamFilter} onChange={handleTeamFilter} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">전체 조</option>
              <option value="1">1조</option>
              <option value="2">2조</option>
              <option value="3">3조</option>
              <option value="4">4조</option>
              <option value="5">5조</option>
            </select>
            <button onClick={handleExport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">명단 내보내기</button>
          </div>
          {/* 수강생 목록 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">삭제</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((s, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${s.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-medium`}>{s.initial}</div>
                        <div className="ml-3">{s.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${s.teamColor}-100 text-${s.teamColor}-800`}>{s.team}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${s.roleColor}-100 text-${s.roleColor}-800`}>{s.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <button onClick={() => handleRemoveStudent(s.name)} className="text-red-500 hover:text-red-700 text-lg font-bold">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamManagement; 