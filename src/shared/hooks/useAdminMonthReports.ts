import { useState } from "react";
import { getAdminMonth } from "@/shared/api";
import { showToast } from "../ui/toast";

export interface AdminMonthReport {
  month: string;
  sections: any[];
}

export const useAdminMonthReports = (months: string[]) => {
  const [reports, setReports] = useState<AdminMonthReport[]>(
    months.map((month) => ({ month, sections: [] }))
  );
  const [loading, setLoading] = useState<boolean[]>(new Array(months.length).fill(false));
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (index: number) => {
    try {
      const newLoading = [...loading];
      newLoading[index] = true;
      setLoading(newLoading);

      const res = await getAdminMonth();
      const newReports = [...reports];
      newReports[index] = { month: months[index], sections: res.sections || [] };
      setReports(newReports);
    } catch (err) {
      showToast.error("월말평가 데이터를 불러오지 못했습니다.");
    } finally {
      const newLoading = [...loading];
      newLoading[index] = false;
      setLoading(newLoading);
    }
  };

  return { reports, loading, error, fetchReport };
};