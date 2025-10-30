'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useGoogleLogin from '@/shared/hooks/useGoogleLogin';

export default function GoogleLoginCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleGoogleCallback } = useGoogleLogin();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
                alert(`로그인 실패: ${error}`);
                router.push('/');
                return;
            }

            if (code) {
                try {
                    await handleGoogleCallback(code);
                    alert('로그인 성공!');
                    router.push('/');
                } catch (error) {
                    console.error('Login failed:', error);
                    router.push('/');
                }
            } else {
                alert('인증 코드가 없습니다.');
                router.push('/');
            }
        };

        handleCallback();
    }, [searchParams, handleGoogleCallback, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>로그인 처리 중...</p>
            </div>
        </div>
    );
}