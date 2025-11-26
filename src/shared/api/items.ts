import axiosInstance from "@/shared/lib/axiosInstance";
import axios from "axios";

export interface ItemRequest {
  product_name: string;
  quantity: number;
  price: string;
  productLink: string;
  reason: string;
  deliveryPrice: string;
  deliveryTime: string;
}

export interface ItemPreview {
  name: string;
  price: string;
  regularPrice: string;
}

export const getItemPreview = async (url: string): Promise<ItemPreview> => {
  const res = await axiosInstance.post("/std/items/preview", { productLink: url });
  return res.data;
};

export const createItemRequest = async (data: ItemRequest, isTemp: boolean = true) => {
  const endpoint = isTemp ? '/std/items/temp' : '/std/items';
  const res = await axiosInstance.post(endpoint, data);
  return res.data;
};

export const getItemList = async (isTemp: boolean = false) => {
  const endpoint = isTemp ? '/std/items/temp' : '/std/items';
  const res = await axiosInstance.get(endpoint);
  return res.data;
};

export const submitFinalItems = async (itemIds?: number[]) => {
  const body = itemIds ? { item_ids: itemIds } : {};
  const res = await axiosInstance.patch('/std/items', body);
  return res.data;
};

export const deleteItem = async (itemId: number) => {
  const res = await axiosInstance.delete(`/std/items/${itemId}`);
  return res.data;
};

export const deleteTempItem = async (itemId: number) => {
  const res = await axiosInstance.delete(`/std/items/temp/${itemId}`);
  return res.data;
};

export const deleteTempItems = async (itemIds: number[]) => {
  const res = await axiosInstance.delete('/std/items/temp', {
    data: { item_ids: itemIds }
  });
  return res.data;
};

export const reapplyRejectedItem = async (itemId: number) => {
  const res = await axiosInstance.post(`/std/items/${itemId}/reapply`);
  return res.data;
};

export const updateItem = async (itemId: number, data: Partial<ItemRequest>) => {
  const res = await axiosInstance.patch(`/std/items/${itemId}`, data);
  return res.data;
};

export const getCrawlRecommendations = async (query: string, limit: number = 3) => {
  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || 'http://localhost:8000';
  const url = `${baseUrl}/recommend/11st?name=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data;
};

// 선생님용 API
export interface TeacherItem {
  team_id: number;
  team_name?: string; // 팀 이름
  type: string;
  item_id: number;
  product_name: string;
  quantity: number;
  price: string;
  productLink: string;
  reason: string;
  status: string;
  deliveryNumber: string | null;
  deliveryPrice: string;
  deliveryTime: string;
  rejectReason: string | null;
  updated_at: string; // ISO 8601 형식 (2025-11-24T15:30:00)
  approved_at?: string; // ISO 8601 형식 (2025-12-09T15:07:20)
  rejected_at?: string; // ISO 8601 형식 (2025-12-09T15:07:20)
}

export interface TeacherItemsResponse {
  items: TeacherItem[];
  newCount: number;
}

export const getApprovedItems = async (date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get('/tch/items/approved', { params });
  // 응답이 배열이면 래핑
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getRejectedItems = async (date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get('/tch/items/rejected', { params });
  // 응답이 배열이면 래핑
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getNotApprovedItems = async (): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get('/tch/items');
  // 응답이 배열이면 래핑
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const approveItems = async (itemIds: number[]) => {
  const res = await axiosInstance.patch('/tch/items/submit', itemIds.map(id => ({ item_id: id })));
  return res.data;
};

export const rejectItems = async (items: { item_id: number; reason: string }[]) => {
  const res = await axiosInstance.patch('/tch/items/reject', items);
  return res.data;
};

export const downloadExcel = async (date?: string) => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get('/tch/items/xlsx', { 
    params,
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `items_${date || 'all'}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// 특정 날짜에 승인된 물품 조회
export const getApprovedItemsOnDate = async (date: string, teamName?: string): Promise<TeacherItem[]> => {
  const params: { date: string; teamName?: string } = { date };
  if (teamName) params.teamName = teamName;
  
  const res = await axiosInstance.get('/tch/items/approved-on', { params });
  return res.data;
};

// 특정 날짜에 거절된 물품 조회
export const getRejectedItemsOnDate = async (date: string, teamName?: string): Promise<TeacherItem[]> => {
  const params: { date: string; teamName?: string } = { date };
  if (teamName) params.teamName = teamName;
  
  const res = await axiosInstance.get('/tch/items/rejected-on', { params });
  return res.data;
};

// 승인된 날짜 목록 조회
export const getApprovedDates = async (start?: string, end?: string): Promise<string[]> => {
  const params: { start?: string; end?: string } = {};
  if (start) params.start = start;
  if (end) params.end = end;
  
  const res = await axiosInstance.get('/tch/items/approved-dates', { params });
  return res.data;
};

// 거절된 날짜 목록 조회
export const getRejectedDates = async (start?: string, end?: string): Promise<string[]> => {
  const params: { start?: string; end?: string } = {};
  if (start) params.start = start;
  if (end) params.end = end;
  
  const res = await axiosInstance.get('/tch/items/rejected-dates', { params });
  return res.data;
};

// 전공동아리 물품 조회 API
export const getMajorItems = async (): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get('/tch/items/major');
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorNotApprovedItems = async (): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get('/tch/items/major/not-approved');
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorApprovedItems = async (date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get('/tch/items/major/approved', { params });
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorRejectedItems = async (date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get('/tch/items/major/rejected', { params });
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

// 특정 전공동아리 팀 물품 조회
export const getMajorTeamItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/major/${teamId}`);
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorTeamNotApprovedItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/major/${teamId}/not-approved`);
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorTeamApprovedItems = async (teamId: number, date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get(`/tch/items/major/${teamId}/approved`, { params });
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

export const getMajorTeamRejectedItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/major/${teamId}/rejected`);
  if (Array.isArray(res.data)) {
    return { items: res.data, newCount: 0 };
  }
  return res.data;
};

// 거절 사유 템플릿 API
export interface RejectTemplate {
  id: number;
  content: string;
  createdAt: string;
}

export const getRejectTemplates = async (): Promise<RejectTemplate[]> => {
  const res = await axiosInstance.get('/tch/items/reject-templates');
  return res.data;
};

export const addRejectTemplates = async (templates: string[]): Promise<RejectTemplate[]> => {
  const res = await axiosInstance.post('/tch/items/reject-templates', { templates });
  return res.data;
};

export const deleteRejectTemplate = async (templateId: number) => {
  await axiosInstance.delete(`/tch/items/reject-templates/${templateId}`);
};

// 팀별 물품 조회 API (배열만 반환)
export const getTeamItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/${teamId}`);
  // 배열로 반환되므로 래퍼로 감싸기
  return {
    items: Array.isArray(res.data) ? res.data : [],
    newCount: 0
  };
};

export const getTeamApprovedItems = async (teamId: number, date?: string): Promise<TeacherItemsResponse> => {
  const params = date ? { date } : {};
  const res = await axiosInstance.get(`/tch/items/${teamId}/approved`, { params });
  return {
    items: Array.isArray(res.data) ? res.data : [],
    newCount: 0
  };
};

export const getTeamNotApprovedItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/${teamId}/not-approved`);
  return {
    items: Array.isArray(res.data) ? res.data : [],
    newCount: 0
  };
};

export const getTeamRejectedItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/${teamId}/rejected`);
  return {
    items: Array.isArray(res.data) ? res.data : [],
    newCount: 0
  };
};

