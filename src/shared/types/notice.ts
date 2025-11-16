export type FilePayload = {
  name: string;
  url: string;
};

export interface Notice {
  notice: string;
  type: string;
  badge: string;
  date: string;
  path: string;
}