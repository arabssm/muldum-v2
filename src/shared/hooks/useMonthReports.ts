import { useState } from "react";
import { getUserMonth } from "@/shared/api";
import { showToast } from '@/shared/ui/toast';

export interface MonthReportSection {
    id: string;
    month: string;
    sections: any[];
}

export const useMonthReports = (initialReports: MonthReportSection[]) => {
    const [reports, setReports] = useState<MonthReportSection[]>(initialReports);
    const [loading, setLoading] = useState(false);
    const [ error ] = useState<string | null>(null);

    const fetchReport = async (index: number) => {
        const report = reports[index];

        if (report.sections.length > 0) return;

        try {
            setLoading(true);
            const data = await getUserMonth(report.id);
            setReports(prev => {
                const newReports = [...prev];
                newReports[index].sections = data.sections || [];
                return newReports;
            });
        } catch (err) {
            console.error("Failed to fetch month report:", err);
            showToast.error("월말평가 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return { reports, loading, error, fetchReport };
};