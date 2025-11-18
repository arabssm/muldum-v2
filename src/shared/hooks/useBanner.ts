"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotices } from "@/shared/api/admin/notice";

function calcDDay(deadline: string | null) {
    if (!deadline) return null;

    const today = new Date();
    const target = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDay === 0) return "D-Day";
    if (diffDay > 0) return `D-${diffDay}`;
    return `D+${Math.abs(diffDay)}`;
}

export function useNotices() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["notices"],
        queryFn: async () => {
            const res = await getNotices();
            return res?.data ?? res;
        },
    });

    const notices = (data?.content ?? []).map((item: any) => {
        const date = item.updatedAt
            .slice(0, 10)
            .replace(/-/g, ". ")
            .replace(/$/, ".");
        const dday = item.deadline ? calcDDay(item.deadline) : null;
        return {
            id: item.id,
            notice: item.title,
            date,
            teacher: item.teacher,
            path: `/notice/${item.id}`,
            dday,
        };
    });

    return { notices, isLoading, error };
}