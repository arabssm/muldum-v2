"use client";

import { useEffect, useState, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { RoleProps } from '@/shared/types/auth';

export default function AuthConfirm({ roles, children, fallback = null }: PropsWithChildren<RoleProps>) {
    const router = useRouter();
    const [allowed, setAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) {
                setAllowed(false);
                router.push('/');
                return;
            }
            const parsed = JSON.parse(raw);
            const role = parsed?.role;

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
            setAllowed(false);
            router.push('/');
        }
    }, [roles, router]);

    if (allowed === null) return fallback;
    if (!allowed) return null;
    return <>{children}</>;
}
