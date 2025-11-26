import axiosInstance from '@/shared/lib/axiosInstance';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskCategory = 'FRONTEND' | 'BACKEND' | 'DESIGN' | 'AI';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  assignee: {
    id: number;
    name: string;
  } | null;
  title: string;
  status: TaskStatus;
  category: TaskCategory;
  deadline: string;
  createdAt: string;
}

export interface CreateTaskRequest {
  assigneeId: number | null;
  title: string;
  category: TaskCategory;
  deadline: string;
}

export interface UpdateTaskRequest {
  assigneeId: number | null;
  title: string;
  status: TaskStatus;
  category: TaskCategory;
  deadline: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

// 팀원 목록 조회
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await axiosInstance.get('/tasks/members');
  return response.data;
};

// 팀 작업 목록 조회
export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

// 작업 생성
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', data);
  return response.data;
};

// 작업 수정
export const updateTask = async (taskId: number, data: UpdateTaskRequest): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${taskId}`, data);
  return response.data;
};

// 작업 상태 변경
export const updateTaskStatus = async (taskId: number, data: UpdateTaskStatusRequest): Promise<void> => {
  await axiosInstance.patch(`/tasks/${taskId}/status`, data);
};

// 작업 삭제
export const deleteTask = async (taskId: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`);
};

// 대시보드 데이터 타입
export interface DashboardStats {
  overallStats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    unassigned: number;
  };
  memberStats: Array<{
    memberId: number;
    memberName: string;
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  }>;
  categoryStats: {
    frontend: number;
    backend: number;
    design: number;
    ai: number;
  };
  overdueTasks: Array<{
    taskId: number;
    title: string;
    deadline: string;
    assignee: {
      id: number;
      name: string;
    } | null;
  }>;
  upcomingDeadlineTasks: Array<{
    taskId: number;
    title: string;
    deadline: string;
    assignee: {
      id: number;
      name: string;
    } | null;
  }>;
  monthlyCompletions: Array<{
    month: number;
    success: number;
  }>;
}

// 대시보드 조회
export const getDashboard = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get('/tasks/dashboard');
  return response.data;
};
