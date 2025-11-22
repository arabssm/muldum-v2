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
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentSessionIdRef = useRef<string>("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mixedStreamRef = useRef<MediaStream | null>(null);
    const joinSoundRef = useRef<HTMLAudioElement | null>(null);
    const leaveSoundRef = useRef<HTMLAudioElement | null>(null);

    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const pc_config = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };

    // 효과음 초기화
    useEffect(() => {
        joinSoundRef.current = new Audio('/sounds/join.mp3');
        leaveSoundRef.current = new Audio('/sounds/leave.mp3');
        
        // 볼륨 설정
        if (joinSoundRef.current) joinSoundRef.current.volume = 0.5;
        if (leaveSoundRef.current) leaveSoundRef.current.volume = 0.5;
        
        return () => {
            // 정리
            if (joinSoundRef.current) {
                joinSoundRef.current.pause();
                joinSoundRef.current = null;
            }
            if (leaveSoundRef.current) {
                leaveSoundRef.current.pause();
                leaveSoundRef.current = null;
            }
        };
    }, []);

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

    const playJoinSound = () => {
        if (joinSoundRef.current) {
            joinSoundRef.current.currentTime = 0;
            joinSoundRef.current.play().catch(error => {
                console.log('Failed to play join sound:', error);
            });
        }
    };

    const playLeaveSound = () => {
        if (leaveSoundRef.current) {
            leaveSoundRef.current.currentTime = 0;
            leaveSoundRef.current.play().catch(error => {
                console.log('Failed to play leave sound:', error);
            });
        }
    };

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
            
            // 로컬 스트림 트랙 확인
            const audioTracks = stream.getAudioTracks();
            const videoTracks = stream.getVideoTracks();
            console.log('Local stream tracks:', {
                audioTracks: audioTracks.length,
                videoTracks: videoTracks.length,
                audioEnabled: audioTracks[0]?.enabled,
                videoEnabled: videoTracks[0]?.enabled,
                audioLabel: audioTracks[0]?.label,
                videoLabel: videoTracks[0]?.label
            });
            
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

        // ICE 연결 상태 로깅
        pc.oniceconnectionstatechange = () => {
            console.log(`ICE connection state for ${userId}:`, pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed') {
                console.error(`ICE connection failed for ${userId}. May need TURN server.`);
            }
        };

        // 연결 상태 로깅
        pc.onconnectionstatechange = () => {
            console.log(`Connection state for ${userId}:`, pc.connectionState);
        };

        // ICE gathering 상태 로깅
        pc.onicegatheringstatechange = () => {
            console.log(`ICE gathering state for ${userId}:`, pc.iceGatheringState);
        };

        // Signaling 상태 로깅
        pc.onsignalingstatechange = () => {
            console.log(`Signaling state for ${userId}:`, pc.signalingState);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`Sending ICE candidate to ${userId}`);
                sendWebSocketMessage({ type: 'candidate', to: userId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            console.log(`ontrack event for ${userId}:`, {
                kind: event.track.kind,
                enabled: event.track.enabled,
                muted: event.track.muted,
                readyState: event.track.readyState
            });
            
            // 이미 participants에 있는 경우 userName 가져오기
            const existingParticipant = participants.find(p => p.id === userId);
            addRemoteVideo(userId, event.streams[0], existingParticipant?.name);
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                const sender = pc.addTrack(track, localStreamRef.current!);
                console.log(`Added ${track.kind} track to peer connection for ${userId}`);
            });
            
            // Sender 확인
            const senders = pc.getSenders();
            console.log(`Senders for ${userId}:`, senders.map(s => s.track?.kind));
        }

        if (isOfferor) {
            pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
                .then(offer => {
                    console.log(`Offer created for ${userId}, SDP:`, offer.sdp?.substring(0, 200));
                    return pc.setLocalDescription(offer);
                })
                .then(() => {
                    console.log(`Local description set for ${userId}, has m=audio:`, pc.localDescription?.sdp?.includes('m=audio'));
                    sendWebSocketMessage({ type: 'offer', to: userId, sdp: pc.localDescription });
                })
                .catch(e => console.error(`Offer creation failed for ${userId}:`, e));
        }
    }, [sendWebSocketMessage, participants]);

    const addRemoteVideo = (userId: string, stream: MediaStream, userName?: string) => {
        setParticipants(prev => {
            if (!prev.find(p => p.id === userId)) {
                return [...prev, { id: userId, name: userName || `User ${userId.substring(0, 8)}` }];
            }
            return prev;
        });

        setRemoteStreams(prev => ({
            ...prev,
            [userId]: stream
        }));

        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        console.log(`Remote stream added for user ${userId} (${userName || 'Unknown'}):`, {
            audioTracks: audioTracks.length,
            videoTracks: videoTracks.length,
            audioEnabled: audioTracks[0]?.enabled,
            videoEnabled: videoTracks[0]?.enabled
        });

        // 녹음 중이면 새로운 오디오를 믹싱에 추가
        if (isRecording && audioContextRef.current && audioTracks.length > 0) {
            try {
                const destination = audioContextRef.current.createMediaStreamDestination();
                const remoteSource = audioContextRef.current.createMediaStreamSource(
                    new MediaStream([audioTracks[0]])
                );
                remoteSource.connect(destination);
                console.log(`Added new remote audio from ${userId} to ongoing recording`);
            } catch (error) {
                console.error('Failed to add new audio to recording:', error);
            }
        }
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

            // 사용자 정보 가져오기
            const { getUserInfo } = await import('../api/user');
            const userInfo = await getUserInfo();
            console.log('User info for WebSocket:', { userId: userInfo.id, userName: userInfo.name });

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
            
            // WebSocket URL에 roomId, userId, userName 파라미터 추가
            const wsUrl = `${wsProtocol}://${wsHost}/api/ws/signal?roomId=${roomId}&userId=${userInfo.id}&userName=${encodeURIComponent(userInfo.name)}`;
            
            console.log('WebSocket URL:', wsUrl);
            
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setConnectionStatus(`Connected to room ${roomId}`);
                console.log('WebSocket connected successfully');
                
                // 입장 효과음 재생
                playJoinSound();
                
                // 녹음 자동 시작 (약간의 지연 후 - 스트림이 준비될 시간 확보)
                setTimeout(async () => {
                    try {
                        await startRecording();
                        console.log('Auto-recording started');
                    } catch (error) {
                        console.error('Failed to auto-start recording:', error);
                    }
                }, 2000);
                
                // Heartbeat: 30초마다 ping 메시지 전송
                heartbeatIntervalRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                        console.log('Sent ping to keep connection alive');
                    }
                }, 30000); // 30초
            };

            ws.onmessage = async (event) => {
                const message: WebRTCMessage = JSON.parse(event.data);
                const from = message.from;
                const data = message.data;

                console.log('WebSocket message received:', message.type, message);

                // to 필드가 있는 메시지는 해당 사용자만 처리
                // 단, 내 세션 ID를 아직 모르면 일단 처리 (첫 offer에서 세션 ID 추론)
                if (message.to && currentSessionIdRef.current && message.to !== currentSessionIdRef.current) {
                    console.log('Message not for me, ignoring');
                    return;
                }

                switch (message.type) {
                    case 'session_id':
                        // 서버에서 내 세션 ID를 알려줌
                        if (message.sessionId) {
                            currentSessionIdRef.current = message.sessionId;
                            console.log('My session ID from server:', currentSessionIdRef.current);
                        }
                        break;
                    case 'existing_users':
                        const existingUsers = message.users || [];
                        setConnectionStatus(`Found ${existingUsers.length} existing users. Connecting...`);
                        
                        // 내 세션 ID 저장 (data에 내 세션 ID가 포함되어 있을 수 있음)
                        if (message.data && typeof message.data === 'string' && !currentSessionIdRef.current) {
                            currentSessionIdRef.current = message.data;
                            console.log('My session ID:', currentSessionIdRef.current);
                        }
                        
                        for (const userInfo of existingUsers) {
                            const userId = userInfo.sessionId;
                            const userName = userInfo.userName;
                            createPeerConnection(userId, true);
                            // 사용자 정보를 미리 저장
                            setParticipants(prev => {
                                if (!prev.find(p => p.id === userId)) {
                                    return [...prev, { id: userId, name: userName }];
                                }
                                return prev;
                            });
                        }
                        break;
                    case 'new_user':
                        const newUserId = message.user?.sessionId || data;
                        const newUserName = message.user?.userName;
                        setConnectionStatus(`User ${newUserName || newUserId} joined. Preparing connection...`);
                        
                        // 다른 사람이 입장했을 때 효과음 재생
                        playJoinSound();
                        
                        createPeerConnection(newUserId, false);
                        // 사용자 정보를 미리 저장
                        if (newUserName) {
                            setParticipants(prev => {
                                if (!prev.find(p => p.id === newUserId)) {
                                    return [...prev, { id: newUserId, name: newUserName }];
                                }
                                return prev;
                            });
                        }
                        break;
                    case 'offer':
                        console.log(`Received offer from ${from}, SDP:`, message.sdp?.sdp?.substring(0, 200));
                        console.log(`Offer has m=audio:`, message.sdp?.sdp?.includes('m=audio'));
                        
                        // offer를 받았다는 것은 to가 내 세션 ID
                        if (message.to && !currentSessionIdRef.current) {
                            currentSessionIdRef.current = message.to;
                            console.log('My session ID from offer:', currentSessionIdRef.current);
                        }
                        
                        if (!peerConnectionsRef.current[from!]) {
                            createPeerConnection(from!, false);
                        }
                        
                        await peerConnectionsRef.current[from!].setRemoteDescription(new RTCSessionDescription(message.sdp!));
                        console.log(`Remote description set for ${from}`);
                        
                        const answer = await peerConnectionsRef.current[from!].createAnswer();
                        console.log(`Answer created for ${from}, has m=audio:`, answer.sdp?.includes('m=audio'));
                        
                        await peerConnectionsRef.current[from!].setLocalDescription(answer);
                        console.log(`Sending answer to ${from}`);
                        
                        sendWebSocketMessage({ type: 'answer', to: from, sdp: answer });
                        break;
                    case 'answer':
                        console.log(`Received answer from ${from}, SDP:`, message.sdp?.sdp?.substring(0, 200));
                        console.log(`Answer has m=audio:`, message.sdp?.sdp?.includes('m=audio'));
                        
                        await peerConnectionsRef.current[from!].setRemoteDescription(new RTCSessionDescription(message.sdp!));
                        console.log(`Remote description (answer) set for ${from}`);
                        break;
                    case 'candidate':
                        if (peerConnectionsRef.current[from!]) {
                            try {
                                await peerConnectionsRef.current[from!].addIceCandidate(new RTCIceCandidate(message.candidate!));
                                console.log(`ICE candidate added for ${from}`);
                            } catch (e) {
                                console.error(`Error adding ICE candidate for ${from}:`, e);
                            }
                        } else {
                            console.warn(`Received candidate for ${from} but no peer connection exists`);
                        }
                        break;
                    case 'user_left':
                        // data가 객체인 경우 sessionId 추출
                        const leftUserId = typeof data === 'object' && data !== null ? data.sessionId : data;
                        const leftUserName = typeof data === 'object' && data !== null ? data.userName : '';
                        setConnectionStatus(`User ${leftUserName || leftUserId} left.`);
                        
                        // 다른 사람이 퇴장했을 때 효과음 재생
                        playLeaveSound();
                        
                        closePeerConnection(leftUserId);
                        break;
                    case 'chat':
                    case 'chat_message':
                        // 채팅 메시지 수신 (서버가 브로드캐스트하므로 모든 메시지 표시)
                        if (message.message && message.user?.userName) {
                            setMessages(prev => [...prev, { 
                                name: message.user!.userName, 
                                text: message.message! 
                            }]);
                        }
                        break;
                    case 'error':
                        console.error(`Error from server: ${message.message}`);
                        alert(`화상통화 오류: ${message.message}`);
                        leaveRoom();
                        break;
                }
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                setConnectionStatus('Disconnected');
                console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
                
                // Heartbeat 정리
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }
                
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
        // 퇴장 효과음 재생
        playLeaveSound();
        
        // 녹음 중지 (자동으로 업로드됨)
        if (isRecording) {
            stopRecording();
            console.log('Auto-stopped recording on leave');
        }

        try {
            if (roomId) {
                await videoChatAPI.leaveRoom(roomId);
            }
        } catch (error) {
            console.error('Error leaving room via API:', error);
        }

        // Heartbeat 정리
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
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
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = screenStream;
            const screenTrack = screenStream.getVideoTracks()[0];

            // Replace video track in all peer connections (if any)
            for (const userId in peerConnectionsRef.current) {
                const pc = peerConnectionsRef.current[userId];
                const videoSender = pc.getSenders().find(sender => sender.track?.kind === 'video');
                if (videoSender) {
                    await videoSender.replaceTrack(screenTrack);
                }
            }

            // 로컬 비디오도 화면 공유로 변경
            if (videoRef.current) {
                videoRef.current.srcObject = screenStream;
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

        // 모든 피어 연결의 비디오 트랙을 카메라로 복원
        for (const userId in peerConnectionsRef.current) {
            const pc = peerConnectionsRef.current[userId];
            const videoSender = pc.getSenders().find(sender => sender.track?.kind === 'video');
            if (videoSender && cameraTrack) {
                await videoSender.replaceTrack(cameraTrack);
            }
        }

        // 로컬 비디오도 카메라로 복원
        if (videoRef.current && localStreamRef.current) {
            videoRef.current.srcObject = localStreamRef.current;
        }

        // 화면 공유 스트림 정리
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }

        setIsScreenSharing(false);
    };

    const startRecording = async () => {
        try {
            // AudioContext 생성
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Destination 생성 (모든 오디오를 믹싱할 곳)
            const destination = audioContext.createMediaStreamDestination();

            // 로컬 마이크 오디오 추가
            if (localStreamRef.current) {
                const localAudioTrack = localStreamRef.current.getAudioTracks()[0];
                if (localAudioTrack) {
                    const localSource = audioContext.createMediaStreamSource(
                        new MediaStream([localAudioTrack])
                    );
                    localSource.connect(destination);
                    console.log('Local audio added to recording');
                }
            }

            // 모든 원격 오디오 추가
            Object.entries(remoteStreams).forEach(([userId, stream]) => {
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    const remoteSource = audioContext.createMediaStreamSource(
                        new MediaStream([audioTracks[0]])
                    );
                    remoteSource.connect(destination);
                    console.log(`Remote audio from ${userId} added to recording`);
                }
            });

            // 믹싱된 스트림 저장
            mixedStreamRef.current = destination.stream;

            // MediaRecorder 생성
            const mediaRecorder = new MediaRecorder(destination.stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                console.log('Recording stopped, chunks:', recordedChunksRef.current.length);
                await uploadRecording();
            };

            mediaRecorder.start(1000); // 1초마다 데이터 수집
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);

            console.log('Recording started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log('Stopping recording...');
        }

        // AudioContext 정리
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        mixedStreamRef.current = null;
    };

    const uploadRecording = async () => {
        if (recordedChunksRef.current.length === 0) {
            console.warn('No recorded data to upload');
            return;
        }

        try {
            const webmBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
            
            console.log('Converting webm to wav...');
            
            // WebM을 WAV로 변환
            const audioContext = new AudioContext();
            const arrayBuffer = await webmBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // WAV 파일 생성
            const wavBlob = await audioBufferToWav(audioBuffer);
            
            const formData = new FormData();
            
            // 파일명에 roomId와 타임스탬프 포함
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `recording_${roomId}_${timestamp}.wav`;
            
            formData.append('file', wavBlob, filename);

            console.log('Uploading recording to AI server:', {
                size: wavBlob.size,
                filename,
                roomId
            });

            // AI 서버로 업로드
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Recording analyzed successfully:', result);

            // 업로드 후 청크 초기화
            recordedChunksRef.current = [];
        } catch (error) {
            console.error('Failed to upload recording:', error);
        }
    };

    // AudioBuffer를 WAV Blob으로 변환하는 헬퍼 함수
    const audioBufferToWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numberOfChannels * bytesPerSample;

        const data = [];
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            data.push(audioBuffer.getChannelData(i));
        }

        const interleaved = interleave(data);
        const dataLength = interleaved.length * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataLength);
        const view = new DataView(buffer);

        // WAV 헤더 작성
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true);

        // PCM 데이터 작성
        floatTo16BitPCM(view, 44, interleaved);

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const interleave = (channelData: Float32Array[]): Float32Array => {
        const length = channelData[0].length;
        const numberOfChannels = channelData.length;
        const result = new Float32Array(length * numberOfChannels);

        let inputIndex = 0;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                result[inputIndex++] = channelData[channel][i];
            }
        }
        return result;
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const floatTo16BitPCM = (view: DataView, offset: number, input: Float32Array) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
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

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        
        const messageText = message;
        setMessage(""); // 먼저 입력창 비우기
        
        try {
            // WebSocket으로 채팅 메시지 전송 (서버 스펙에 맞춰 message 필드 사용)
            sendWebSocketMessage({
                type: 'chat',
                message: messageText
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSendMessage();
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
        isRecording,
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
        startRecording,
        stopRecording,
    };
}