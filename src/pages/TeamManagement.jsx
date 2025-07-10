import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStudents, deleteStudent, fetchTeams } from '../services';

// CSV 변환 및 다운로드 함수
function downloadCSV(students) {
  if (!students || students.length === 0) return;
  const header = ['이름', '조', '역할', '이메일', '아이디'];
  const rows = students.map(s => [
    s.full_name,
    s.team_id || '-',
    s.role === 'student' ? '멤버' : s.role,
    s.email,
    s.username
  ]);
  const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'students.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const TEAM_COLORS = [
  'blue', 'green', 'purple', 'red', 'yellow', 'pink', 'indigo', 'gray'
];

const TeamManagement = ({ navigate }) => {
  // 로컬 UI 상태
  const [formationMethod, setFormationMethod] = useState('balanced');
  const [teamSize, setTeamSize] = useState('5');
  const [consider, setConsider] = useState({
    gender: true,
    major: true,
    experience: true,
    personality: false,
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  // 서버 데이터: react-query로 관리
  const { data: teamsData = [], isLoading: teamsLoading, error: teamsError } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 5 * 60 * 1000,
  });

  const { data: studentsData = [], isLoading: studentsLoading, error: studentsError } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchStudents({}, token),
    staleTime: 1 * 60 * 1000,
  });

  // 삭제 mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (userId) => deleteStudent(userId, token),
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });

  // 팀 드롭다운 옵션 ("전체 조" 포함)
  const teams = useMemo(() => [{ id: '', name: '전체 조' }, ...teamsData], [teamsData]);

  // 필터링된 학생 리스트
  const students = useMemo(() => {
    let filtered = studentsData;
    if (studentSearch) filtered = filtered.filter(s => s.full_name.includes(studentSearch));
    if (teamFilter) filtered = filtered.filter(s => s.team_id === teamFilter);
    return filtered;
  }, [studentsData, studentSearch, teamFilter]);

  // 대시보드용 팀별 그룹핑
  const dashboardTeams = useMemo(() => {
    const teamsMap = {};
    (teamsData || []).forEach(team => {
      if (!team.id) return;
      teamsMap[team.id] = { id: team.id, name: team.name, members: [] };
    });
    (studentsData || []).forEach(s => {
      if (!s.team_id) return;
      if (teamsMap[s.team_id]) teamsMap[s.team_id].members.push(s);
    });
    return Object.values(teamsMap).sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [teamsData, studentsData]);

  // 핸들러
  const handleRemoveStudent = async (userId, name) => {
    if (!window.confirm(`${name} 학생을 삭제하시겠습니까?`)) return;
    await deleteStudentMutation.mutateAsync(userId);
  };
  const handleFormationMethod = (e) => setFormationMethod(e.target.value);
  const handleTeamSize = (e) => setTeamSize(e.target.value);
  const handleConsider = (key) => setConsider((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleStudentSearch = (e) => setStudentSearch(e.target.value);
  const handleTeamFilter = (e) => setTeamFilter(e.target.value);
  const handleExport = () => downloadCSV(students);
  const handleAddStudent = () => alert('수강생 추가 기능은 추후 구현됩니다.');
  const handleGoToDashboard = () => navigate('/main-dashboard');

  // 로딩/에러 처리
  if (teamsLoading || studentsLoading) return <div>불러오는 중...</div>;
  if (teamsError || studentsError) return <div>에러 발생: {teamsError?.message || studentsError?.message}</div>;

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
            {dashboardTeams.map((team, idx) => {
              const color = TEAM_COLORS[idx % TEAM_COLORS.length];
              return (
                <div key={team.id} className={`border border-${color}-200 rounded-lg p-4 bg-${color}-50`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <input type="text" value={team.name} readOnly className={`font-bold text-${color}-800 bg-transparent border-b border-${color}-300 focus:outline-none focus:border-${color}-600`} />
                    </div>
                    <span className={`bg-${color}-600 text-white px-2 py-1 rounded-full text-xs`}>{team.members.length}명</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {team.members.map((member, idx2) => (
                      <div key={member.id} className={`flex items-center justify-between cursor-pointer hover:bg-${color}-100 p-1 rounded`}>
                        <span>{member.full_name} {member.role === 'leader' && '👑'}</span>
                        <button className="text-red-500 hover:text-red-700">✕</button>
                      </div>
                    ))}
                  </div>
                  {/* 멘토 정보는 백엔드에서 추가 제공 시 표시 가능 */}
                  <div className="mt-3 flex space-x-2">
                    <button className={`bg-${color}-600 text-white px-3 py-1 rounded text-xs hover:bg-${color}-700`}>관리</button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">진행률</button>
                  </div>
                </div>
              );
            })}
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
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <button onClick={handleExport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">명단 내보내기</button>
          </div>
          {/* 수강생 목록 테이블 */}
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <div className="text-center py-8">수강생이 없습니다.</div>
            ) : (
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
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">{s.full_name[0]}</div>
                          <div className="ml-3">{s.full_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{s.team_name || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{s.role === 'student' ? '멤버' : s.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => handleRemoveStudent(s.id, s.full_name)} className="text-red-500 hover:text-red-700 text-lg font-bold">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamManagement; 