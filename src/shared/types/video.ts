export interface Participant {
    id: string;
    name: string;
}

export interface WebRTCMessage {
    type: 'existing_users' | 'new_user' | 'offer' | 'answer' | 'candidate' | 'user_left' | 'error';
    from?: string;
    to?: string;
    data?: any;
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
    message?: string;
}