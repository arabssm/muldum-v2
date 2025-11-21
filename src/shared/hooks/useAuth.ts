'use client';

import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from '@/shared/lib/cookieUtils';
import axiosInstance from '@/shared/lib/axiosInstance';
import { showToast } from '@/shared/ui/toast';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkAuthStatus = () => {
    const accessToken = getCookie('access_token');
    const userStr = localStorage.getItem('user');
    
    if (accessToken && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 로그인 감지)
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/ara/auth/logout');
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 쿠키와 로컬스토리지 정리
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      showToast.success("로그아웃되었습니다!");
      
      // 다른 컴포넌트에 로그아웃 알림
      window.dispatchEvent(new Event('auth-change'));
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  return { isLoggedIn, user, logout };
}
