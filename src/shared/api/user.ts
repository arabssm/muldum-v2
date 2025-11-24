import axiosInstance from '../lib/axiosInstance';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  profile: string;
  user_type: string;
  teamId?: number;
}

interface ParsedProfile {
  class?: number;
  grade?: number;
  number?: number;
  team_id?: number;
}

const parseProfile = (profileStr: string): ParsedProfile => {
  try {
    // "{class=3, grade=2, number=12, team_id=49}" 형태를 파싱
    const obj: ParsedProfile = {};
    const cleaned = profileStr.replace(/[{}]/g, '');
    const pairs = cleaned.split(',').map(p => p.trim());
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=').map(s => s.trim());
      if (key && value) {
        obj[key as keyof ParsedProfile] = parseInt(value, 10);
      }
    });
    
    return obj;
  } catch (error) {
    console.error('Failed to parse profile:', error);
    return {};
  }
};

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const { data } = await axiosInstance.get('/user/me');
    
    if (!data) {
      throw new Error('사용자 정보를 받아올 수 없습니다');
    }
    
    // profile 문자열에서 team_id 추출
    const parsedProfile = parseProfile(data.profile || '');
    
    return {
      id: data.id || 0,
      name: data.name || '사용자',
      email: data.email || '',
      profile: data.profile || '',
      user_type: data.user_type || 'STUDENT',
      teamId: parsedProfile.team_id,
    };
  } catch (error: any) {
    console.error('getUserInfo 에러:', error);
    
    // 네트워크 에러나 인증 에러 시 더 명확한 에러 메시지
    if (!error.response) {
      throw new Error('서버에 연결할 수 없습니다');
    }
    
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다');
    }
    
    throw error;
  }
};
