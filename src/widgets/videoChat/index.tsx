"use client";

import Image from "next/image";
import { useState } from "react";
import * as _ from "./style";

export default function VideoChat() {
    const [showParticipants, setShowParticipants] = useState(true);
    const [chatWidth, setChatWidth] = useState(320);

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

    return (
        <_.Container>
            <_.ChatWrapper style={{ width: chatWidth }}>
                <_.ChatScroll>
                    <_.ChatMessage>
                        <_.Circle />
                        <div>
                            <_.Name>참가팀원1</_.Name>
                            <_.Chat>아닌데 이것맞양??</_.Chat>
                        </div>
                    </_.ChatMessage>
                </_.ChatScroll>
                <_.Drag>
                    <Image
                        src="/assets/drag.svg"
                        alt="참가자 아이콘"
                        width={24}
                        height={24}
                    />
                </_.Drag>
                <_.ChatInput placeholder="메시지를 입력하세요..." />
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