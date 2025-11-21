"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import * as _ from "./style";
import { useVideoChat } from "@/shared/hooks/useVideoChat";

export default function VideoChat() {
    const params = useParams();
    const teamId = params?.id ? parseInt(params.id as string, 10) : null;

    const {
        showParticipants, setShowParticipants, chatWidth, chatScrollRef,
        videoRef, message, setMessage, messages, participants, remoteStreams,
        selectedParticipant, setSelectedParticipant, localStream, roomId,
        isConnected, connectionStatus, isScreenSharing, handleResize,
        handleKeyDown, createRoom, joinRoom, leaveRoom, findOrCreateTeamRoom, toggleCamera,
        toggleMicrophone, startScreenShare, stopScreenShare
    } = useVideoChat();

    const [camOn, setCamOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [headsetOn, setHeadsetOn] = useState(true);
    const [roomTitle, setRoomTitle] = useState("My Video Room");
    const [inputRoomId, setInputRoomId] = useState("");
    const [isCallActive, setIsCallActive] = useState(false);

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localPipVideoRef = useRef<HTMLVideoElement>(null);

    const handleToggleCall = async () => {
        if (isCallActive) {
            // 화상통화 종료
            await leaveRoom();
            setIsCallActive(false);
        } else {
            // 화상통화 시작
            if (!teamId) {
                alert("팀 정보를 찾을 수 없습니다.");
                return;
            }

            try {
                console.log('Starting video chat for team:', teamId);
                
                // 팀 방 찾거나 생성
                const room = await findOrCreateTeamRoom(teamId);
                console.log('Room found/created:', room);
                
                setInputRoomId(room.roomId);
                
                // 잠시 대기 후 방 입장 (방 생성이 완료될 시간 확보)
                console.log('Waiting before joining room...');
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 방 입장
                console.log('Now joining room:', room.roomId);
                await joinRoom(room.roomId);
                setIsCallActive(true);
            } catch (error) {
                console.error("Failed to start video chat:", error);
                alert(`화상통화를 시작할 수 없습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            }
        }
    };

    useEffect(() => {
        if (selectedParticipant && remoteStreams[selectedParticipant] && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreams[selectedParticipant];
            // 헤드셋 상태 적용
            remoteVideoRef.current.muted = !headsetOn;
        } else if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    }, [selectedParticipant, remoteStreams, headsetOn]);

    useEffect(() => {
        if (selectedParticipant && localStream && localPipVideoRef.current) {
            localPipVideoRef.current.srcObject = localStream;
        }
    }, [selectedParticipant, localStream]);

    const handleCreateRoom = async () => {
        try {
            const newRoomId = await createRoom(roomTitle);
            setInputRoomId(newRoomId);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleJoinRoom = () => {
        if (inputRoomId.trim()) {
            joinRoom(inputRoomId.trim());
        }
    };

    const handleCameraToggle = () => {
        toggleCamera();
        setCamOn(!camOn);
    };

    const handleMicToggle = () => {
        toggleMicrophone();
        setMicOn(!micOn);
    };

    const handleHeadsetToggle = () => {
        const newHeadsetState = !headsetOn;
        setHeadsetOn(newHeadsetState);
        
        // 모든 원격 비디오 요소의 오디오 음소거/해제
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = !newHeadsetState;
        }
        
        // 모든 원격 스트림의 오디오 트랙 활성화/비활성화
        Object.values(remoteStreams).forEach(stream => {
            stream.getAudioTracks().forEach(track => {
                track.enabled = newHeadsetState;
            });
        });
    };

    const handleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                await stopScreenShare();
            } else {
                await startScreenShare();
            }
        } catch (error) {
            console.error('Screen share error:', error);
        }
    };

    const icons = [
        { on: "/assets/videoChat/cam.svg", off: "/assets/videoChat/noncam.svg", state: camOn, handler: handleCameraToggle, alt: "캠" },
        { on: "/assets/videoChat/mic.svg", off: "/assets/videoChat/nonmic.svg", state: micOn, handler: handleMicToggle, alt: "마이크" },
        { on: "/assets/videoChat/headset.svg", off: "/assets/videoChat/nonheadset.svg", state: headsetOn, handler: handleHeadsetToggle, alt: "헤드셋" },
        { on: "/assets/videoChat/share.svg", off: null, state: isScreenSharing, handler: handleScreenShare, alt: "공유" },
    ];

    return (
        <_.TopContainer>
            <_.IconGroup onClick={handleToggleCall} style={{ cursor: "pointer" }}>
                <Image
                    src={isCallActive ? "/assets/nonopen.svg" : "/assets/open.svg"}
                    alt="화상통화 아이콘"
                    width={24}
                    height={24}
                />
                <_.Sub>{isCallActive ? "화상통화 종료" : "화상통화 시작"}</_.Sub>
            </_.IconGroup>
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
                <div style={{ position: "relative", width: "100%", height: "70vh" }}>
                    {selectedParticipant && remoteStreams[selectedParticipant] ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                backgroundColor: "#000",
                            }}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                backgroundColor: "#000",
                            }}
                        />
                    )}
                    {selectedParticipant && remoteStreams[selectedParticipant] && (
                        <div
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                width: "200px",
                                height: "150px",
                                zIndex: 10,
                            }}
                        >
                            <video
                                ref={localPipVideoRef}
                                autoPlay
                                muted
                                playsInline
                                onClick={() => setSelectedParticipant(null)}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    border: "2px solid white",
                                    borderRadius: "8px",
                                    backgroundColor: "#000",
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: "5px",
                                left: "5px",
                                background: "rgba(0,0,0,0.7)",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                fontSize: "12px",
                                pointerEvents: "none",
                            }}>
                                나
                            </div>
                        </div>
                    )}
                    <div style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        zIndex: 10,
                    }}>
                        {selectedParticipant
                            ? `${participants.find(p => p.id === selectedParticipant)?.name || 'Unknown'}`
                            : "나 (로컬)"
                        }
                    </div>
                </div>
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
                            <_.Name
                                onClick={() => setSelectedParticipant(null)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: selectedParticipant === null ? "#e3f2fd" : "transparent",
                                    padding: "5px",
                                    borderRadius: "4px",
                                    margin: "2px 0"
                                }}
                            >
                                <_.Circle /> 나 (로컬)
                            </_.Name>
                            {participants.map((participant) => (
                                <_.Name
                                    key={participant.id}
                                    onClick={() => setSelectedParticipant(participant.id)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: selectedParticipant === participant.id ? "#e3f2fd" : "transparent",
                                        padding: "5px",
                                        borderRadius: "4px",
                                        margin: "2px 0"
                                    }}
                                >
                                    <_.Circle /> {participant.name}
                                    {remoteStreams[participant.id] && (
                                        <span style={{ marginLeft: "5px", color: "#4caf50", fontSize: "12px" }}>
                                            ● 연결됨
                                        </span>
                                    )}
                                </_.Name>
                            ))}
                            {participants.length === 0 && (
                                <_.Name><_.Circle /> 다른 참가자가 없습니다</_.Name>
                            )}
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
                            onClick={icon.handler}
                            style={{ cursor: "pointer" }}
                        />
                    ))}
                </_.IconWrapper>
            </_.IconWrapper>
        </_.TopContainer>
    );
}