"use client";

import { useState } from "react";
import { items } from "@/widgets/student/itemList/data";

export function useApplyAndModalState() {
    const [activeGroup, setActiveGroup] = useState("승인 가능 물품 조회");
    const [activeClass, setActiveClass] = useState("전체");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    const handleCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked(prev => prev.map((v, i) => (i === index ? !v : v)));
    };

    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const toggleAll = () => {
        setChecked(prev => {
            const isAllChecked = prev.every(v => v === true);
            return prev.map(() => !isAllChecked);
        });
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    const [isNoticeOpen, setIsNoticeOpen] = useState(false);
    const [noticeText, setNoticeText] = useState("");

    const handleSave = () => {
        if (!title.trim()) {
            alert("차수를 입력해주세요");
            return;
        }
        alert(`${title}차 물품 신청 기간이 열렸습니다.`);
        setTitle("");
        setIsOpen(false);
    };

    const handleSaveNotice = () => {
        if (!noticeText.trim()) {
            alert("주의사항을 입력해주세요");
            return;
        }
        alert("주의사항이 저장되었습니다.");
        setNoticeText("");
        setIsNoticeOpen(false);
    };

    return {
        activeGroup,
        activeClass,
        openIndex,
        checked,
        setActiveGroup,
        setActiveClass,
        handleToggle,
        handleCheckboxClick,
        getCheckboxIcon,
        searchQuery,
        handleSearchChange,
        isOpen,
        title,
        setIsOpen,
        setTitle,
        handleSave,
        isNoticeOpen,
        noticeText,
        setIsNoticeOpen,
        setNoticeText,
        handleSaveNotice,
        toggleAll
    };
}