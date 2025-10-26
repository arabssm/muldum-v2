"use client";

import Image from "next/image";
import * as _ from "./style";
import { useVideoChat } from "@/shared/hooks/useVideoChat";

export default function VideoChat() {
    const {
        showParticipants, setShowParticipants, chatWidth,
        chatScrollRef, videoRef, message, setMessage,
        messages, handleResize, handleKeyDown } = useVideoChat();

    return (
        <_.Container>
            <_.ChatWrapper
                style={{
                    width: chatWidth,
                    zIndex: 1,
                    background: "rgba(250,250,250,0.85)",
                }}
            >
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
                    justifyContent: "center",
                }}
            />
            {!showParticipants && (
                <Image
                    src="/assets/videoChat/Participant.svg"
                    alt="참가자 아이콘"
                    width={40}
                    height={40}
                    onClick={() => setShowParticipants(true)}
                    style={{
                        cursor: "pointer",
                        zIndex: 1,
                        marginLeft: "1rem",
                    }}
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