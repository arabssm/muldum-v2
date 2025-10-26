"use client";

import { useState } from "react";
import Image from "next/image";
import * as _ from "./style";
import { useVideoChat } from "@/shared/hooks/useVideoChat";

export default function VideoChat() {
    const { showParticipants, setShowParticipants, chatWidth, chatScrollRef,
        videoRef, message, setMessage, messages, handleResize, handleKeyDown } = useVideoChat();

    const [camOn, setCamOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [headsetOn, setHeadsetOn] = useState(true);
    const [shareOn, setShareOn] = useState(false);

    const icons = [
        { on: "/assets/videoChat/cam.svg", off: "/assets/videoChat/noncam.svg", state: camOn, setState: setCamOn, alt: "캠" },
        { on: "/assets/videoChat/mic.svg", off: "/assets/videoChat/nonmic.svg", state: micOn, setState: setMicOn, alt: "마이크" },
        { on: "/assets/videoChat/headset.svg", off: "/assets/videoChat/nonheadset.svg", state: headsetOn, setState: setHeadsetOn, alt: "헤드셋" },
        { on: "/assets/videoChat/share.svg", off: null, state: shareOn, setState: setShareOn, alt: "공유" }, // off=null
    ];

    return (
        <_.TopContainer>
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
            <_.IconWrapper>
                <_.IconWrapper>
                    {icons.map((icon, idx) => (
                        <Image
                            key={idx}
                            src={icon.state || !icon.off ? icon.on : icon.off!}
                            alt={`${icon.alt} 아이콘`}
                            width={50}
                            height={50}
                            onClick={() => {
                                if (icon.alt === "공유") {
                                    icon.setState(true);
                                } else {
                                    icon.setState(prev => !prev);
                                }
                            }}
                        />
                    ))}
                </_.IconWrapper>
            </_.IconWrapper>
        </_.TopContainer>
    );
}