// 배송 정책 API
export interface ShippingPolicy {
  id: number;
  atLeastShippingMoney: number;
  youCantApplyForIgenship: boolean;
  updatedAt: string;
}

export const createOrUpdateShippingPolicy = async (data: {
  atLeastShippingMoney: number;
  youCantApplyForIgenship: boolean;
}): Promise<ShippingPolicy> => {
  const res = await axiosInstance.post('/tch/items/shipping-policy', data);
  return res.data;
};

export const getShippingPolicy = async (): Promise<ShippingPolicy | null> => {
  try {
    const res = await axiosInstance.get('/ara/items/shipping-policy');
    if (res.status === 204) {
      return null;
    }
    return res.data;
  } catch (error) {
    return null;
  }
};

// 물품 신청 안내 API
export interface ItemGuide {
  id: number;
  content: string;
  projectType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemGuideRequest {
  content: string;
  projectType: string;
}

export interface ItemGuideResponse {
  id: number;
  message: string;
}

export const createItemGuide = async (data: ItemGuideRequest): Promise<ItemGuideResponse> => {
  const res = await axiosInstance.post('/tch/items/guide', data);
  return res.data;
};

export const updateItemGuide = async (guideId: number, data: ItemGuideRequest): Promise<ItemGuideResponse> => {
  const res = await axiosInstance.patch(`/tch/items/guide/${guideId}`, data);
  return res.data;
};

export const getItemGuide = async (guideId: number, projectType: string): Promise<ItemGuide> => {
  const res = await axiosInstance.get(`/ara/items/guide/${guideId}`, {
    params: { type: projectType }
  });
  return res.data;
};

// 최신 가이드 조회 (guideId를 1로 고정하여 사용)
export const getLatestItemGuide = async (projectType: string): Promise<ItemGuide | null> => {
  try {
    return await getItemGuide(1, projectType);
  } catch (error) {
    console.error("Failed to fetch latest guide:", error);
    return null;
  }
};

// 사용한 예산 조회 API
export interface UsedBudgetResponse {
  usedBudget: number;
}

export const getUsedBudget = async (): Promise<UsedBudgetResponse> => {
  const res = await axiosInstance.get('/std/items/money');
  return res.data;
};
