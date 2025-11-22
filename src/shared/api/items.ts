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

export const getCrawlRecommendations = async (query: string, limit: number = 3) => {
  const url = `http://localhost:8000/recommend/11st?name=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data;
};
