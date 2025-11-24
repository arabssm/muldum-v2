'use client';

import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import * as _ from './style';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';
import { useCalendar } from '@/shared/hooks/useCalendar';
import { CalendarEntry } from '@/shared/api/calendar';

export default function Calendar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [events, setEvents] = useState<EventInput[]>([]);
    const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
    const [editingEvent, setEditingEvent] = useState<CalendarEntry | null>(null);
    const [viewingEvent, setViewingEvent] = useState<CalendarEntry | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const { calendars, isLoading, addCalendar, editCalendar, removeCalendar } = useCalendar();

    const colors = ['#FFD8D8', '#FFF1B2', '#D9F7BE', '#D6E4FF', '#EBD8FF'];

    useEffect(() => {
        const convertedEvents: EventInput[] = calendars.map((cal, index) => {
            const startMonth = Math.floor(cal.Startdate / 100);
            const startDay = cal.Startdate % 100;
            const endMonth = Math.floor(cal.Enddate / 100);
            const endDay = cal.Enddate % 100;
            const startStr = `${cal.Startyear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
            const endDate = new Date(cal.Endyear, endMonth - 1, endDay + 1);
            const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            return {
                id: cal.calender_id.toString(),
                title: cal.title,
                start: startStr,
                end: endStr,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
                extendedProps: {
                    content: cal.content,
                    calendarEntry: cal,
                },
            };
        });
        setEvents(convertedEvents);
    }, [calendars]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectedRange({
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        });
        setEditingEvent(null);
        setTitle('');
        setContent('');
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!title.trim()) return alert('타이틀을 입력해주세요!');
        if (!selectedRange) return;

        const start = new Date(selectedRange.start);
        const end = new Date(selectedRange.end);
        end.setDate(end.getDate() - 1); // FullCalendar의 end는 exclusive이므로 1일 빼기

        const Startyear = start.getFullYear();
        const Startdate = (start.getMonth() + 1) * 100 + start.getDate();
        const Endyear = end.getFullYear();
        const Enddate = (end.getMonth() + 1) * 100 + end.getDate();

        try {
            if (editingEvent) {
                await editCalendar(editingEvent.calender_id, {
                    Startyear,
                    Startdate,
                    Endyear,
                    Enddate,
                    title,
                    content,
                });
            } else {
                await addCalendar({
                    Startyear,
                    Startdate,
                    Endyear,
                    Enddate,
                    title,
                    content,
                });
            }

            setIsOpen(false);
            setTitle('');
            setContent('');
            setSelectedRange(null);
            setEditingEvent(null);

            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
                calendarApi.unselect();
            }
        } catch (error) {
            console.error('Failed to save calendar:', error);
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const calendarEntry = clickInfo.event.extendedProps.calendarEntry as CalendarEntry;
        setViewingEvent(calendarEntry);
        setIsDetailOpen(true);
    };

    const handleEdit = () => {
        if (!viewingEvent) return;
        
        // MMDD 형식을 파싱
        const startMonth = Math.floor(viewingEvent.Startdate / 100);
        const startDay = viewingEvent.Startdate % 100;
        const endMonth = Math.floor(viewingEvent.Enddate / 100);
        const endDay = viewingEvent.Enddate % 100;
        
        // YYYY-MM-DD 형식으로 직접 생성 (타임존 문제 방지)
        const startStr = `${viewingEvent.Startyear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
        
        // 종료일은 FullCalendar가 exclusive이므로 +1일
        const endDate = new Date(viewingEvent.Endyear, endMonth - 1, endDay + 1);
        const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

        setEditingEvent(viewingEvent);
        setTitle(viewingEvent.title);
        setContent(viewingEvent.content);
        setSelectedRange({
            start: startStr,
            end: endStr,
        });
        setIsDetailOpen(false);
        setViewingEvent(null);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        if (!viewingEvent) return;
        
        try {
            await removeCalendar(viewingEvent.calender_id);
            setIsDetailOpen(false);
            setViewingEvent(null);
        } catch (error) {
            console.error('Failed to delete calendar:', error);
        }
    };

    const formatEventDateRange = () => {
        if (!viewingEvent) return '-';
        const startMonth = Math.floor(viewingEvent.Startdate / 100);
        const startDay = viewingEvent.Startdate % 100;
        const endMonth = Math.floor(viewingEvent.Enddate / 100);
        const endDay = viewingEvent.Enddate % 100;
        return `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
    };

    const formatDateRange = () => {
        if (!selectedRange) return '-';
        const start = new Date(selectedRange.start);
        const end = new Date(selectedRange.end);
        end.setDate(end.getDate() - 1);
        return `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
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
            <Modal isOpen={isOpen} closeModal={() => { 
                setIsOpen(false); 
                setSelectedRange(null); 
                setEditingEvent(null);
                setTitle('');
                setContent('');
            }}>
                <_.ModalInner>
                    <Image src="/assets/calendar.svg" alt="캘린더 아이콘" width={48} height={48} />
                    <_.ModalTitle>
                        {editingEvent ? '일정 수정' : '일정 등록'}을 위한 <br /> 정보를 입력해주세요
                    </_.ModalTitle>
                    <_.ModalInput 
                        placeholder="타이틀을 입력하세요" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <_.ModalInput 
                        placeholder="내용을 입력하세요" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <_.Row>
                        <_.SmallText>기간: {formatDateRange()}</_.SmallText>
                        <_.SaveBtn onClick={handleSave}>
                            {editingEvent ? '수정하기' : '등록하기'}
                        </_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
            <Modal isOpen={isDetailOpen} closeModal={() => {
                setIsDetailOpen(false);
                setViewingEvent(null);
            }}>
                <_.ModalInner>
                    <Image src="/assets/calendar.svg" alt="캘린더 아이콘" width={48} height={48} />
                    <_.ModalTitle>{viewingEvent?.title}</_.ModalTitle>
                    <_.DetailContent>{viewingEvent?.content}</_.DetailContent>
                    <_.SmallText>기간: {formatEventDateRange()}</_.SmallText>
                    <_.ButtonRow>
                        <_.EditBtn onClick={handleEdit}>수정</_.EditBtn>
                        <_.DeleteBtn onClick={handleDelete}>삭제</_.DeleteBtn>
                    </_.ButtonRow>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}
