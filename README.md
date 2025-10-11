# 로스트아크 아크그리드 최적화 시뮬레이터

## 🚀 배포 URL
**https://kolyn092.github.io/ark-grid-optimizer**

## 🔧 GitHub Pages 설정

### 404 오류 해결 방법

1. **GitHub 저장소 → Settings → Pages**
2. **Source**: "Deploy from a branch" 선택
3. **Branch**: "main" 선택  
4. **Folder**: "/ (root)" 선택
5. **Save** 클릭

### 배포 상태 확인

- GitHub 저장소의 "Actions" 탭에서 배포 상태 확인
- 배포가 성공하면 초록색 체크마크 표시
- 배포 실패 시 빨간색 X 표시와 오류 로그 확인

### 문제 해결

1. **브라우저 캐시 지우기**: Ctrl+F5 또는 하드 새로고침
2. **배포 시간 대기**: GitHub Pages는 배포 후 1-2분 소요
3. **빈 커밋 푸시**: `git commit --allow-empty -m "Trigger rebuild" && git push`

### 추가 해결 방법

1. **시크릿 모드에서 접근**: 브라우저 캐시 문제 해결
2. **다른 브라우저로 테스트**: Chrome, Firefox, Edge 등
3. **GitHub Pages 상태 확인**: https://www.githubstatus.com/
4. **Actions 탭 확인**: GitHub 저장소 → Actions에서 배포 상태 확인

### 최종 확인사항

- ✅ GitHub 저장소 → Settings → Pages → Source: "Deploy from a branch"
- ✅ Branch: "main" 선택
- ✅ Folder: "/ (root)" 선택
- ✅ .nojekyll 파일 포함됨
