"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import * as _ from "./style";

export default function VideoChat() {
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
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
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
        if (e.key === "Enter") { e.preventDefault(); setTimeout(() => handleSendMessage(), 0); }
    };

    return (
        <_.Container>
            <_.ChatWrapper style={{ width: chatWidth, zIndex: 1, background: "rgba(250,250,250,0.85)" }}>
                <_.ChatScroll ref={chatScrollRef}>
                    {messages.map((msg, idx) => (
                        <_.ChatMessage key={idx}>
                            <_.Circle />
                            <div>
                                <_.Name>{msg.name}</_.Name>
                                <_.Chat>{msg.text}</_.Chat>
                            </div>
                        </_.ChatMessage>
                    ))}
                </_.ChatScroll>
                <_.ChatInput
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <_.Drag onMouseDown={handleResize}>
                    <Image src="/assets/drag.svg" alt="드래그 아이콘" width={24} height={24} />
                </_.Drag>
                <_.ResizeHandle onMouseDown={handleResize} />
            </_.ChatWrapper>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                    width: "100%",
                    height: "70vh",
                    objectFit: "cover",
                    zIndex: 0,
                    justifyContent: "center"
                }}
            />
            {!showParticipants && (
                <Image
                    src="/assets/videoChat/Participant.svg"
                    alt="참가자 아이콘"
                    width={40}
                    height={40}
                    onClick={() => setShowParticipants(true)}
                    style={{ cursor: "pointer", zIndex: 1, marginLeft: '1rem' }}
                />
            )}
            {showParticipants && (
                <_.ParticipantPanel style={{ zIndex: 1 }}>
                    <_.CloseButton onClick={() => setShowParticipants(false)}>×</_.CloseButton>
                    <_.ParticipantList>
                        <_.Name><_.Circle /> 참가팀원1</_.Name>
                        <_.Name><_.Circle /> 참가팀원2</_.Name>
                    </_.ParticipantList>
                </_.ParticipantPanel>
            )}
        </_.Container>
    );
}