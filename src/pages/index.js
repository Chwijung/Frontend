// 페이지 컴포넌트 export용 index 파일
// 향후 페이지들이 추가되면 여기서 export 합니다. 
import MainDashboard from './MainDashboard';
import TeamManagement from './TeamManagement';

export {
  MainDashboard,
  TeamManagement,
};

export { default as LoginPage } from './LoginPage'
export { default as DashboardPage } from './DashboardPage'
export { default as MainDashboard } from './MainDashboard'
export { default as CohortDetailPage } from './CohortDetailPage' 