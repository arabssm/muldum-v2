'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const message = urlParams.get('message');
            const role = urlParams.get('role');
            const userId = urlParams.get('userId');
            const name = urlParams.get('name');
            const accessToken = urlParams.get('accessToken');
            const teamId = urlParams.get('teamId');
            const error = urlParams.get('error');

            if (error) {
                alert(`로그인 실패: ${urlParams.get('message') || error}`);
                router.push('/');
                return;
            }

            if (accessToken && userId && name && role) {
                // Store tokens and user info
                document.cookie = `access_token=${accessToken};path=/;secure;samesite=strict`;
                
                localStorage.setItem('user', JSON.stringify({
                    userId: parseInt(userId),
                    name,
                    userType: role,
                    role,
                    teamId: teamId ? parseInt(teamId) : null,
                }));

                alert(message || '로그인 성공!');
                router.push('/');
            } else {
                alert('로그인 정보가 올바르지 않습니다.');
                router.push('/');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>로그인 처리 중...</p>
            </div>
        </div>
    );
}