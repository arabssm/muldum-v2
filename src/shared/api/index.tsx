import axiosInstance from "@/shared/lib/axiosInstance";

// 공지 부분
export const getNoticeDetail = async (notice_id: string) => {
  try {
    if (!notice_id) {
      throw new Error('공지 ID가 필요합니다');
    }
    const res = await axiosInstance.get(`/ara/notice/${notice_id}`);
    return res.data;
  } catch (error: any) {
    console.error('공지 상세 조회 실패:', error);
    throw error;
  }
};

export const deleteNotice = async (notice_id: string) => {
  try {
    if (!notice_id) {
      throw new Error('공지 ID가 필요합니다');
    }
    const res = await axiosInstance.delete(`/tch/notice/${notice_id}`);
    return res.data;
  } catch (error: any) {
    console.error('공지 삭제 실패:', error);
    throw error;
  }
};

// 팀스페이스 부분
export const getClubs = async () => {
  try {
    const res = await axiosInstance.get(`/ara/teamspace/major`);
    return res.data;
  } catch (error: any) {
    console.error('클럽 목록 조회 실패:', error);
    throw error;
  }
};

// 팀 페이지 조회 (새 API)
export const getTeamPage = async (team_id: string) => {
  try {
    if (!team_id) {
      throw new Error('팀 ID가 필요합니다');
    }
    const res = await axiosInstance.get(`/ara/teamspace/network/team/${team_id}`);
    return res.data;
  } catch (error: any) {
    console.error('팀 페이지 조회 실패:', error);
    throw error;
  }
};

// 레거시 팀 페이지 조회 (호환성 유지)
export const getNotion = async (team_id: string) => {
  try {
    if (!team_id) {
      throw new Error('팀 ID가 필요합니다');
    }
    const res = await axiosInstance.get(`/std/teamspace/${team_id}`);
    return res.data;
  } catch (error: any) {
    console.error('노션 조회 실패:', error);
    throw error;
  }
};

// 팀 페이지 수정 (이름, 소개)
export const updateTeamPage = async (teamId: number, data: { name?: string | null; content: string }) => {
  try {
    if (!teamId) {
      throw new Error('팀 ID가 필요합니다');
    }
    const res = await axiosInstance.patch(`/std/teamspace/network/team/${teamId}`, data);
    return res.data;
  } catch (error: any) {
    console.error('팀 페이지 수정 실패:', error);
    throw error;
  }
};

// 팀 배너 이미지 수정
export const updateTeamBanner = async (teamId: number, url: string) => {
  try {
    if (!teamId || !url) {
      throw new Error('팀 ID와 URL이 필요합니다');
    }
    const res = await axiosInstance.patch(`/std/teamspace/network/team/${teamId}/banner`, { url });
    return res.data;
  } catch (error: any) {
    console.error('팀 배너 수정 실패:', error);
    throw error;
  }
};

// 팀 아이콘 수정
export const updateTeamIcon = async (teamId: number, url: string) => {
  try {
    if (!teamId || !url) {
      throw new Error('팀 ID와 URL이 필요합니다');
    }
    const res = await axiosInstance.patch(`/std/teamspace/team/${teamId}/icon`, { url });
    return res.data;
  } catch (error: any) {
    console.error('팀 아이콘 수정 실패:', error);
    throw error;
  }
};

// 레거시 API (호환성 유지)
export const editNotion = async (team_id: string, data: { name: string; content: string }) => {
  try {
    if (!team_id) {
      throw new Error('팀 ID가 필요합니다');
    }
    const res = await axiosInstance.patch(`/std/teamspace?type=${team_id}`, data);
    return res.data;
  } catch (error: any) {
    console.error('노션 수정 실패:', error);
    throw error;
  }
};

// 월말평가 학생 목록 조회 부분
export const getUserMonth = async (report_id: string) => {
  try {
    if (!report_id) {
      throw new Error('리포트 ID가 필요합니다');
    }
    const res = await axiosInstance.get(`/std/month_report/${report_id}`);
    return res.data;
  } catch (error: any) {
    console.error('월말평가 조회 실패:', error);
    throw error;
  }
};

// 월말평가 선생님 목록 조회 부분
export const getAdminMonth = async () => {
  try {
    const res = await axiosInstance.get(`/tch/month_report}`);
    return res.data;
  } catch (error: any) {
    console.error('월말평가 목록 조회 실패:', error);
    throw error;
  }
};

export const getAdminMonthContent = async (report_id: string) => {
  try {
    if (!report_id) {
      throw new Error('리포트 ID가 필요합니다');
    }
    const res = await axiosInstance.get(`/tch/month_report/${report_id}`);
    return res.data;
  } catch (error: any) {
    console.error('월말평가 내용 조회 실패:', error);
    throw error;
  }
};