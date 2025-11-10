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
        isConnected, connectionStatus, isScreenSharing, isRecording, transcription,
        uploadProgress, transcriptionResult, selectedProvider, setSelectedProvider,
        handleResize, handleKeyDown, createRoom, joinRoom, leaveRoom, toggleCamera,
        toggleMicrophone, startScreenShare, stopScreenShare, toggleRecording,
        summarizeText, summarizeSegments
    } = useVideoChat();

    const [camOn, setCamOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [headsetOn, setHeadsetOn] = useState(true);
    const [roomTitle, setRoomTitle] = useState("My Video Room");
    const [inputRoomId, setInputRoomId] = useState("");
    const [showTranscriptionPanel, setShowTranscriptionPanel] = useState(false);
    const [manualText, setManualText] = useState("");

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localPipVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (selectedParticipant && remoteStreams[selectedParticipant] && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreams[selectedParticipant];
        } else if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    }, [selectedParticipant, remoteStreams]);

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

    const handleRecordToggle = () => {
        toggleRecording();
    };

    return (
        <_.TopContainer>
            <div style={{ padding: "1rem", background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
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
                    <button
                        onClick={handleRecordToggle}
                        style={{
                            padding: "10px 20px",
                            background: isRecording ? "#dc3545" : "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginLeft: "10px"
                        }}
                    >
                        {isRecording ? "🔴 녹음 중지" : "🎤 녹음 시작"}
                    </button>
                    <button
                        onClick={() => setShowTranscriptionPanel(true)}
                        style={{
                            padding: "10px 20px",
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginLeft: "10px"
                        }}
                    >
                        📝 음성인식 설정
                    </button>
                </_.IconWrapper>
            </_.IconWrapper>
            {transcription && (
                <div style={{
                    position: "fixed",
                    bottom: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "8px",
                    maxWidth: "80%",
                    zIndex: 1000,
                }}>
                    <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "5px" }}>
                        {isRecording ? "녹음 중..." : "처리 중..."}
                    </div>
                    <div style={{ fontSize: "16px" }}>{transcription}</div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div style={{ marginTop: "10px", background: "#333", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{
                                width: `${uploadProgress}%`,
                                height: "4px",
                                background: "#4caf50",
                                transition: "width 0.3s"
                            }} />
                        </div>
                    )}
                </div>
            )}

            {/* 음성 인식 결과 패널 */}
            {showTranscriptionPanel && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    overflow: "auto",
                    zIndex: 2000,
                }}>
                    <button
                        onClick={() => setShowTranscriptionPanel(false)}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "transparent",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "#666"
                        }}
                    >
                        ×
                    </button>

                    <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>음성 인식 & 요약</h2>

                    {/* Provider 선택 */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" }}>
                            STT Provider 선택:
                        </label>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value as any)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px"
                            }}
                        >
                            <option value="whisper">Whisper (오픈소스)</option>
                            <option value="google">Google Cloud Speech-to-Text</option>
                            <option value="aws">AWS Transcribe</option>
                            <option value="azure">Azure Speech Service</option>
                        </select>
                    </div>

                    {/* 수동 텍스트 입력 */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" }}>
                            또는 텍스트 직접 입력:
                        </label>
                        <textarea
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            placeholder="회의 내용을 입력하세요..."
                            style={{
                                width: "100%",
                                minHeight: "100px",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px",
                                resize: "vertical"
                            }}
                        />
                        <button
                            onClick={async () => {
                                if (manualText.trim()) {
                                    await summarizeText(manualText);
                                }
                            }}
                            disabled={!manualText.trim()}
                            style={{
                                marginTop: "10px",
                                padding: "10px 20px",
                                background: manualText.trim() ? "#007bff" : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: manualText.trim() ? "pointer" : "not-allowed",
                                fontSize: "14px"
                            }}
                        >
                            텍스트 요약하기
                        </button>
                    </div>

                    {/* 결과 표시 */}
                    {transcriptionResult && (
                        <div style={{ marginTop: "30px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
                            <h3 style={{ marginTop: 0, color: "#333" }}>처리 결과</h3>
                            
                            {transcriptionResult.provider && (
                                <div style={{ marginBottom: "15px" }}>
                                    <strong>Provider:</strong> {transcriptionResult.provider}
                                </div>
                            )}

                            {transcriptionResult.summary && (
                                <div style={{ marginBottom: "15px" }}>
                                    <strong>요약:</strong>
                                    <div style={{ 
                                        marginTop: "8px", 
                                        padding: "12px", 
                                        background: "white", 
                                        borderRadius: "6px",
                                        whiteSpace: "pre-wrap"
                                    }}>
                                        {transcriptionResult.summary}
                                    </div>
                                </div>
                            )}

                            {transcriptionResult.segments && transcriptionResult.segments.length > 0 && (
                                <div>
                                    <strong>화자별 내용:</strong>
                                    <div style={{ marginTop: "8px" }}>
                                        {transcriptionResult.segments.map((seg: any, idx: number) => (
                                            <div key={idx} style={{
                                                marginBottom: "10px",
                                                padding: "12px",
                                                background: "white",
                                                borderRadius: "6px",
                                                borderLeft: "3px solid #007bff"
                                            }}>
                                                <div style={{ fontWeight: "bold", color: "#007bff", marginBottom: "5px" }}>
                                                    {seg.speaker}
                                                </div>
                                                <div style={{ color: "#333" }}>{seg.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 반투명 배경 */}
            {showTranscriptionPanel && (
                <div
                    onClick={() => setShowTranscriptionPanel(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1999,
                    }}
                />
            )}
        </_.TopContainer>
    );
}