import { useState, useEffect } from 'react';
import { getNetworkTeams, getNetworkTeamsWithItemCount, getMajorTeamsWithItemCount, Team as ApiTeam } from '@/shared/api/team';
import { getClubs } from '@/shared/api';
import { getUserInfo } from '@/shared/api/user';

type GroupType = "전공동아리" | "네트워크";

export const useTeams = (activeGroup: GroupType) => {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        let response: ApiTeam[] = [];

        // 사용자 role 확인 (에러 시 학생으로 간주)
        let isTeacher = false;
        try {
          const userInfo = await getUserInfo();
          isTeacher = userInfo.user_type === 'TEACHER';
        } catch (error) {
          isTeacher = false;
        }

        if (activeGroup === "전공동아리") {
          if (isTeacher) {
            // 교사용 API: 새 물품 수 포함
            response = await getMajorTeamsWithItemCount();
          } else {
            // 학생용 API
            const res = await getClubs();
            const teams = res.teams || [];
            response = teams.map((team: any) => ({
              id: team.teamId,
              name: team.teamName,
              members: team.members?.map((m: any) => 
                m.studentId ? `${m.studentId} ${m.userName}` : m.userName
              ) || [],
              class: team.class || undefined,
            }));
          }
        } else if (activeGroup === "네트워크") {
          if (isTeacher) {
            // 교사용 API: 새 물품 수 포함
            response = await getNetworkTeamsWithItemCount();
          } else {
            // 학생용 API
            response = await getNetworkTeams();
          }
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