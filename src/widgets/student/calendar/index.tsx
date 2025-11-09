'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import * as _ from './style';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';
import { useCalendarDrag } from '@/shared/hooks/useCalendar';
import type { Event } from '@/shared/types';

export default function Calendar() {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dates = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
    const { isDragging, highlightSet, modalRange, onCellMouseDown, onCellMouseEnter, onMouseUp, reset } = useCalendarDrag(dates);

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [cellHeight, setCellHeight] = useState(100);
    const colors = ['#FFE8E6', '#FFF5DC', '#E6F6FF'];

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
    }, [onMouseUp]);

    useEffect(() => {
        const firstCell = containerRef.current?.querySelector('div') as HTMLElement;
        if (firstCell) setCellHeight(firstCell.clientHeight);
    }, []);

    const handleSave = () => {
        if (!title.trim()) return alert('타이틀을 입력해주세요!');
        const newEvent: Event = {
            title,
            from: modalRange!.from,
            to: modalRange!.to,
            color: colors[events.length % colors.length],
        };
        setEvents([...events, newEvent]);
        setIsOpen(false);
        setTitle('');
        reset();
    };

    return (
        <_.Container ref={containerRef} onMouseLeave={() => { if (isDragging) reset(); }}>
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
                    {events.map((ev, idx) => {
                        const cellWidth = 100 / 7;
                        const startWeek = Math.floor((ev.from - 1) / 7);
                        const endWeek = Math.floor((ev.to - 1) / 7);
                        const startCol = (ev.from - 1) % 7;
                        const endCol = (ev.to - 1) % 7;

                        const weekColors = ["#FFD8D8", "#FFF1B2", "#D9F7BE", "#D6E4FF", "#EBD8FF"];
                        const bars = [];

                        for (let week = startWeek; week <= endWeek; week++) {
                            const fromCol = week === startWeek ? startCol : 0;
                            const toCol = week === endWeek ? endCol : 6;
                            const width = `${(toCol - fromCol + 1) * cellWidth}%`;
                            const left = `${fromCol * cellWidth}%`;

                            let topOffset = 0;
                            if (week === 0) topOffset = 0;
                            else if (week === 1) topOffset = (100 / 7) * 0.8;
                            else if (week === 2) topOffset = (100 / 7) * 1.9;
                            else if (week === 3) topOffset = (100 / 7) * 2.7;
                            else if (week === 4) topOffset = (100 / 7) * 3.8;

                            const top = `calc(${topOffset}% + ${idx * 30}px)`;

                            const weekColor = weekColors[week % weekColors.length];

                            bars.push(
                                <_.EventBarAbsolute
                                    key={`${idx}-${week}`}
                                    color={weekColor}
                                    left={left}
                                    top={top}
                                    width={width}
                                >
                                    {week === startWeek && ev.title}
                                </_.EventBarAbsolute>
                            );
                        }
                        return bars;
                    })}

                </_.Body>
            </_.CalendarWrapper>

            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <_.ModalInner>
                    <Image src="/assets/calendar.svg" alt="캘린더 아이콘" width={48} height={48} />
                    <_.ModalTitle>일정을 등록을 위한 <br /> 타이틀을 적어주세요</_.ModalTitle>
                    <_.ModalInput placeholder="타이틀을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <_.Row>
                        <_.SmallText>기간: {modalRange ? `${modalRange.from}일 ~ ${modalRange.to}일` : '-'}</_.SmallText>
                        <_.SaveBtn onClick={handleSave}>등록하기</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}
