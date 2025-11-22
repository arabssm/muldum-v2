import { useState } from "react";
import axiosInstance from "@/shared/lib/axiosInstance";
import { showToast } from "../ui/toast";

export interface AdminMonthReport {
  id: string;
  month: string;
  sections: any[];
}

export const useAdminMonthReports = (months: string[]) => {
  const [reports, setReports] = useState<AdminMonthReport[]>(
    months.map((month, i) => ({ id: `report_${i}`, month, sections: [] }))
  );
  const [loading, setLoading] = useState<boolean[]>(new Array(months.length).fill(false));
  const [ error ] = useState<string | null>(null);

  const fetchReport = async (index: number) => {
    try {
      setLoading((prev) => prev.map((v, i) => (i === index ? true : v)));
      const report_id = reports[index].id;
      const res = await axiosInstance.get(`/tch/month_report/${report_id}`);
      setReports((prev) =>
        prev.map((r, i) => (i === index ? { ...r, sections: res.data.sections } : r))
      );
    } catch (err) {
      console.error("Failed to fetch admin month report:", err);
      showToast.error("월말평가 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading((prev) => prev.map((v, i) => (i === index ? false : v)));
    }
  };

  return { reports, loading, error, fetchReport };
};