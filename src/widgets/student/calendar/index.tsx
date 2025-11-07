'use client';

import React, { useMemo, useRef, useState } from 'react';
import * as _ from './style';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';

export default function Calendar() {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dates = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragEnd, setDragEnd] = useState<number | null>(null);
    const [highlightSet, setHighlightSet] = useState<Set<number>>(new Set());
    const [modalRange, setModalRange] = useState<{ from: number; to: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onCellMouseDown = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart(index);
        setDragEnd(index);
        setHighlightSet(new Set([index]));
    };

    const onCellMouseEnter = (index: number) => () => {
        if (!isDragging || dragStart === null) return;
        setDragEnd(index);
        const a = Math.min(dragStart, index);
        const b = Math.max(dragStart, index);
        const s = new Set<number>();
        for (let i = a; i <= b; i++) s.add(i);
        setHighlightSet(s);
    };

    const onMouseUp = () => {
        if (!isDragging || dragStart === null || dragEnd === null) {
            setIsDragging(false);
            setDragStart(null);
            setDragEnd(null);
            setHighlightSet(new Set());
            return;
        }
        const a = Math.min(dragStart, dragEnd);
        const b = Math.max(dragStart, dragEnd);
        setModalRange({ from: dates[a], to: dates[b] });
        setIsOpen(true);

        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setHighlightSet(new Set());
    };

    return (
        <_.Container
            ref={containerRef}
            onMouseUp={onMouseUp}
            onMouseLeave={() => {
                if (isDragging) {
                    setIsDragging(false);
                    setDragStart(null);
                    setDragEnd(null);
                    setHighlightSet(new Set());
                }
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
                            onMouseEnter={onCellMouseEnter(idx)}
                            role="button"
                            aria-pressed={highlightSet.has(idx)}
                        >
                            <span>{date}</span>
                        </_.CellHighlighted>
                    ))}
                </_.Body>
            </_.CalendarWrapper>
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <_.ModalInner>
                    <Image
                        src="/assets/calendar.svg"
                        alt="캘린더 아이콘"
                        width={48}
                        height={48}
                    />
                    <_.ModalTitle>일정을 등록을 위한 <br /> 타이틀을 적어주세요</_.ModalTitle>
                    <_.ModalInput placeholder="타이틀을 입력하세요" />
                    <_.Row>
                        <_.SmallText>
                            기간: {modalRange ? `${modalRange.from}일 ~ ${modalRange.to}일` : '-'}
                        </_.SmallText>
                        <_.SaveBtn
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            등록하기
                        </_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}