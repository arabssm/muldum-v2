'use client';

import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import * as _ from './style';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';

export default function Calendar() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [events, setEvents] = useState<EventInput[]>([]);
    const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const colors = ['#FFD8D8', '#FFF1B2', '#D9F7BE', '#D6E4FF', '#EBD8FF'];

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectedRange({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        });
        setIsOpen(true);
    };

    const handleSave = () => {
        if (!title.trim()) return alert('타이틀을 입력해주세요!');
        if (!selectedRange) return;

        const newEvent: EventInput = {
            title,
            start: selectedRange.start,
            end: selectedRange.end,
            backgroundColor: colors[events.length % colors.length],
            borderColor: colors[events.length % colors.length],
        };

        setEvents([...events, newEvent]);
        setIsOpen(false);
        setTitle('');
        setSelectedRange(null);

        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.unselect();
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
            clickInfo.event.remove();
            setEvents(events.filter(e => e.title !== clickInfo.event.title));
        }
    };

    const formatDateRange = () => {
        if (!selectedRange) return '-';
        const start = new Date(selectedRange.start);
        const end = new Date(selectedRange.end);
        end.setDate(end.getDate() - 1);
        return `${start.getDate()}일 ~ ${end.getDate()}일`;
    };

    return (
        <_.Container>
            <_.CalendarWrapper>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={events}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: ''
                    }}
                    locale="ko"
                    dayHeaderFormat={{ weekday: 'long' }}
                    height="70vh"
                    eventDisplay="block"
                />
            </_.CalendarWrapper>

            <Modal isOpen={isOpen} closeModal={() => { setIsOpen(false); setSelectedRange(null); }}>
                <_.ModalInner>
                    <Image src="/assets/calendar.svg" alt="캘린더 아이콘" width={48} height={48} />
                    <_.ModalTitle>일정을 등록을 위한 <br /> 타이틀을 적어주세요</_.ModalTitle>
                    <_.ModalInput 
                        placeholder="타이틀을 입력하세요" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <_.Row>
                        <_.SmallText>기간: {formatDateRange()}</_.SmallText>
                        <_.SaveBtn onClick={handleSave}>등록하기</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}
