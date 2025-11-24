/**
 * 환경 변수 체크 및 폴백 유틸리티
 */

export const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!url) {
    console.warn('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다. 기본값을 사용합니다.');
    
    // 프로덕션 환경 감지
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('muldum.com')) {
        return 'https://backend.muldum.com';
      }
    }
    
    return 'http://localhost:8080';
  }
  
  return url;
};

export const getAiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_AI_BASE_URL;
  
  if (!url) {
    console.warn('NEXT_PUBLIC_AI_BASE_URL이 설정되지 않았습니다. 기본값을 사용합니다.');
    return 'http://localhost:8000';
  }
  
  return url;
};

export const getGoogleClientId = (): string => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
    throw new Error('Google Client ID가 설정되지 않았습니다.');
  }
  
  return clientId;
};

export const getRedirectUri = (): string => {
  const uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  
  if (!uri) {
    console.warn('NEXT_PUBLIC_REDIRECT_URI가 설정되지 않았습니다. 기본값을 사용합니다.');
    
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/google/login`;
    }
    
    return 'http://localhost:3000/google/login';
  }
  
  return uri;
};

export const getSentryDsn = (): string | undefined => {
  return process.env.NEXT_PUBLIC_SENTRY_DSN;
};

/**
 * 모든 필수 환경 변수가 설정되어 있는지 확인
 */
export const checkRequiredEnvVars = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  ];
  
  const missing: string[] = [];
  
  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    console.warn('누락된 환경 변수:', missing);
  }
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};
