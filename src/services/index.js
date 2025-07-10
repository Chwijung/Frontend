// API 서비스 export용 index 파일
// 향후 API 서비스들이 추가되면 여기서 export 합니다. 

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

// 수강생 목록 조회 (검색/필터)
export const fetchStudents = async (params = {}, token) => {
  const res = await axios.get(`${API_BASE}/users/students`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 수강생 추가
export const addStudent = async (student, token) => {
  const res = await axios.post(`${API_BASE}/users/students`, student, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 수강생 삭제
export const deleteStudent = async (userId, token) => {
  const res = await axios.delete(`${API_BASE}/users/students/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 팀(조) 리스트 조회
export const fetchTeams = async () => {
  const res = await axios.get(`${API_BASE}/users/teams`);
  return res.data;
}; 