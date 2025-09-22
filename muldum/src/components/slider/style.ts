import styled from '@emotion/styled';
import Slider from 'react-slick';

export const Container = styled.div`
    display: flex;
    position: relative;
    z-index: -5;
    overflow: hidden;
`;

export const StyledSlider = styled(Slider)`
    display: flex;
    width: 100%;
`;

export const CalendarContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: 1rem;
`;

export const SlideWrapper = styled.div`
    display: flex;
    position: relative;
    border-radius: 0.2rem;
    height: 24vh;
    overflow: hidden;
    margin: 1% auto;
    color: #fff;
`;

export const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
`;

export const Legendimg = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const Title = styled.div`
    position: absolute;
    font-size: 2.5rem;
    font-weight: 500;
    top: 20%;
    left: 4%;
    width: 100%;
    color: #fff
`;

export const SubTitle = styled.div`
    font-size: 1.5rem;
    position: absolute;
    font-weight: 400;
    left: 4%;
    top: 67%;
    color: #D1D1D1;
`;

export const Date = styled.div`
    display: flex;
    font-size: 1.5rem;
    font-weight: 400;
    position: absolute;
    left: 4%;
    top: 52%;
    color: #D1D1D1;
`;

export const Ddate = styled.div`
    position: absolute;
    font-size: 5rem; 
    font-weight: 600;
    top: 27%;
    left: 80%;
    color: #fff;
`;

export const Index = styled.div`
    position: absolute;
    left: 97%;
    top: 85%;
    color: #D1D1D1;
`;