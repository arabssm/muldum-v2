import { useState, useEffect } from 'react';
import { getNetworkTeams, Team as ApiTeam } from '@/shared/api/team';
import { getClubs } from '@/shared/api';

type GroupType = "전공동아리" | "네트워크";

export const useTeams = (activeGroup: GroupType) => {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        let response: ApiTeam[] = [];

        if (activeGroup === "전공동아리") {
          const res = await getClubs();
          // API 응답: { teams: [...] }
          const teams = res.teams || [];
          response = teams.map((team: any) => ({
            id: team.teamId,
            name: team.teamName,
            members: team.members?.map((m: any) => 
              m.studentId ? `${m.studentId} ${m.userName}` : m.userName
            ) || [],
            class: team.class || undefined,
          }));
        } else if (activeGroup === "네트워크") {
          const res = await getNetworkTeams();
          response = Array.isArray(res) ? res : [];
        }

        setTeams(response);
      } catch (error) {
        console.error(`Failed to fetch ${activeGroup} teams:`, error);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [activeGroup]);

  return { teams, isLoading };
};