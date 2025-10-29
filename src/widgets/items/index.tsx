"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import Group from "@/components/group/items";
import ItemForm from "@/components/itemForm";
import ItemsSkeleton from "./skeleton";

const LockedGroups = ["자율동아리", "졸업작품"] as const;
type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";

export default function Items() {
  const [active, setActive] = useState<GroupType | null>(null);
  const [lockedMessage, setLockedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    // 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted || isLoading) {
    return <ItemsSkeleton />;
  }

  return (
    <_.Container>
      <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

      {LockedGroups.includes(active as typeof LockedGroups[number]) ? (
        <_.MessageWrapper>
          <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
          <_.Message>{lockedMessage}</_.Message>
        </_.MessageWrapper>
      ) : active ? (
        <>
          <ItemForm />
        </>
      ) : (
        <_.MessageWrapper>
          <Image src="/assets/choice.svg" alt="No" width={120} height={120} />
          <_.Message>물품 신청을 위해 폼을 선택해주세요</_.Message>
        </_.MessageWrapper>
      )}
    </_.Container>
  );
}