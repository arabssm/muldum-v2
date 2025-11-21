"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { videoChatAPI } from "../api/videoChat";
import type { Participant, WebRTCMessage } from "@/shared/types/video";



export function useVideoChat() {
    const [showParticipants, setShowParticipants] = useState(true);
    const [chatWidth, setChatWidth] = useState(320);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ name: string; text: string }[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [remoteStreams, setRemoteStreams] = useState<{ [userId: string]: MediaStream }>({});
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string>("");
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Not connected");

    const chatScrollRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionsRef = useRef<{ [userId: string]: RTCPeerConnection }>({});
    const remoteVideosRef = useRef<{ [userId: string]: HTMLVideoElement }>({});

    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const pc_config = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendWebSocketMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    const createRoom = async (title: string, teamId: number = 1, maxParticipants: number = 20) => {
        try {
            const result = await videoChatAPI.createRoom({ title, teamId, maxParticipants });
            if (result.roomId) {
                setRoomId(result.roomId);
                return result.roomId;
            }
            throw new Error('Failed to create room');
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    };

    const startLocalMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    };

    const createPeerConnection = useCallback((userId: string, isOfferor: boolean) => {
        if (peerConnectionsRef.current[userId]) return;

        const pc = new RTCPeerConnection(pc_config);
        peerConnectionsRef.current[userId] = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendWebSocketMessage({ type: 'candidate', to: userId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            addRemoteVideo(userId, event.streams[0]);
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        if (isOfferor) {
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .then(() => sendWebSocketMessage({ type: 'offer', to: userId, sdp: pc.localDescription }))
                .catch(e => console.error("Offer creation failed", e));
        }
    }, [sendWebSocketMessage]);

    const addRemoteVideo = (userId: string, stream: MediaStream) => {
        setParticipants(prev => {
            if (!prev.find(p => p.id === userId)) {
                return [...prev, { id: userId, name: `User ${userId.substring(0, 8)}` }];
            }
            return prev;
        });

        setRemoteStreams(prev => ({
            ...prev,
            [userId]: stream
        }));

        console.log(`Remote video added for user ${userId}`);
    };

    const closePeerConnection = (userId: string) => {
        if (peerConnectionsRef.current[userId]) {
            peerConnectionsRef.current[userId].close();
            delete peerConnectionsRef.current[userId];
        }

        setParticipants(prev => prev.filter(p => p.id !== userId));

        setRemoteStreams(prev => {
            const newStreams = { ...prev };
            delete newStreams[userId];
            return newStreams;
        });

        setSelectedParticipant(prev => prev === userId ? null : prev);

        if (remoteVideosRef.current[userId]) {
            delete remoteVideosRef.current[userId];
        }
    };

    const joinRoom = async (roomId: string) => {
        try {
            setConnectionStatus(`Connecting to room ${roomId}...`);
            console.log('Attempting to join room:', roomId);

            await startLocalMedia();

            // 환경 변수 또는 현재 도메인 기반으로 API URL 결정
            let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            
            if (!apiBaseUrl && typeof window !== 'undefined') {
                // 배포 환경에서 환경 변수가 없으면 현재 도메인 기반으로 추론
                const hostname = window.location.hostname;
                if (hostname.includes('muldum.com')) {
                    apiBaseUrl = 'https://backend.muldum.com';
                } else {
                    apiBaseUrl = 'http://localhost:8080';
                }
            }
            
            apiBaseUrl = apiBaseUrl || 'http://localhost:8080';
            console.log('API Base URL from env:', process.env.NEXT_PUBLIC_API_BASE_URL);
            console.log('Using API Base URL:', apiBaseUrl);
            
            const wsProtocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
            const wsHost = apiBaseUrl.replace(/^https?:\/\//, '');
            const wsUrl = `${wsProtocol}://${wsHost}/api/ws/signal?roomId=${roomId}`;
            
            console.log('WebSocket URL:', wsUrl);
            
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setConnectionStatus(`Connected to room ${roomId}`);
                console.log('WebSocket connected successfully');
            };

            ws.onmessage = async (event) => {
                const message: WebRTCMessage = JSON.parse(event.data);
                const from = message.from;
                const data = message.data;

                console.log('WebSocket message received:', message.type, message);

                switch (message.type) {
                    case 'existing_users':
                        setConnectionStatus(`Found ${data.length} existing users. Connecting...`);
                        for (const userId of data) {
                            createPeerConnection(userId, true);
                        }
                        break;
                    case 'new_user':
                        setConnectionStatus(`User ${data} joined. Preparing connection...`);
                        createPeerConnection(data, false);
                        break;
                    case 'offer':
                        if (!peerConnectionsRef.current[from!]) {
                            createPeerConnection(from!, false);
                        }
                        await peerConnectionsRef.current[from!].setRemoteDescription(new RTCSessionDescription(message.sdp!));
                        const answer = await peerConnectionsRef.current[from!].createAnswer();
                        await peerConnectionsRef.current[from!].setLocalDescription(answer);
                        sendWebSocketMessage({ type: 'answer', to: from, sdp: answer });
                        break;
                    case 'answer':
                        await peerConnectionsRef.current[from!].setRemoteDescription(new RTCSessionDescription(message.sdp!));
                        break;
                    case 'candidate':
                        if (peerConnectionsRef.current[from!]) {
                            try {
                                await peerConnectionsRef.current[from!].addIceCandidate(new RTCIceCandidate(message.candidate!));
                            } catch (e) {
                                console.error('Error adding ICE candidate', e);
                            }
                        }
                        break;
                    case 'user_left':
                        setConnectionStatus(`User ${data} left.`);
                        closePeerConnection(data);
                        break;
                    case 'error':
                        console.error(`Error from server: ${message.message}`);
                        alert(`화상통화 오류: ${message.message}`);
                        leaveRoom();
                        break;
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                setConnectionStatus('Disconnected');
                console.log('WebSocket disconnected');
                stopLocalMedia();
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
                setConnectionStatus('Connection error');
            };

        } catch (error) {
            console.error('Error joining room:', error);
            setConnectionStatus('Failed to join room');
            alert('화상통화 연결에 실패했습니다.');
        }
    };

    const leaveRoom = async () => {
        try {
            if (roomId) {
                await videoChatAPI.leaveRoom(roomId);
            }
        } catch (error) {
            console.error('Error leaving room via API:', error);
        }

        if (wsRef.current) {
            wsRef.current.close();
        }
        stopLocalMedia();
        setIsConnected(false);
        setParticipants([]);
        setRoomId("");
    };

    const listRooms = async () => {
        try {
            return await videoChatAPI.listRooms();
        } catch (error) {
            console.error('Error listing rooms:', error);
            throw error;
        }
    };

    const findOrCreateTeamRoom = async (teamId: number) => {
        try {
            const room = await videoChatAPI.findOrCreateTeamRoom(teamId);
            console.log('Team room:', room);
            setRoomId(room.roomId);
            return room;
        } catch (error) {
            console.error('Error finding or creating team room:', error);
            throw error;
        }
    };

    const stopLocalMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        Object.keys(peerConnectionsRef.current).forEach(userId => {
            closePeerConnection(userId);
        });

        setIsScreenSharing(false);
    };

    const toggleCamera = () => {
        if (!localStreamRef.current) return;
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
        }
    };

    const toggleMicrophone = () => {
        if (!localStreamRef.current) return;
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
        }
    };

    const startScreenShare = async () => {
        try {
            if (Object.keys(peerConnectionsRef.current).length === 0) {
                throw new Error('Join a room and connect to a peer before sharing screen');
            }

            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = screenStream;
            const screenTrack = screenStream.getVideoTracks()[0];

            // Replace video track in all peer connections
            for (const userId in peerConnectionsRef.current) {
                const pc = peerConnectionsRef.current[userId];
                const videoSender = pc.getSenders().find(sender => sender.track?.kind === 'video');
                if (videoSender) {
                    await videoSender.replaceTrack(screenTrack);
                }
            }

            setIsScreenSharing(true);

            screenTrack.onended = () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error('Screen share failed:', error);
            throw error;
        }
    };

    const stopScreenShare = async () => {
        if (!localStreamRef.current) return;

        const cameraTrack = localStreamRef.current.getVideoTracks()[0];

        for (const userId in peerConnectionsRef.current) {
            const pc = peerConnectionsRef.current[userId];
            const videoSender = pc.getSenders().find(sender => sender.track?.kind === 'video');
            if (videoSender && cameraTrack) {
                await videoSender.replaceTrack(cameraTrack);
            }
        }

        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }

        setIsScreenSharing(false);
    };

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

    useEffect(() => {
        return () => {
            leaveRoom();
        };
    }, []);

    return {
        showParticipants,
        setShowParticipants,
        chatWidth,
        chatScrollRef,
        videoRef,
        message,
        setMessage,
        messages,
        participants,
        remoteStreams,
        selectedParticipant,
        setSelectedParticipant,
        localStream: localStreamRef.current,
        roomId,
        isConnected,
        connectionStatus,
        isScreenSharing,
        handleResize,
        handleSendMessage,
        handleKeyDown,
        createRoom,
        joinRoom,
        leaveRoom,
        listRooms,
        findOrCreateTeamRoom,
        toggleCamera,
        toggleMicrophone,
        startScreenShare,
        stopScreenShare,
    };
}