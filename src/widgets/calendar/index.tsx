"use client";

import * as _ from "./style";

export default function Calendar() {
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <_.Container>
            <_.CalendarWrapper>
                <_.HeaderRow>
                    {days.map((day) => (
                        <_.HeaderCell key={day}>{day}</_.HeaderCell>
                    ))}
                </_.HeaderRow>
                <_.Body>
                    {dates.map((date) => (
                        <_.Cell key={date}>{date}</_.Cell>
                    ))}
                </_.Body>
            </_.CalendarWrapper>
        </_.Container>
    );
}