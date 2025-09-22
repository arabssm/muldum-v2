"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as S from "./style";

const Menu: { label: string; path: string }[] = [
  { label: "홈화면", path: "/" },
  { label: "역대 동아리", path: "/clubs" },
  { label: "공유캘린더", path: "/calendar" },
  { label: "물품 관리", path: "/items" },
  { label: "월말평가", path: "/evaluation" },
  { label: "공지사항", path: "/notice" },
];

export default function TopAppBar() {
  const pathname = usePathname();

  return (
    <S.Container>
      <S.Wrapper>
        {Menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <S.Text as="span" isActive={pathname === item.path}>
              {item.label}
            </S.Text>
          </Link>
        ))}
      </S.Wrapper>
      <S.BtnGroup>
        <S.LoginBtn>로그인</S.LoginBtn>
        <S.MyInfo>내 정보</S.MyInfo>
      </S.BtnGroup>
    </S.Container>
  );
}