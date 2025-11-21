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
  const { data } = await axiosInstance.get('/user/me');
  
  // profile 문자열에서 team_id 추출
  const parsedProfile = parseProfile(data.profile || '');
  
  return {
    ...data,
    teamId: parsedProfile.team_id,
  };
};
