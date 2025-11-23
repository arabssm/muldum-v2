import axiosInstance from "@/shared/lib/axiosInstance";

export interface HistoryClub {
  id: number;
  name: string;
  generation: number;
  logoUrl: string | null;
  description: string;
  slogan: null;
  detail: null;
}

export const getCurrentGeneration = async (): Promise<number | null> => {
  const { data } = await axiosInstance.get('/ara/history/current-generation');
  return data;
};

export const getHistoryClubs = async (generation?: number): Promise<HistoryClub[]> => {
  const params = generation ? { generation } : {};
  const { data } = await axiosInstance.get('/ara/history', { params });
  return data;
};
