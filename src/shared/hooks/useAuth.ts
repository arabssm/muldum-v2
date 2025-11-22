'use client';

import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from '@/shared/lib/cookieUtils';
import axiosInstance from '@/shared/lib/axiosInstance';
import { showToast } from '@/shared/ui/toast';
import { getUserInfo } from '@/shared/api/user';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkAuthStatus = async () => {
    const accessToken = getCookie('access_token');
    
    if (accessToken) {
      try {
        const userInfo = await getUserInfo();
        setIsLoggedIn(true);
        setUser(userInfo);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 로그인 감지)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/ara/auth/logout');
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 쿠키 정리
      deleteCookie('access_token');
      deleteCookie('refresh_token');
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
