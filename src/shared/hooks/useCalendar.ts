import { useState } from "react";

export function useCalendarDrag(dates: number[]) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragEnd, setDragEnd] = useState<number | null>(null);
    const [highlightSet, setHighlightSet] = useState<Set<number>>(new Set());
    const [modalRange, setModalRange] = useState<{ from: number; to: number } | null>(null);

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
            reset();
            return;
        }
        const a = Math.min(dragStart, dragEnd);
        const b = Math.max(dragStart, dragEnd);
        setModalRange({ from: dates[a], to: dates[b] });
        reset();
    };

    const reset = () => {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        setHighlightSet(new Set());
    };

    return {
        isDragging,
        highlightSet,
        modalRange,
        onCellMouseDown,
        onCellMouseEnter,
        onMouseUp,
        reset,
        setModalRange,
    };
}