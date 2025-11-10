const API_BASE_URL = 'http://localhost:8001';
const MOCK_USER_ID = '1';
const MOCK_USER_ROLE = 'mentor';

export interface Room {
    roomId: string;
    title: string;
    teamId: number;
    maxParticipants: number;
    currentParticipants: number;
    createdAt: string;
}

export interface CreateRoomRequest {
    title: string;
    teamId: number;
    maxParticipants?: number;
}

export interface TranscriptionSegment {
    speaker: string;
    text: string;
}

export interface SummarizeRequest {
    text?: string;
    segments?: TranscriptionSegment[];
}

export interface TranscribeResponse {
    provider: string;
    segments: TranscriptionSegment[];
    summary: string;
}

export type STTProvider = 'google' | 'aws' | 'azure' | 'whisper';

export const videoChatAPI = {
    async createRoom(data: CreateRoomRequest): Promise<Room> {
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': MOCK_USER_ID,
                'X-User-Role': MOCK_USER_ROLE
            },
            body: JSON.stringify({
                ...data,
                maxParticipants: data.maxParticipants || 20
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create room: ${response.statusText}`);
        }

        return response.json();
    },

    async listRooms(): Promise<Room[]> {
        const response = await fetch(`${API_BASE_URL}/sup/rooms/all`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Failed to list rooms: ${response.statusText}`);
        }

        return response.json();
    },

    async leaveRoom(roomId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/leave`, {
            method: 'POST',
            headers: {
                'X-User-Id': MOCK_USER_ID
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to leave room: ${response.statusText}`);
        }
    },

    async deleteRoom(roomId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete room: ${response.statusText}`);
        }
    },

    async deleteAllRooms(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/sup/rooms/all`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete all rooms: ${response.statusText}`);
        }
    },

    // 1) POST /summarize - 텍스트 또는 화자별 세그먼트 요약
    async summarize(data: SummarizeRequest): Promise<any> {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to summarize: ${response.statusText}`);
        }

        return response.json();
    },

    // 2) POST /transcribe-and-summarize - 오디오 파일 업로드 및 STT + 요약
    async transcribeAndSummarize(
        audioBlob: Blob,
        provider: STTProvider,
        onProgress?: (progress: number) => void
    ): Promise<TranscribeResponse> {
        const formData = new FormData();
        formData.append('provider', provider);
        formData.append('audio', audioBlob, 'recording.webm');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // 업로드 진행 상태 추적
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', '/api/transcribe');
            xhr.send(formData);
        });
    }
};