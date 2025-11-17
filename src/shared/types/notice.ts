export type FilePayload = {
  name: string;
  url: string;
};

export interface Notice {
  id: number;
  notice: string;
  date: string;
  teacher: string;
  path: string;
  type: string;
  badge: string;
}