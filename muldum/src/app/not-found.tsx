"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

export default function NotFound() {
    return (
        <Container>
            <Wrapper>
                <Title>404</Title>
                <Subtitle>존재하지 않는 페이지입니다</Subtitle>
            </Wrapper>
            <HomeLink href="/">홈으로 돌아가기</HomeLink>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  row-gap: 3rem;
  text-align: center;
`;

const jejuFont = css`
  @font-face {
    font-family: 'JejuStoneWall';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2210-EF@1.0/EF_jejudoldam.woff2') format('woff2');
    font-weight: normal;
    font-display: swap;
  }
`;

const Title = styled.div`
  ${jejuFont}
  font-family: 'JejuStoneWall', sans-serif;
  font-size: 7.5rem;
  font-weight: 500;
`;

const Subtitle = styled.div`
  font-size: 2.25rem;
  font-weight: 600;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 1rem;
`;

const HomeLink = styled(Link)`
  font-size: 1rem;
  color: #909090;

  &:hover {
    color: #545454;
  }
`;