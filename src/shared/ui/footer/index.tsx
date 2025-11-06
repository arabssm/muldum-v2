import styled from '@emotion/styled';
import Image from 'next/image';

export default function Footer() {
  return (
    <Container>
      <LeftSection>
        <LogoWrapper>
          <Image src="/assets/araLogo.svg" alt="Logo" width={35} height={34} />
          <Title>muldum</Title>
        </LogoWrapper>
        <Description>
          교사와 학생 모두에게 불편한 점을 분석하고 <br /> 개선하였습니다
        </Description>
      </LeftSection>
      <RightSection>
        <Icon onClick={() => (window.location.href = 'mailto:bssmara2025@gmail.com')}>
          <Image src="/assets/footer/email.svg" alt="Email" width={32} height={32} />
        </Icon>
        <Icon onClick={() => window.open('https://www.instagram.com/arabssm/', '_blank')}>
          <Image src="/assets/footer/instar.svg" alt="Instagram" width={32} height={32} />
        </Icon>
      </RightSection>
    </Container>
  );
}

const Container = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20vh;
  padding: 1.5rem 3rem;
  background-color: #fafafa;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6rem;
  gap: 0.5rem;
`;

const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f1f1f;
`;

const Description = styled.span`
  color: #8c8c8c;
  font-size: 0.95rem;
  margin-left: 6rem;
`;

const RightSection = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 4rem;
  margin-right: 5rem;
`;

const Icon = styled.div`
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;