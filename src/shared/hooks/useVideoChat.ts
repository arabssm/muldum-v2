"use client";

import { useState, useEffect, useRef } from "react";

export function useVideoChat() {
    const [showParticipants, setShowParticipants] = useState(true);
    const [chatWidth, setChatWidth] = useState(320);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ name: string; text: string }[]>([]);
    const chatScrollRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
    }, []);

    const handleResize = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = chatWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            if (newWidth >= 200 && newWidth <= 800) setChatWidth(newWidth);
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, { name: "김예빈", text: message }]);
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => handleSendMessage(), 0);
        }
    };

    return {
        showParticipants,
        setShowParticipants,
        chatWidth,
        chatScrollRef,
        videoRef,
        message,
        setMessage,
        messages,
        handleResize,
        handleSendMessage,
        handleKeyDown,
    };
}