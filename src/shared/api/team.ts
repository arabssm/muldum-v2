import axiosInstance from "@/shared/lib/axiosInstance";

export interface TeamMember {
  userId: number;
  userName: string;
  studentId?: string;
}

export interface NetworkTeamResponse {
  teamId: number;
  teamName: string;
  class: string | null;
  members?: TeamMember[];
}

export interface Team {
  id: number;
  name: string;
  members: string[];
  class?: string;
  newCount?: number;
}

export interface TeamWithItemCount {
  teamId: number;
  teamName: string;
  members?: TeamMember[];
  newCount: number;
}

export const getNetworkTeams = async (): Promise<Team[]> => {
  const { data } = await axiosInstance.get('/ara/teamspace/network');
  
  // API 응답 형태: { teams: [...] }
  const teams = data.teams || [];
  
  // 기존 형식으로 변환
  return teams.map((team: NetworkTeamResponse) => ({
    id: team.teamId,
    name: team.teamName,
    members: team.members?.map(m => 
      m.studentId ? `${m.studentId} ${m.userName}` : m.userName
    ) || [],
    class: team.class || undefined,
  }));
};

// 교사용: 팀별 새 물품 수 포함
export const getNetworkTeamsWithItemCount = async (): Promise<Team[]> => {
  const { data } = await axiosInstance.get('/tch/teamspace/network/item');
  
  // 배열로 직접 반환됨
  const teams = Array.isArray(data) ? data : [];
  
  return teams.map((team: TeamWithItemCount) => ({
    id: team.teamId,
    name: team.teamName,
    members: team.members?.map(m => m.userName) || [],
    newCount: team.newCount || 0,
  }));
};
