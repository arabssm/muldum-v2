'use client';

import { useCallback } from 'react';
import { showToast } from '@/shared/ui/toast';

export interface ErrorHandlerOptions {
  showToastMessage?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

export function useErrorHandler() {
  const handleError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToastMessage = true,
      logToConsole = true,
      customMessage,
    } = options;

    // 콘솔 로깅
    if (logToConsole) {
      console.error('Error caught by handler:', error);
    }

    // 에러 메시지 결정
    let message = customMessage || '오류가 발생했습니다';

    if (error?.response) {
      // API 에러
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        message = data?.message || '잘못된 요청입니다';
      } else if (status === 401) {
        message = '인증이 필요합니다';
      } else if (status === 403) {
        message = '권한이 없습니다';
      } else if (status === 404) {
        message = '요청한 리소스를 찾을 수 없습니다';
      } else if (status === 500) {
        message = '서버 오류가 발생했습니다';
      } else if (data?.message) {
        message = data.message;
      }
    } else if (error?.message) {
      // 일반 에러
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        message = '네트워크 연결을 확인해주세요';
      } else if (error.message.includes('timeout')) {
        message = '요청 시간이 초과되었습니다';
      } else {
        message = error.message;
      }
    }

    // 토스트 표시
    if (showToastMessage) {
      showToast.error(message);
    }

    return message;
  }, []);

  return { handleError };
}

export default useErrorHandler;
