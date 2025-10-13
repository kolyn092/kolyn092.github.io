# 개발 가이드

## 브랜치 전략

### 🌿 main 브랜치
- **용도**: 프로덕션 배포용
- **배포**: GitHub Pages 자동 배포
- **URL**: https://kolyn092.github.io/

### 🔧 develop 브랜치
- **용도**: 개발 및 테스트용
- **로컬 개발**: `npm run dev:local` 명령어 사용
- **URL**: http://localhost:3000/

## 개발 환경 설정

### 1. 개발 브랜치로 전환
```bash
git checkout develop
```

### 2. 로컬 개발 서버 실행
```bash
# 로컬 환경에서 개발 (홈페이지 경로가 루트로 설정됨)
npm run dev:local

# 또는 일반 개발 서버
npm run dev
```

### 3. 개발 서버 접속
- **로컬 URL**: http://localhost:3000/
- **아크그리드 시뮬레이터**: http://localhost:3000/#/ark-grid-optimizer

## 배포 프로세스

### 1. 개발 완료 후 main 브랜치로 병합
```bash
git checkout main
git merge develop
```

### 2. 프로덕션 빌드 및 배포
```bash
npm run build
npm run deploy
```

### 3. 변경사항 푸시
```bash
git add .
git commit -m "배포: 새로운 기능 추가"
git push origin main
```

## 스크립트 명령어

| 명령어 | 용도 | 환경 |
|--------|------|------|
| `npm start` | 기본 개발 서버 | GitHub Pages 경로 |
| `npm run dev` | 개발 서버 (별칭) | GitHub Pages 경로 |
| `npm run dev:local` | 로컬 개발 서버 | 로컬 경로 (/) |
| `npm run build` | 프로덕션 빌드 | - |
| `npm run deploy` | GitHub Pages 배포 | - |

## 주의사항

### 🔴 develop 브랜치에서 주의할 점
- `npm run dev:local` 사용 시 홈페이지 경로가 루트(/)로 설정됨
- 로컬에서 테스트할 때는 `#/ark-grid-optimizer` 경로로 접근

### 🟢 main 브랜치에서 주의할 점
- 배포 전에 반드시 `npm run build`로 빌드 테스트
- ESLint 경고가 있으면 배포 실패할 수 있음

## 문제 해결

### 로컬에서 빈 화면이 나올 때
1. 브라우저 캐시 클리어
2. `npm run dev:local` 재실행
3. `http://localhost:3000/#/ark-grid-optimizer` 직접 접근

### 배포가 안 될 때
1. ESLint 경고 확인: `npm run build`
2. GitHub Actions 로그 확인
3. `gh-pages` 브랜치 상태 확인
