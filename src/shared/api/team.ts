import axiosInstance from "@/shared/lib/axiosInstance";

export interface TeamMember {
  userId: number;
  userName: string;
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
}

export const getNetworkTeams = async (): Promise<Team[]> => {
  const { data } = await axiosInstance.get('/ara/teamspace/network');
  
  // API 응답 형태: { teams: [...] }
  const teams = data.teams || [];
  
  // 기존 형식으로 변환
  return teams.map((team: NetworkTeamResponse) => ({
    id: team.teamId,
    name: team.teamName,
    members: team.members?.map(m => m.userName) || [],
    class: team.class || undefined,
  }));
};
