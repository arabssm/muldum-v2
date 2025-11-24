'use client';

import { useCallback } from 'react';
import axiosInstance from '@/shared/lib/axiosInstance';
import { setCookie } from '@/shared/lib/cookieUtils';
import { GoogleLoginResponse, ErrorResponse } from '@/shared/types/auth'
import { showToast } from '@/shared/ui/toast';

export default function useGoogleLogin() {
    const startGoogleLogin = useCallback((): void => {
        try {
            const { getGoogleClientId, getRedirectUri } = require('@/shared/lib/envCheck');
            const clientId = getGoogleClientId();
            const redirectUri = getRedirectUri();

            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email profile openid`;
            window.location.href = googleAuthUrl;
        } catch (error) {
            console.error('Google 로그인 시작 실패:', error);
            showToast.error('Google 로그인을 시작할 수 없습니다.');
        }
    }, []);

    const handleGoogleCallback = useCallback(
        async (authorizationCode: string): Promise<GoogleLoginResponse> => {
            try {
                if (!authorizationCode) {
                    throw new Error('인증 코드가 없습니다.');
                }

                const { data } = await axiosInstance.post<GoogleLoginResponse>(
                    '/ara/auth/login/google',
                    { authorizationCode }
                );

                if (!data) {
                    throw new Error('로그인 응답이 없습니다.');
                }

                if (data.accessToken && data.refreshToken) {
                    setCookie('access_token', data.accessToken);
                    setCookie('refresh_token', data.refreshToken);
                    showToast.success("로그인되었습니다!");
                    
                    // 다른 컴포넌트에 로그인 상태 변경 알림
                    window.dispatchEvent(new Event('auth-change'));
                } else {
                    throw new Error('토큰을 받지 못했습니다.');
                }

                return data;
            } catch (error: any) {
                console.error('Google 로그인 콜백 에러:', error);
                
                const err: ErrorResponse | undefined = error.response?.data;

                if (err?.error === 'UNREGISTERED_USER') {
                    showToast.error('등록되지 않은 사용자입니다.');
                } else if (err?.message?.includes('인증 코드')) {
                    showToast.error('잘못된 인증 코드입니다.');
                } else if (!error.response) {
                    showToast.error('서버에 연결할 수 없습니다.');
                } else {
                    showToast.error('로그인 중 오류가 발생했습니다.');
                }

                throw error;
            }
        },
        []
    );

    return { startGoogleLogin, handleGoogleCallback };
}