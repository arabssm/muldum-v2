# 에러 처리 가이드

## 개요

이 문서는 Muldum 애플리케이션의 에러 처리 전략과 구현 방법을 설명합니다.

## 에러 처리 계층

### 1. Global Error Boundary

**위치**: `src/app/global-error.tsx`, `src/app/error.tsx`

전역 레벨에서 발생하는 모든 에러를 캐치합니다.

```tsx
// 사용 예시는 자동으로 Next.js가 처리
```

### 2. Component Error Boundary

**위치**: `src/shared/ui/errorBoundary/index.tsx`

개별 컴포넌트 레벨에서 에러를 캐치하고 폴백 UI를 표시합니다.

```tsx
import ErrorBoundary from '@/shared/ui/errorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 3. API 에러 처리

**위치**: `src/shared/lib/axiosInstance.ts`

모든 API 요청에 대한 에러를 인터셉터에서 처리합니다.

#### 주요 기능:
- 401 에러 시 자동 토큰 갱신
- 네트워크 에러 감지
- HTML 응답 감지 및 차단
- 500번대 서버 에러 로깅

### 4. Custom Error Handler Hook

**위치**: `src/shared/hooks/useErrorHandler.ts`

컴포넌트에서 에러를 일관되게 처리하기 위한 커스텀 훅입니다.

```tsx
import useErrorHandler from '@/shared/hooks/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const data = await api.getData();
    } catch (error) {
      handleError(error, {
        customMessage: '데이터를 불러올 수 없습니다',
        showToastMessage: true,
      });
    }
  };
}
```

## 환경 변수 체크

**위치**: `src/shared/lib/envCheck.ts`

필수 환경 변수가 없을 때 폴백 값을 제공합니다.

```typescript
import { getApiBaseUrl, checkRequiredEnvVars } from '@/shared/lib/envCheck';

// 환경 변수 체크
const { isValid, missing } = checkRequiredEnvVars();

// API URL 가져오기 (폴백 포함)
const apiUrl = getApiBaseUrl();
```

## 에러 타입별 처리

### 네트워크 에러
- 사용자에게 "네트워크 연결을 확인해주세요" 메시지 표시
- 자동 재시도 로직 (선택적)

### 인증 에러 (401)
- 자동 토큰 갱신 시도
- 실패 시 로그인 페이지로 리다이렉트

### 권한 에러 (403)
- "권한이 없습니다" 메시지 표시

### 서버 에러 (500+)
- "서버 오류가 발생했습니다" 메시지 표시
- 에러 로그 수집 (Sentry)

### 클라이언트 에러 (400)
- 서버에서 제공한 에러 메시지 표시

## 베스트 프랙티스

### 1. 항상 try-catch 사용

```typescript
const fetchData = async () => {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    handleError(error);
    return null; // 또는 기본값
  }
};
```

### 2. 에러 메시지 사용자 친화적으로

```typescript
// ❌ 나쁜 예
throw new Error('ERR_NETWORK_001');

// ✅ 좋은 예
throw new Error('네트워크 연결을 확인해주세요');
```

### 3. 로딩 상태와 에러 상태 분리

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    setError('데이터를 불러올 수 없습니다');
  } finally {
    setIsLoading(false);
  }
};
```

### 4. null/undefined 체크

```typescript
// ❌ 나쁜 예
const userName = user.name;

// ✅ 좋은 예
const userName = user?.name || '사용자';
```

### 5. API 응답 검증

```typescript
const data = await api.getData();

if (!data) {
  throw new Error('데이터를 받지 못했습니다');
}

if (!Array.isArray(data.items)) {
  console.error('Invalid data format:', data);
  return [];
}
```

## 에러 로깅

### 개발 환경
- 콘솔에 상세한 에러 정보 출력
- 스택 트레이스 표시

### 프로덕션 환경
- Sentry로 에러 전송
- 민감한 정보 제거
- 사용자에게는 간단한 메시지만 표시

## 테스트

에러 처리를 테스트할 때:

1. 네트워크 연결 끊기
2. 잘못된 API 엔드포인트 호출
3. 만료된 토큰으로 요청
4. 서버 에러 시뮬레이션 (500)
5. 잘못된 데이터 형식 전송

## 문제 해결

### "Application error: a client-side exception has occurred"

이 에러가 발생하면:

1. 브라우저 콘솔에서 실제 에러 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. API 엔드포인트가 올바른지 확인
4. 네트워크 탭에서 실패한 요청 확인

### HTML 응답 에러

API가 JSON 대신 HTML을 반환하는 경우:

1. API URL이 올바른지 확인
2. CORS 설정 확인
3. 서버가 올바르게 실행 중인지 확인

## 추가 리소스

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Axios Error Handling](https://axios-http.com/docs/handling_errors)
