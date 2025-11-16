"use client";

import { useEffect, useState } from "react";
import { getNotices } from "@/shared/api/admin/notice";
import type { Notice } from "@/shared/types/notice";

export default function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotices()
      .then((res) => {
        const arr = Array.isArray(res) ? res : res.data ?? [];
        setNotices(arr);
      })
      .catch((err) => console.error("공지 불러오기 실패:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return { notices, isLoading };
}