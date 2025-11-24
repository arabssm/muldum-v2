"use client";

import { create } from "zustand";

interface LoadingState {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
}));

export const loadingApi = {
  show: () => useLoadingStore.getState().show(),
  hide: () => useLoadingStore.getState().hide(),
};