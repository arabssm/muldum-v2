"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import Group from "@/components/group/items";
import ItemForm from "@/components/itemForm";
import ItemsSkeleton from "./skeleton";
import { Modal } from "@/components/modal/modal";
import { getLatestItemGuide } from "@/shared/api/items";
import BlockNoteEditor from "@/shared/ui/tag";

const LockedGroups = ["자율동아리", "졸업작품"] as const;
type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";

const GUIDE_STORAGE_KEY = "itemGuideLastSeen";

export default function Items() {
  const [active, setActive] = useState<GroupType | null>("전공동아리");
  const [lockedMessage, setLockedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideContent, setGuideContent] = useState("");
  const [guideId, setGuideId] = useState<number | null>(null);
  const [guideUpdatedAt, setGuideUpdatedAt] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!active || LockedGroups.includes(active as typeof LockedGroups[number])) {
        return;
      }

      try {
        const guide = await getLatestItemGuide(active);
        if (guide && guide.content) {
          // localStorage에서 마지막으로 본 가이드 정보 가져오기
          const lastSeenData = localStorage.getItem(GUIDE_STORAGE_KEY);
          let shouldShow = true;

          if (lastSeenData) {
            try {
              const lastSeen = JSON.parse(lastSeenData);
              // 같은 가이드 ID이고, updatedAt이 같으면 보여주지 않음
              if (
                lastSeen.guideId === guide.id &&
                lastSeen.projectType === active &&
                lastSeen.updatedAt === guide.updatedAt
              ) {
                shouldShow = false;
              }
            } catch (e) {
              // 파싱 실패 시 보여줌
              shouldShow = true;
            }
          }

          if (shouldShow) {
            setGuideContent(guide.content);
            setGuideId(guide.id);
            setGuideUpdatedAt(guide.updatedAt || "");
            setIsGuideModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch item guide:", error);
      }
    };

    if (isMounted) {
      fetchGuide();
    }
  }, [active, isMounted]);

  const handleDoNotShowAgain = () => {
    if (guideId && active) {
      const lastSeenData = {
        guideId,
        projectType: active,
        updatedAt: guideUpdatedAt,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(lastSeenData));
    }
    setIsGuideModalOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <_.Container>
      <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

      {isLoading ? (
        <ItemsSkeleton />
      ) : LockedGroups.includes(active as typeof LockedGroups[number]) ? (
        <_.MessageWrapper>
          <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
          <_.Message>{lockedMessage}</_.Message>
        </_.MessageWrapper>
      ) : (
        <ItemForm hideClubSelect={true} />
      )}

      <Modal isOpen={isGuideModalOpen} closeModal={() => setIsGuideModalOpen(false)} maxWidth="800px">
        <_.GuideModalInner>
          <_.GuideTitle>물품 신청 안내</_.GuideTitle>
          <_.GuideEditorWrapper>
            <BlockNoteEditor
              initialContent={guideContent}
              editable={false}
            />
          </_.GuideEditorWrapper>
          <_.GuideButtonRow>
            <_.GuideCheckboxWrapper onClick={handleDoNotShowAgain}>
              <input type="checkbox" id="doNotShow" />
              <label htmlFor="doNotShow">다시 보지 않기</label>
            </_.GuideCheckboxWrapper>
            <_.GuideCloseButton onClick={() => setIsGuideModalOpen(false)}>
              확인
            </_.GuideCloseButton>
          </_.GuideButtonRow>
        </_.GuideModalInner>
      </Modal>
    </_.Container>
  );
}