export interface Participant {
    id: string;
    name: string;
}

export interface WebRTCMessage {
    type: 'existing_users' | 'new_user' | 'offer' | 'answer' | 'candidate' | 'user_left' | 'error' | 'chat' | 'chat_message' | 'session_id' | 'stt';
    from?: string;
    to?: string;
    data?: any;
    sessionId?: string;
    users?: Array<{
        sessionId: string;
        userId: number;
        userName: string;
    }>;
    user?: {
        sessionId: string;
        userId: number;
        userName: string;
    };
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
    message?: string; // 채팅 메시지 내용 또는 에러 메시지
    userName?: string; // STT 결과의 사용자 이름
    transcript?: string; // STT 결과의 텍스트
}