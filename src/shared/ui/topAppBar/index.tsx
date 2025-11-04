'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import * as _ from './style';
import { useModal } from '@/components/modal/useModal';
import LoginModal from '@/shared/ui/modal/loginModal';
import { handlenoaccess } from '../toast/index'

const Menu: { label: string; path: string }[] = [
  { label: '홈화면', path: '/' },
  { label: '역대 동아리', path: '/clubs' },
  { label: '물품 관리', path: '/items' },
  { label: '팀스페이스', path: '/team' },
  { label: '공지사항', path: '/notice' },
];

export default function TopAppBar() {
  const pathname = usePathname();

  const { Modal, openModal } = useModal();


  return (
    <_.Container>
      <_.Wrapper>
        {Menu.map((item) => (
          <Link key={item.path} href={item.path}>
            {item.label === '홈화면' ? (
              <Image
                src="/assets/araLogo.svg"
                alt="Logo"
                width={40}
                height={40}
                priority
              />
            ) : (
              <_.Text as="span" isActive={pathname === item.path}>
                {item.label}
              </_.Text>
            )}
          </Link>
        ))}
      </_.Wrapper>

      <_.BtnGroup>
        <_.LoginBtn onClick={openModal}>로그인</_.LoginBtn>
        <_.MyInfo onClick={handlenoaccess}>내 정보</_.MyInfo>
      </_.BtnGroup>

      <Modal>
        <LoginModal />
      </Modal>
    </_.Container>
  );
}