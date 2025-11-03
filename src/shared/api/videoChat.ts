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
    }
};