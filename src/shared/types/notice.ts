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

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  files?: { url: string }[];
  teacher?: string;
  deadlineDate?: string;
  updatedAt?: string;
}