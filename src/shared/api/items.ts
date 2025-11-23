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
  console.log('API 요청 전송:', data);
  const endpoint = isTemp ? '/std/items/temp' : '/std/items';
  const res = await axiosInstance.post(endpoint, data);
  console.log('API 응답:', res.data);
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
}

export interface TeacherItemsResponse {
  items: TeacherItem[];
  newCount: number;
}

export const getApprovedItems = async (nth?: number): Promise<TeacherItemsResponse> => {
  const params = nth ? { nth } : {};
  const res = await axiosInstance.get('/tch/items/approved', { params });
  return res.data;
};

export const getRejectedItems = async (nth?: number): Promise<TeacherItemsResponse> => {
  const params = nth ? { nth } : {};
  const res = await axiosInstance.get('/tch/items/rejected', { params });
  return res.data;
};

export const getNotApprovedItems = async (nth?: number): Promise<TeacherItemsResponse> => {
  const params = nth ? { nth } : {};
  const res = await axiosInstance.get('/tch/items', { params });
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

export const downloadExcel = async (nth?: number) => {
  const params = nth ? { nth } : {};
  const res = await axiosInstance.get('/tch/items/xlsx', { 
    params,
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `items_${nth || 'current'}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
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

export const getTeamApprovedItems = async (teamId: number): Promise<TeacherItemsResponse> => {
  const res = await axiosInstance.get(`/tch/items/${teamId}/approved`);
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
