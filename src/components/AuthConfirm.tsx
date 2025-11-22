"use client";

import { useEffect, useState, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { RoleProps } from '@/shared/types/auth';
import { getUserInfo } from '@/shared/api/user';
import { getCookie } from '@/shared/lib/cookieUtils';

export default function AuthConfirm({ roles, children, fallback = null }: PropsWithChildren<RoleProps>) {
    const router = useRouter();
    const [allowed, setAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = getCookie('access_token');
                if (!accessToken) {
                    setAllowed(false);
                    router.push('/');
                    return;
                }

                const userInfo = await getUserInfo();
                const role = userInfo?.user_type;

                const allowedRoles = roles.map((r) => {
                    if (r === 'STUDENT') return 'student';
                    return 'teacher';
                });

                if (allowedRoles.includes(role)) setAllowed(true);
                else {
                    setAllowed(false);
                    router.push('/');
                }
            } catch (e) {
                console.error('인증 확인 실패:', e);
                setAllowed(false);
                router.push('/');
            }
        };

        checkAuth();
    }, [roles, router]);

    if (allowed === null) return fallback;
    if (!allowed) return null;
    return <>{children}</>;
}
