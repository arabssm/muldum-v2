"use client"

import Items from "@/widgets/student/items";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/shared/api/user";
import Loading from "@/shared/ui/loading";
import { showToast } from "@/shared/ui/toast";

export default function ItemPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      try {
        await getUserInfo();
        setIsChecking(false);
      } catch (error) {
        console.error("Authentication failed:", error);
        showToast.error("권한이 부족합니다");
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return <Loading />;
  }

  return <Items />
}