import styled from '@emotion/styled';
import Slider from 'react-slick';

export const Container = styled.div`
    display: flex;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
`;

export const StyledSlider = styled(Slider)`
    display: flex;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    
    .slick-list {
        border-radius: 4px;
        overflow: hidden;
    }
    
    .slick-track {
        display: flex;
    }

    .slick-slide {
        transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
        transform: scale(0.95);
        opacity: 0.5;
    }

    .slick-active {
        transform: scale(1);
        opacity: 1;
    }
`;

export const CalendarContainer = styled.div`
  display: flex;
  width: 100%;
  margin-left: auto;
`;

export const SlideWrapper = styled.div`
    display: flex;
    position: relative;
    border-radius: 4px;
    height: 24vh;
    min-height: 200px;
    overflow: hidden;
    color: #fff;
    cursor: pointer;
    
    @media (max-width: 1024px) {
        height: 20vh;
        min-height: 180px;
    }
`;

export const Overlay = styled.div`
    display: flex;
    position: absolute;
    inset: 0;
    background: rgba(70, 70, 70, 0.4);
    border-radius: 4px;
`;

export const Legendimg = styled.img`
    display: flex;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const Title = styled.div`
    display: flex;
    position: absolute;
    font-size: 2.5rem;
    font-weight: 500;
    top: 20%;
    left: 5%;
    width: 70%;
    color: #fff;
    
    @media (max-width: 1024px) {
        font-size: 1.8rem;
        width: 60%;
    }
    
    @media (max-width: 768px) {
        font-size: 1.5rem;
        width: 55%;
    }
`;

export const SubTitle = styled.div`
    display: flex;
    font-size: 1.5rem;
    position: absolute;
    font-weight: 400;
    left: 5%;
    top: 67%;
    color: #e9e9e9ff;
    
    @media (max-width: 1024px) {
        font-size: 1.2rem;
        top: 70%;
    }
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const Date = styled.div`
    display: flex;
    font-size: 1.5rem;
    font-weight: 400;
    position: absolute;
    left: 5%;
    top: 52%;
    color: #e9e9e9ff;
    
    @media (max-width: 1024px) {
        font-size: 1.2rem;
        top: 55%;
    }
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const Ddate = styled.div`
    display: flex;
    position: absolute;
    font-size: 5rem; 
    font-weight: 600;
    top: 30%;
    left: 82%;
    color: #fff;
`;

export const Index = styled.div`
    display: flex;
    position: absolute;
    left: 97%;
    top: 85%;
    color: #D1D1D1;
`;

export const ArrowButton = styled.button`
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: transparent;
    border: none;
    color: #D1D1D1;
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
        opacity: 0.7;
    }

    &.prev-arrow {
        left: 1rem;
    }

    &.next-arrow {
        right: 1rem;
    }
`;

export const DDay = styled.div`
    display: flex;
    position: absolute;
    font-size: 5rem;
    left: 82%;
    top: 31%;
    color: #fff;
    font-weight: 600;
    
    @media (max-width: 1024px) {
        font-size: 3.5rem;
        left: 75%;
        top: 35%;
    }
    
    @media (max-width: 768px) {
        font-size: 2.5rem;
        left: 70%;
        top: 30%;
    }
`;