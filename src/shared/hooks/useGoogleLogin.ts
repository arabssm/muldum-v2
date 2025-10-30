'use client';

import { useCallback } from 'react';
import axiosInstance from '@/shared/lib/axiosInstance';
import { setCookie } from '@/shared/lib/cookieUtils';
import { GoogleLoginResponse, ErrorResponse } from '@/shared/types/auth'

export default function useGoogleLogin() {
    const startGoogleLogin = useCallback((): void => {
        const redirectUri = process.env.NEXT_REDIRECT_URI || window.location.origin;
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.error('Google Client ID가 설정되지 않았습니다.');
            return;
        }

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email profile openid`;
        window.location.href = googleAuthUrl;
    }, []);

    const handleGoogleCallback = useCallback(
        async (authorizationCode: string): Promise<GoogleLoginResponse> => {
            try {
                const { data } = await axiosInstance.post<GoogleLoginResponse>(
                    '/ara/auth/login/google',
                    { authorizationCode }
                );

                if (data.accessToken && data.refreshToken) {
                    setCookie('access_token', data.accessToken);
                    setCookie('refresh_token', data.refreshToken);
                    localStorage.setItem(
                        'user',
                        JSON.stringify({
                            userId: data.userId,
                            name: data.name,
                            userType: data.userType,
                            role: data.role,
                            teamId: data.teamId ?? null,
                        })
                    );
                }

                return data;
            } catch (error: any) {
                const err: ErrorResponse | undefined = error.response?.data;

                if (err?.error === 'UNREGISTERED_USER') {
                    alert('등록되지 않은 사용자입니다.');
                } else if (err?.message?.includes('인증 코드')) {
                    alert('잘못된 인증 코드입니다.');
                } else {
                    alert('로그인 중 오류가 발생했습니다.');
                }

                throw error;
            }
        },
        []
    );

    return { startGoogleLogin, handleGoogleCallback };
}