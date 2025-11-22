"use client";

import MonthlyTest from "@/widgets/student/monthlyTest";
import Image from "next/image";
import styled from "@emotion/styled";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminMonthContent } from "@/shared/hooks/useAdminMonthContent";
import Loading from "@/shared/ui/loading";

export default function MonthWatch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("report_id") || ""; 

  const { data, loading, error } = useAdminMonthContent(reportId);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Image
        src="/assets/arrow.svg"
        alt="화살표"
        width={24}
        height={24}
        onClick={() => router.push("/TteamSpace")}
        style={{ cursor: "pointer" }}
      />
      <MonthlyTest sections={data?.sections ?? []} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
  gap: 2.5rem;
`;
