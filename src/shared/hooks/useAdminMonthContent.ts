import { useState, useEffect } from "react";
import { getAdminMonthContent } from "@/shared/api"; 
import { showToast } from "../ui/toast";

export interface AdminMonthContent {
  id: string;
  month: string;
  sections: any[];
}

export const useAdminMonthContent = (reportId: string | null) => {
  const [data, setData] = useState<AdminMonthContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await getAdminMonthContent(reportId);
        setData(res);
      } catch (err) {
        showToast.error("월말평가 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [reportId]);

  return { data, loading, error };
};