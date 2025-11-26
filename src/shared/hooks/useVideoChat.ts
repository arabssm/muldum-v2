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
    const audioRecordersRef = useRef<{ [userId: string]: { recorder: MediaRecorder; intervalId: NodeJS.Timeout } }>({});
    
    // 오디오 WebSocket 관련 refs
    const audioWsRef = useRef<WebSocket | null>(null);
    const audioSeqRef = useRef<number>(0);
    const audioMediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioHeaderRef = useRef<Uint8Array | null>(null); // WebM/Ogg 헤더 캐시

    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [separatedAudioData, setSeparatedAudioData] = useState<{[key: string]: {src: string, data: string}[]}>({});

    const pc_config: RTCConfiguration = { 
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { 
                urls: [
                    "turn:openrelay.metered.ca:80",
                    "turn:openrelay.metered.ca:443",
                    "turn:openrelay.metered.ca:443?transport=tcp"
                ],
                username: "openrelayproject",
                credential: "openrelayproject"
            },
            {
                urls: [
                    "turn:relay1.expressturn.com:3478",
                    "turns:relay1.expressturn.com:5349"
                ],
                username: "efSW8RR1XTQSTE6K33",
                credential: "Uc4ZYmfJMmfYHVzx"
            }
        ],
        iceCandidatePoolSize: 10,
        iceTransportPolicy: "all"
    };

    // 효과음 초기화
    useEffect(() => {
        try {
            console.log('Initializing sound effects...');
            joinSoundRef.current = new Audio(encodeURI('/assets/sound/sound.mp3'));
            leaveSoundRef.current = new Audio(encodeURI('/assets/sound/sound1.mp3'));
            
            // 볼륨 설정
            if (joinSoundRef.current) {
                joinSoundRef.current.volume = 0.5;
                console.log('Join sound initialized');
            }
            if (leaveSoundRef.current) {
                leaveSoundRef.current.volume = 0.5;
                console.log('Leave sound initialized');
            }
            
            // 오디오 로드 에러 핸들링
            if (joinSoundRef.current) {
                joinSoundRef.current.onerror = (e) => {
                    console.error('Failed to load join sound:', e);
                };
            }
            if (leaveSoundRef.current) {
                leaveSoundRef.current.onerror = (e) => {
                    console.error('Failed to load leave sound:', e);
                };
            }
        } catch (error) {
            console.error('Error initializing sound effects:', error);
        }
        
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
            console.log('Attempting to play join sound');
            joinSoundRef.current.currentTime = 0;
            joinSoundRef.current.play()
                .then(() => console.log('Join sound played successfully'))
                .catch(error => {
                    console.error('Failed to play join sound:', error);
                });
        } else {
            console.warn('Join sound ref is null');
        }
    };

    const playLeaveSound = () => {
        if (leaveSoundRef.current) {
            console.log('Attempting to play leave sound');
            leaveSoundRef.current.currentTime = 0;
            leaveSoundRef.current.play()
                .then(() => console.log('Leave sound played successfully'))
                .catch(error => {
                    console.error('Failed to play leave sound:', error);
                });
        } else {
            console.warn('Leave sound ref is null');
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
        
        // 백엔드 STT: 원격 오디오 캡처 시작
        if (audioTracks.length > 0 && userName && roomId) {
            startAudioCapture(userId, userName, stream, roomId);
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

            // 화상통화용 Spring API URL 사용
            const { getApiBaseUrl } = await import('../lib/envCheck');
            const apiBaseUrl = getApiBaseUrl();
            console.log('Using Spring API Base URL for video chat:', apiBaseUrl);
            
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
                
                // 백엔드 STT: 로컬 오디오 캡처 시작
                setTimeout(() => {
                    if (localStreamRef.current) {
                        startAudioCapture(userInfo.id.toString(), userInfo.name, localStreamRef.current, roomId);
                    }
                }, 1500);
                
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
                    case 'stt':
                        // STT 결과 수신 (다른 참가자의 음성 인식 결과)
                        const sttMessage = message as any;
                        if (sttMessage.userName && sttMessage.transcript) {
                            console.log('📥 Received STT:', sttMessage.userName, '-', sttMessage.transcript);
                            console.log(`🗣️ ${sttMessage.userName}: ${sttMessage.transcript}`);
                            // 필요시 UI에 표시하거나 회의록에 추가
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
        
        // 오디오 WebSocket 정리
        stopAudioWebSocket();

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
            console.log('🎤 Microphone:', audioTrack.enabled ? 'ON' : 'OFF');
            
            // 마이크 꺼지면 녹음도 중지
            if (!audioTrack.enabled) {
                Object.entries(audioRecordersRef.current).forEach(([userId, { recorder, intervalId }]) => {
                    if (recorder.state === 'recording') {
                        recorder.stop();
                        clearInterval(intervalId);
                        console.log('⏸️ Paused recording for', userId);
                    }
                });
            } else {
                // 마이크 켜지면 녹음 재개
                Object.entries(audioRecordersRef.current).forEach(([userId, { recorder, intervalId }]) => {
                    if (recorder.state === 'inactive') {
                        recorder.start();
                        console.log('▶️ Resumed recording for', userId);
                    }
                });
            }
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

    const startAudioWebSocket = async (roomId: string, userId: number, userName: string) => {
        try {
            const { getApiBaseUrl } = await import('../lib/envCheck');
            const apiBaseUrl = getApiBaseUrl();
            const wsProtocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
            const wsHost = apiBaseUrl.replace(/^https?:\/\//, '');
            
            const audioWsUrl = `${wsProtocol}://${wsHost}/api/ws/audio?roomId=${roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}`;
            console.log('Connecting to audio WebSocket (Spring):', audioWsUrl);
            console.log('roomId for audio recording:', roomId, ', userName:', userName);
            
            const audioWs = new WebSocket(audioWsUrl);
            audioWsRef.current = audioWs;
            audioSeqRef.current = 0;
            
            audioWs.onopen = () => {
                console.log('Audio WebSocket connected');
                // MediaRecorder 시작 (1초 청크) - roomId, userId, userName 전달
                startAudioRecording(roomId, userId, userName);
            };
            
            audioWs.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('Audio WebSocket message:', message.type);
                    
                    if (message.type === 'separated_audio') {
                        handleSeparatedAudio(message);
                    } else if (message.type === 'error') {
                        console.error('Audio WebSocket error:', message.message);
                        alert(`오디오 처리 오류: ${message.message}`);
                        stopAudioWebSocket();
                    }
                } catch (error) {
                    console.error('Failed to parse audio WebSocket message:', error);
                }
            };
            
            audioWs.onclose = () => {
                console.log('Audio WebSocket disconnected');
                stopAudioRecording();
            };
            
            audioWs.onerror = (error) => {
                console.error('Audio WebSocket error:', error);
                stopAudioRecording();
            };
        } catch (error) {
            console.error('Failed to start audio WebSocket:', error);
        }
    };
    
    const stopAudioWebSocket = () => {
        if (audioWsRef.current) {
            audioWsRef.current.close();
            audioWsRef.current = null;
        }
        stopAudioRecording();
        audioSeqRef.current = 0;
    };
    
    const startAudioRecording = (roomId: string, userId: number, userName: string) => {
        try {
            if (!localStreamRef.current) {
                console.warn('No local stream available for audio recording');
                return;
            }
            
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (!audioTrack) {
                console.warn('No audio track available');
                return;
            }
            
            // roomId 검증 (녹음 시작 전)
            if (!roomId) {
                console.error('roomId is empty! Cannot start audio recording.');
                return;
            }
            
            console.log('Starting audio recording with roomId:', roomId, ', userId:', userId, ', userName:', userName);
            
            // 오디오 트랙 상태 확인
            console.log('Audio track info:', {
                label: audioTrack.label,
                enabled: audioTrack.enabled,
                muted: audioTrack.muted,
                readyState: audioTrack.readyState
            });
            
            const audioStream = new MediaStream([audioTrack]);
            
            // 브라우저가 지원하는 mimeType 확인
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
                ? 'audio/ogg;codecs=opus'
                : '';
            
            console.log('Selected mimeType:', mimeType || 'browser default');
            
            const mediaRecorder = mimeType 
                ? new MediaRecorder(audioStream, { mimeType })
                : new MediaRecorder(audioStream);
            
            // 실제 사용되는 mimeType 확인
            console.log('MediaRecorder actual mimeType:', mediaRecorder.mimeType);
            
            audioMediaRecorderRef.current = mediaRecorder;
            
            mediaRecorder.ondataavailable = async (event) => {
                // Blob 타입 로깅
                console.log('Received audio chunk - Blob type:', event.data.type, ', size:', event.data.size);
                
                // 빈 청크 스킵
                if (event.data.size === 0) {
                    console.log('Skipping empty audio chunk');
                    return;
                }
                
                if (audioWsRef.current && audioWsRef.current.readyState === WebSocket.OPEN) {
                    try {
                        // Blob을 arrayBuffer로 읽기
                        const buf = await event.data.arrayBuffer();
                        let bytes = new Uint8Array(buf);
                        
                        // 헤더 감지 (WebM: 1A 45 DF A3, Ogg: 4F 67 67 53)
                        const isWebm = bytes.length >= 4 && 
                            bytes[0] === 0x1a && bytes[1] === 0x45 && 
                            bytes[2] === 0xdf && bytes[3] === 0xa3;
                        const isOgg = bytes.length >= 4 && 
                            bytes[0] === 0x4f && bytes[1] === 0x67 && 
                            bytes[2] === 0x67 && bytes[3] === 0x53;
                        
                        // 디버그: 앞 4바이트 확인
                        const headerBytes = [...bytes.slice(0, 4)].map(x => x.toString(16).toUpperCase().padStart(2, '0'));
                        console.log('Audio chunk header (first 4 bytes):', headerBytes, isWebm ? '(WebM)' : isOgg ? '(Ogg)' : '(No header)');
                        
                        // 첫 청크(헤더 포함)를 캐시
                        if (!audioHeaderRef.current && isWebm) {
                            audioHeaderRef.current = bytes;
                            console.log('✓ Cached WebM header for subsequent chunks');
                        }
                        
                        // 헤더 없는 후속 청크에 캐시된 헤더 붙이기
                        if (!isWebm && !isOgg && audioHeaderRef.current) {
                            const combined = new Uint8Array(audioHeaderRef.current.length + bytes.length);
                            combined.set(audioHeaderRef.current, 0);
                            combined.set(bytes, audioHeaderRef.current.length);
                            bytes = combined;
                            console.log('✓ Prepended cached header to chunk (new size:', bytes.byteLength, 'bytes)');
                        }
                        
                        // 1. JSON 메타 전송 (text frame)
                        const metadata = {
                            type: 'audio_chunk',
                            roomId: roomId,
                            userId: userId,
                            userName: userName,
                            seq: audioSeqRef.current++,
                            sampleRate: 48000,
                            channels: 1,
                            codec: 'opus',
                            startedAt: Date.now()
                        };
                        
                        audioWsRef.current.send(JSON.stringify(metadata));
                        console.log('✓ Sent audio metadata (seq:', metadata.seq, ', roomId:', metadata.roomId, ', userId:', metadata.userId, ', userName:', metadata.userName, ')');
                        
                        // 2. 바이너리 데이터 전송 (binary frame) - Uint8Array 그대로
                        audioWsRef.current.send(bytes);
                        console.log('✓ Sent audio binary chunk:', bytes.byteLength, 'bytes');
                    } catch (error) {
                        console.error('Failed to send audio chunk:', error);
                    }
                }
            };
            
            mediaRecorder.start(1000); // 1초 청크 (timeslice)
            console.log('✓ Audio recording started for AI processing');
            console.log('  - roomId:', roomId);
            console.log('  - userId:', userId);
            console.log('  - userName:', userName);
            console.log('  - Stream:', audioStream.id);
            console.log('  - Audio tracks:', audioStream.getAudioTracks().length);
        } catch (error) {
            console.error('Failed to start audio recording:', error);
        }
    };
    
    const stopAudioRecording = () => {
        if (audioMediaRecorderRef.current && audioMediaRecorderRef.current.state !== 'inactive') {
            audioMediaRecorderRef.current.stop();
            audioMediaRecorderRef.current = null;
            console.log('Audio recording stopped');
        }
        // 헤더 캐시 초기화
        audioHeaderRef.current = null;
    };
    
    const handleSeparatedAudio = (message: any) => {
        console.log('Received separated audio:', message);
        
        // Base64 데이터를 Blob으로 변환하여 재생/시각화
        const { fromUserId, seq, data, transcriptChunk } = message;
        
        if (data) {
            Object.entries(data).forEach(([src, base64Data]: [string, any]) => {
                try {
                    // Base64를 Blob으로 변환
                    const binaryString = atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    
                    console.log(`Separated audio ${src} from user ${fromUserId}, seq ${seq}:`, url);
                    
                    // 상태에 저장 (나중에 재생/시각화 가능)
                    setSeparatedAudioData(prev => ({
                        ...prev,
                        [fromUserId]: [...(prev[fromUserId] || []), { src, data: url }]
                    }));
                    
                    // 자동 재생 (선택사항)
                    // const audio = new Audio(url);
                    // audio.play();
                } catch (error) {
                    console.error(`Failed to process separated audio ${src}:`, error);
                }
            });
        }
        
        if (transcriptChunk) {
            console.log('Transcript chunk:', transcriptChunk);
            // STT 결과를 채팅 메시지로 표시
            setMessages(prev => [...prev, { 
                name: 'STT', 
                text: transcriptChunk 
            }]);
        }
    };
    
    const getSummary = async (language: string = 'ko', maxSentences: number = 5) => {
        try {
            if (!roomId) {
                throw new Error('Room ID is required');
            }
            
            // 1. 백엔드 STT에서 회의록 가져오기
            const { getRealAiBaseUrl } = await import('../lib/envCheck');
            const baseUrl = getRealAiBaseUrl();
            
            const transcriptResponse = await fetch(`${baseUrl}/stt/transcript/${roomId}`);
            
            if (!transcriptResponse.ok) {
                throw new Error(`Failed to get transcript: ${transcriptResponse.statusText}`);
            }
            
            const transcriptData = await transcriptResponse.json();
            const fullTranscript = transcriptData.fullTranscript;
            
            if (!fullTranscript || fullTranscript.trim().length === 0) {
                throw new Error('회의록이 비어있습니다');
            }
            
            console.log('📝 회의록 가져옴:', fullTranscript.substring(0, 200) + '...');
            
            // 2. 요약 요청
            const summaryResponse = await fetch(`${baseUrl}/summaries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    transcript: fullTranscript,
                    max_keywords: 10,
                    hf_min_length: 30,
                    hf_max_length: 60
                })
            });
            
            if (!summaryResponse.ok) {
                throw new Error(`Failed to get summary: ${summaryResponse.statusText}`);
            }
            
            const result = await summaryResponse.json();
            console.log('✅ 요약 완료:', result);
            
            return {
                keywords: result.keywords || [],
                huggingfaceSummary: result.huggingface_summary || null,
                chatgptSummary: result.chatgpt_summary || null,
                geminiSummary: result.gemini_summary || null
            };
        } catch (error) {
            console.error('요약 생성 실패:', error);
            throw error;
        }
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

            mediaRecorder.onstop = () => {
                console.log('Recording stopped, chunks:', recordedChunksRef.current.length);
                // 녹음 데이터는 오디오 WebSocket을 통해 실시간으로 전송됨
                recordedChunksRef.current = [];
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
    
    // 백엔드 STT: 오디오 캡처 및 전송
    const startAudioCapture = async (userId: string, userName: string, stream: MediaStream, currentRoomId: string) => {
        try {
            const audioTrack = stream.getAudioTracks()[0];
            if (!audioTrack) {
                console.error('❌ No audio track found');
                return;
            }
            
            console.log('🎤 Audio track:', {
                label: audioTrack.label,
                enabled: audioTrack.enabled,
                muted: audioTrack.muted,
                readyState: audioTrack.readyState,
                roomId: currentRoomId
            });
            
            const audioStream = new MediaStream([audioTrack]);
            const mediaRecorder = new MediaRecorder(audioStream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            let chunks: Blob[] = [];
            
            mediaRecorder.onstart = () => {
                console.log('✅ MediaRecorder started for', userName, 'in room', currentRoomId);
                chunks = [];
            };
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    console.log('📦 Chunk collected:', event.data.size, 'bytes');
                }
            };
            
            mediaRecorder.onstop = async () => {
                if (chunks.length === 0 || !currentRoomId) {
                    console.log('⚠️ No chunks or roomId, skipping');
                    return;
                }
                
                // 완전한 Blob 생성
                const completeBlob = new Blob(chunks, { type: 'audio/webm' });
                console.log('🎬 Complete audio:', completeBlob.size, 'bytes');
                
                // 크기 검증: 최소 10KB (약 1초 이상의 오디오)
                const MIN_AUDIO_SIZE = 10000; // 10KB
                if (completeBlob.size < MIN_AUDIO_SIZE) {
                    console.log(`⚠️ Audio too small (${completeBlob.size} bytes < ${MIN_AUDIO_SIZE} bytes), skipping`);
                    chunks = [];
                    return;
                }
                
                // 예상 오디오 길이 계산 (대략적)
                // WebM Opus: ~16KB/sec (비트레이트에 따라 다름)
                const estimatedDuration = completeBlob.size / 16000; // 초 단위
                if (estimatedDuration < 1.0) {
                    console.log(`⚠️ Audio too short (${estimatedDuration.toFixed(2)}s < 1.0s), skipping`);
                    chunks = [];
                    return;
                }
                
                console.log(`✅ Audio validation passed: ${completeBlob.size} bytes (~${estimatedDuration.toFixed(2)}s)`);
                
                const { getRealAiBaseUrl } = await import('../lib/envCheck');
                const baseUrl = getRealAiBaseUrl();
                
                const formData = new FormData();
                formData.append('audio', completeBlob, 'audio.webm');
                formData.append('userId', userId);
                formData.append('userName', userName);
                formData.append('roomId', currentRoomId);
                
                console.log(`📤 STT 전송 중:`, {
                    url: `${baseUrl}/stt/stream`,
                    userId,
                    userName,
                    roomId: currentRoomId,
                    audioSize: completeBlob.size,
                    estimatedDuration: `${estimatedDuration.toFixed(2)}s`
                });
                
                try {
                    const res = await fetch(`${baseUrl}/stt/stream`, {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    console.log('✅ STT 응답:', data);
                    if (data.transcript) {
                        console.log(`🗣️ ${userName}: ${data.transcript}`);
                    }
                } catch (err) {
                    console.error('❌ STT 전송 실패:', err);
                }
                
                chunks = [];
            };
            
            // 30초마다 stop → start 반복
            const recordingInterval = setInterval(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    setTimeout(() => {
                        if (mediaRecorder.state === 'inactive') {
                            chunks = [];
                            mediaRecorder.start();
                        }
                    }, 100);
                }
            }, 30000); // 30초
            
            // ref에 저장하여 나중에 제어 가능하도록
            audioRecordersRef.current[userId] = {
                recorder: mediaRecorder,
                intervalId: recordingInterval
            };
            
            mediaRecorder.start();
            console.log(`🎙️ ${userName} 오디오 캡처 시작`);
        } catch (error) {
            console.error('오디오 캡처 실패:', error);
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
        separatedAudioData,
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
        getSummary,
    };
}