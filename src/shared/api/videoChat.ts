import axiosInstance from '../lib/axiosInstance';

export interface Room {
    roomId: string;
    title: string;
    teamId: number;
    createdBy: string;
    createdAt: string;
    participants?: number;
    maxParticipants: number;
    status?: string;
}

export interface RoomDetail {
    roomId: string;
    title: string;
    teamId: number;
    createdBy: string;
    createdAt: string;
    participants: {
        amount: number;
        list: Array<{
            userId: number;
            role: string;
        }>;
    };
    maxParticipants: number;
    status: string;
}

export interface CreateRoomRequest {
    title: string;
    teamId: number;
    maxParticipants: number;
}

export interface LeaveRoomResponse {
    message: string;
    status: {
        userId: number;
        roomId: string;
        executedAt: string;
    };
}

export const videoChatAPI = {
    async createRoom(data: CreateRoomRequest): Promise<Room> {
        const { data: responseData } = await axiosInstance.post<Room>('/ara/rooms', {
            title: data.title,
            teamId: data.teamId,
            maxParticipants: data.maxParticipants || 20
        });

        return responseData;
    },

    async listRooms(): Promise<Room[]> {
        const { data } = await axiosInstance.get<Room[]>('/ara/rooms');
        return data;
    },

    async getRoomDetail(roomId: string): Promise<RoomDetail> {
        const { data } = await axiosInstance.get<RoomDetail>(`/ara/rooms/${roomId}`);
        return data;
    },

    async leaveRoom(roomId: string): Promise<LeaveRoomResponse> {
        const { data } = await axiosInstance.post<LeaveRoomResponse>(`/ara/rooms/${roomId}/leave`);
        return data;
    },

    async deleteRoom(roomId: string): Promise<void> {
        await axiosInstance.delete(`/ara/rooms/${roomId}`);
    },

    async listAllRooms(): Promise<Room[]> {
        const { data } = await axiosInstance.get<Room[]>('/ara/sup/rooms/all');
        return data;
    },

    async deleteAllRooms(): Promise<void> {
        await axiosInstance.delete('/ara/sup/rooms/all');
    },

    async findOrCreateTeamRoom(teamId: number): Promise<Room> {
        // 먼저 해당 팀의 방이 있는지 확인
        const rooms = await this.listRooms();
        const existingRoom = rooms.find(room => room.teamId === teamId);

        if (existingRoom) {
            return existingRoom;
        }

        // 없으면 새로 생성
        return await this.createRoom({
            title: `Team ${teamId} Room`,
            teamId,
            maxParticipants: 20
        });
    }
};
