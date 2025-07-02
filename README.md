# AI-X 교육과정 운영 시스템 프론트엔드

HTML 와이어프레임을 기반으로 한 리액트 프론트엔드 AI-X 교육과정 통합 운영 시스템

## 기술 스택

### 핵심 기술
- **언어**: JavaScript (ES2022+)
- **프레임워크**: React 19.x
- **상태 관리**: TanStack Query v5.x (React Query)
- **빌드 도구**: Vite
- **로깅**: Console API + 환경별 로그 레벨

## 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 프로젝트 클론 및 설치
```bash
# 저장소 클론
git clone <repository-url>
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속할 수 있습니다.

### 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Hot Reload 포함) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run preview` | 빌드된 앱 미리보기 |
| `npm run test` | 테스트 실행 |
| `npm run test:watch` | 테스트 감시 모드 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |

## 프로젝트 구조

```
frontend/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── ui/            # UI 기본 컴포넌트
│   │   └── index.js       # 컴포넌트 export
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── CohortDetailPage.jsx    # 코호트 상세 페이지
│   │   ├── DashboardPage.jsx       # 대시보드 페이지
│   │   ├── LoginPage.jsx           # 로그인 페이지
│   │   ├── MainDashboard.jsx       # 메인 대시보드
│   │   └── index.js               # 페이지 export
│   ├── hooks/             # 커스텀 훅
│   ├── services/          # API 서비스 및 데이터 fetching
│   ├── utils/             # 유틸리티 함수
│   │   ├── auth.js        # 인증 관련 유틸
│   │   └── logger.js      # 로깅 유틸
│   ├── test/              # 테스트 설정 및 헬퍼
│   ├── App.jsx            # 메인 앱 컴포넌트
│   ├── App.css            # 앱 스타일
│   ├── index.css          # 글로벌 스타일
│   └── main.jsx           # 애플리케이션 진입점
├── .gitignore             # Git 무시 파일 설정
├── eslint.config.js       # ESLint 설정
├── index.html             # HTML 템플릿
├── package.json           # 프로젝트 의존성 및 스크립트
├── postcss.config.js      # PostCSS 설정
├── tailwind.config.js     # Tailwind CSS 설정
├── vite.config.js         # Vite 빌드 설정
├── vitest.config.js       # Vitest 테스트 설정
└── README.md              # 프로젝트 문서
```

### 주요 디렉토리 설명

- **`src/components/`**: 재사용 가능한 UI 컴포넌트들
- **`src/pages/`**: 라우팅되는 페이지 컴포넌트들
- **`src/hooks/`**: 커스텀 React 훅들
- **`src/services/`**: API 호출 및 데이터 관리 로직
- **`src/utils/`**: 순수 함수 및 헬퍼 유틸리티들
- **`src/test/`**: 테스트 설정 파일들

## 개발 정책

### TDD 프로세스
1. 테스트 코드 작성 (Red)
2. 최소한의 코딩 (Green)
3. 테스트 실행
4. 테스트 에러 없을 때까지 반복 수정 (Refactor)

### SOLID 원칙 준수
- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle
