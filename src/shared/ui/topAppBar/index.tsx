'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import * as _ from './style';
import { useModal } from '@/components/modal/useModal';
import LoginModal from '@/shared/ui/modal/loginModal';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState, useEffect } from 'react';
import { getUserInfo } from '@/shared/api/user';


export default function TopAppBar() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const { Modal, openModal } = useModal();
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserType = async () => {
      if (isLoggedIn) {
        try {
          const userInfo = await getUserInfo();
          const type = userInfo.user_type.toLowerCase() as 'student' | 'teacher';
          setUserType(type);
          setUserId(userInfo.name || userInfo.email || '사용자');
          console.log('User type:', type);
        } catch (error) {
          console.error('Failed to fetch user type:', error);
        }
      }
    };
    fetchUserType();
  }, [isLoggedIn]);

  const Menu: { label: string; path: string }[] = [
    { label: '홈화면', path: '/' },
    { label: '역대 동아리', path: '/clubs' },
    { label: '물품 관리', path: userType === 'teacher' ? '/apply' : '/items' },
    { label: '팀스페이스', path: '/team' },
    { label: '공지사항', path: '/notice' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <_.Container>
      <_.Wrapper>
        {Menu.map((item) => (
          <Link key={item.label} href={item.path}>
            {item.label === '홈화면' ? (
              <Image
                src="/assets/araLogo.svg"
                alt="Logo"
                width={40}
                height={40}
                priority
              />
            ) : (
              <_.Text as="span" isActive={isActive(item.path)}>
                {item.label}
              </_.Text>
            )}
          </Link>
        ))}
      </_.Wrapper>

      <_.BtnGroup>
        {isLoggedIn && userId && (
          <_.UserId>{userId}</_.UserId>
        )}
        {isLoggedIn ? (
          <_.LoginBtn onClick={logout}>로그아웃</_.LoginBtn>
        ) : (
          <_.LoginBtn onClick={openModal}>로그인</_.LoginBtn>
        )}
      </_.BtnGroup>

      <Modal>
        <LoginModal />
      </Modal>
    </_.Container>
  );
}