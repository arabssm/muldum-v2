'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import * as _ from './style';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';
import { useCalendarDrag } from '@/shared/hooks/useCalendar';

export default function Calendar() {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dates = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

    const {
        isDragging,
        highlightSet,
        modalRange,
        onCellMouseDown,
        onCellMouseEnter,
        onMouseUp,
        reset,
    } = useCalendarDrag(dates);

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const openModal = () => {
        if (modalRange) setIsOpen(true);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            onMouseUp();
            openModal();
        };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [onMouseUp, openModal]);

    return (
        <_.Container
            ref={containerRef}
            onMouseLeave={() => {
                if (isDragging) reset();
            }}
        >
            <_.CalendarWrapper>
                <_.HeaderRow>
                    {days.map((day) => (
                        <_.HeaderCell key={day}>{day}</_.HeaderCell>
                    ))}
                </_.HeaderRow>

                <_.Body>
                    {dates.map((date, idx) => (
                        <_.CellHighlighted
                            key={date}
                            isHighlighted={highlightSet.has(idx)}
                            onMouseDown={onCellMouseDown(idx)}
                            onMouseOver={onCellMouseEnter(idx)}
                            aria-pressed={highlightSet.has(idx)}
                        >
                            <span>{date}</span>
                        </_.CellHighlighted>
                    ))}
                </_.Body>
            </_.CalendarWrapper>

            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <_.ModalInner>
                    <Image src="/assets/calendar.svg" alt="캘린더 아이콘" width={48} height={48} />
                    <_.ModalTitle>
                        일정을 등록을 위한 <br /> 타이틀을 적어주세요
                    </_.ModalTitle>
                    <_.ModalInput placeholder="타이틀을 입력하세요" />
                    <_.Row>
                        <_.SmallText>
                            기간: {modalRange ? `${modalRange.from}일 ~ ${modalRange.to}일` : '-'}
                        </_.SmallText>
                        <_.SaveBtn onClick={() => setIsOpen(false)}>등록하기</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}