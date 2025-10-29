
# 프로젝트 개요

이 프로젝트는 Next.js와 TypeScript를 기반으로 한 웹 애플리케이션입니다.

## 스켈레톤 UI 시스템

전체 애플리케이션에 일관된 로딩 상태를 제공하는 스켈레톤 UI 시스템이 구현되어 있습니다.

### 기본 사용법

```tsx
import { Skeleton } from '@/shared/ui/skeleton';

// 기본 스켈레톤
<Skeleton width="200px" height="20px" />

// 텍스트 블록 스켈레톤
<SkeletonTextBlock lines={3} />

// 카드 스켈레톤
<SkeletonCard />
```

### 컴포넌트별 스켈레톤

각 위젯과 컴포넌트에는 전용 스켈레톤이 구현되어 있습니다:

- `MainSkeleton` - 메인 페이지
- `ClubsSkeleton` - 동아리 목록
- `NoticeSkeleton` - 공지사항
- `ItemsSkeleton` - 물품 관리
- `TeamSkeleton` - 팀스페이스
- `SliderSkeleton` - 슬라이더 컴포넌트

### 로딩 상태 관리

```tsx
import { useLoading } from '@/shared/hooks/useLoading';

function MyComponent() {
  const { isLoading } = useLoading({ minLoadingTime: 500 });
  
  if (isLoading) {
    return <MySkeleton />;
  }
  
  return <MyContent />;
}
```

## 커밋 컨벤션

| 타입       | 설명                            | 예시                               |
| -------- | ----------------------------- | -------------------------------- |
| feat     | 새로운 기능 추가                     | `feat: 로그인 리프레시 토큰 추가`     |
| fix      | 버그 수정                         | `fix: 사용자 조회 쿼리 수정`         |
| docs     | 문서 변경 (코드 변경X)                | `docs: README 사용법 보완`            |
| style    | 코드 포맷, 세미콜론 누락 등 (기능/로직 변경 X) | `style: ESLint 규칙 적용`            |
| refactor | 리팩토링 (기능 변경 없음)               | `refactor: 버튼 컴포넌트 분리`       |
| perf     | 성능 개선                         | `perf: 응답 캐싱 도입`          |
| test     | 테스트 추가/수정                     | `test: 로그인 유닛테스트 추가`             |
| build    | 빌드 관련 변경(의존성, 스크립트)           | `build: webpack 업그레이드`           |
| ci       | CI 설정 변경                      | `ci: GitHub Actions workflow 개선` |
| chore    | 그 외 잡무(패키지 업데이트 등)            | `chore: 패키지 락파일 정리`              |
| revert   | 이전 커밋 되돌림                     | `revert: feat(auth): ...`        |
