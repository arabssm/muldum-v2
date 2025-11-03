"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import * as _ from "./style";
import { useVideoChat } from "@/shared/hooks/useVideoChat";

export default function VideoChat() {
    const {
        showParticipants, setShowParticipants, chatWidth, chatScrollRef,
        videoRef, message, setMessage, messages, participants, remoteStreams,
        selectedParticipant, setSelectedParticipant, localStream, roomId, 
        isConnected, connectionStatus, isScreenSharing, handleResize, 
        handleKeyDown, createRoom, joinRoom, leaveRoom, toggleCamera, 
        toggleMicrophone, startScreenShare, stopScreenShare
    } = useVideoChat();

    const [camOn, setCamOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [headsetOn, setHeadsetOn] = useState(true);
    const [roomTitle, setRoomTitle] = useState("My Video Room");
    const [inputRoomId, setInputRoomId] = useState("");
    
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localPipVideoRef = useRef<HTMLVideoElement>(null);

    // Update remote video when participant is selected
    useEffect(() => {
        if (selectedParticipant && remoteStreams[selectedParticipant] && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreams[selectedParticipant];
        } else if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    }, [selectedParticipant, remoteStreams]);

    // Update local PIP video when showing remote video
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
        { on: "/assets/videoChat/headset.svg", off: "/assets/videoChat/nonheadset.svg", state: headsetOn, handler: () => setHeadsetOn(!headsetOn), alt: "헤드셋" },
        { on: "/assets/videoChat/share.svg", off: null, state: isScreenSharing, handler: handleScreenShare, alt: "공유" },
    ];

    return (
        <_.TopContainer>
            <div style={{ padding: "1rem", background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <input
                        type="text"
                        placeholder="방 제목"
                        value={roomTitle}
                        onChange={(e) => setRoomTitle(e.target.value)}
                        style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                    <button
                        onClick={handleCreateRoom}
                        style={{ padding: "0.5rem 1rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        방 생성
                    </button>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="방 ID 입력"
                        value={inputRoomId}
                        onChange={(e) => setInputRoomId(e.target.value)}
                        style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                    <button
                        onClick={handleJoinRoom}
                        disabled={!inputRoomId.trim() || isConnected}
                        style={{
                            padding: "0.5rem 1rem",
                            background: isConnected ? "#6c757d" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isConnected ? "not-allowed" : "pointer"
                        }}
                    >
                        {isConnected ? "연결됨" : "방 참가"}
                    </button>
                    {isConnected && (
                        <button
                            onClick={leaveRoom}
                            style={{ padding: "0.5rem 1rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                            방 나가기
                        </button>
                    )}
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6c757d" }}>
                    상태: {connectionStatus}
                    {roomId && <span> | 방 ID: {roomId}</span>}
                </div>
            </div>

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
                    {/* Main video (remote or local) */}
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
                    
                    {/* Picture-in-picture local video when showing remote */}
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
                    
                    {/* Video info overlay */}
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
                            {/* Local user */}
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
                            
                            {/* Remote participants */}
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