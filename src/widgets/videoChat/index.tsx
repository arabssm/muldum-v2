"use client";

import Image from "next/image";
import { useState } from "react";
import * as _ from "./style";

export default function VideoChat() {
    const [showParticipants, setShowParticipants] = useState(true);
    const [chatWidth, setChatWidth] = useState(320);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ name: string; text: string }[]>([]);

    const handleResize = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = chatWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            if (newWidth >= 200 && newWidth <= 600) {
                setChatWidth(newWidth);
            }
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        setMessages([...messages, { name: "김예빈", text: message }]);
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <_.Container>
            <_.ChatWrapper style={{ width: chatWidth }}>
                <_.ChatScroll>
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
                <_.Drag onMouseDown={handleResize}>
                    <Image
                        src="/assets/drag.svg"
                        alt="참가자 아이콘"
                        width={24}
                        height={24}
                    />
                </_.Drag>
                <_.ChatInput
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <_.ResizeHandle onMouseDown={handleResize} />
            </_.ChatWrapper>
            <_.VideoArea />
            {showParticipants ? (
                <_.ParticipantPanel>
                    <_.CloseButton onClick={() => setShowParticipants(false)}>×</_.CloseButton>
                    <_.ParticipantList>
                        <_.Name>
                            <_.Circle /> 참가팀원1
                        </_.Name>
                        <_.Name>
                            <_.Circle /> 참가팀원2
                        </_.Name>
                    </_.ParticipantList>
                </_.ParticipantPanel>
            ) : (
                <Image
                    src="/assets/Participant.svg"
                    alt="참가자 아이콘"
                    width={40}
                    height={40}
                    onClick={() => setShowParticipants(true)}
                    style={{ cursor: "pointer" }}
                />
            )}
        </_.Container>
    );
}