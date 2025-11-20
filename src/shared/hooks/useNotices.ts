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
        const data = res?.data ?? res;

        const arr = Array.isArray(data?.content)
          ? data.content.map((item: any) => {
            const updated = item.updatedAt;
            const bgColor = updated ? "#FF9B62" : "#D1D1D1";

            return {
              id: item.id,
              notice: item.title,
              date: updated?.slice(0, 10),
              teacher: item.teacher,
              path: `/notice/${item.id}`,
              type: "normal",
              badge: "공지",
              bgColor,
            };
          })
          : [];

        setNotices(arr);
      })
      .catch((err) => console.error("공지 불러오기 실패:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return { notices, isLoading };
}