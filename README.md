# 아크그리드 최적화 시뮬레이터 (React 버전)

아크그리드 최적화 시뮬레이터를 React로 구현한 버전입니다.

## 기능

- ⚖️ 질서/🌪️ 혼돈 페이지 전환
- 코어 설정 (해 코어, 달 코어, 별 코어)
- 젬 관리 (추가, 편집, 삭제)
- 최적화 알고리즘 실행
- 결과 표시
- 데이터 저장/불러오기
- 반응형 디자인

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── CoreCard.js     # 코어 카드 컴포넌트
│   ├── CoreSettings.js # 코어 설정 컴포넌트
│   ├── DataControls.js # 데이터 저장/불러오기 컨트롤
│   ├── GemCard.js      # 젬 카드 컴포넌트
│   ├── GemForm.js      # 젬 추가/편집 폼
│   ├── GemManagement.js # 젬 관리 컴포넌트
│   ├── Header.js       # 헤더 컴포넌트
│   ├── OptimizationButton.js # 최적화 버튼
│   ├── ResultCard.js   # 결과 카드 컴포넌트
│   └── Results.js      # 결과 표시 컴포넌트
├── context/            # React Context
│   └── AppContext.js  # 앱 상태 관리
├── utils/              # 유틸리티 함수
│   ├── gemCalculations.js # 젬 계산 함수
│   └── optimization.js   # 최적화 알고리즘
├── App.js              # 메인 앱 컴포넌트
├── index.js            # 앱 진입점
└── index.css           # 전역 스타일
```

## 주요 특징

- **React Hooks**: useState, useEffect, useContext 사용
- **Context API**: 전역 상태 관리
- **컴포넌트 분리**: 재사용 가능한 컴포넌트 구조
- **로컬 스토리지**: 데이터 영속성
- **반응형 디자인**: 모바일 친화적 UI

## 사용법

1. 질서/혼돈 페이지를 선택합니다
2. 코어 설정을 구성합니다 (종류, 등급)
3. 젬을 추가하고 편집합니다
4. 최적화 실행 버튼을 클릭합니다
5. 결과를 확인하고 데이터를 저장합니다

## 기술 스택

- React 18
- JavaScript (ES6+)
- CSS3
- Local Storage API
- File API
