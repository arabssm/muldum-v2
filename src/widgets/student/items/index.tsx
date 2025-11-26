"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import Group from "@/components/group/items";
import ItemForm from "@/components/itemForm";
import Loading from "@/shared/ui/loading";
import { Modal } from "@/components/modal/modal";
import { getLatestItemGuide, getUsedBudget } from "@/shared/api/items";
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
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [usedBudget, setUsedBudget] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUsedBudget = async () => {
      try {
        const data = await getUsedBudget();
        setUsedBudget(data.usedBudget);
      } catch (error) {
        console.error("Failed to fetch used budget:", error);
      }
    };

    if (isMounted) {
      fetchUsedBudget();
    }
  }, [isMounted]);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!active || LockedGroups.includes(active as typeof LockedGroups[number])) {
        return;
      }

      try {
        const guide = await getLatestItemGuide(active);
        console.log("Fetched guide:", guide);
        
        if (guide && guide.content) {
          // localStorage에서 마지막으로 본 가이드 정보 가져오기
          const storageKey = `${GUIDE_STORAGE_KEY}_${active}`;
          const lastSeenData = localStorage.getItem(storageKey);
          console.log("Last seen data:", lastSeenData);
          
          let shouldShow = true;

          if (lastSeenData) {
            try {
              const lastSeen = JSON.parse(lastSeenData);
              console.log("Parsed last seen:", lastSeen);
              console.log("Comparison:", {
                guideId: { saved: lastSeen.guideId, current: guide.id, match: lastSeen.guideId === guide.id },
                projectType: { saved: lastSeen.projectType, current: active, match: lastSeen.projectType === active },
                updatedAt: { saved: lastSeen.updatedAt, current: guide.updatedAt, match: lastSeen.updatedAt === guide.updatedAt }
              });
              
              // 같은 가이드 ID이고, projectType이 같으면 보여주지 않음
              if (
                lastSeen.guideId === guide.id &&
                lastSeen.projectType === active
              ) {
                shouldShow = false;
              }
            } catch (e) {
              console.error("Failed to parse last seen data:", e);
              shouldShow = true;
            }
          }

          console.log("Should show modal:", shouldShow);
          
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

  const handleCloseGuideModal = () => {
    if (doNotShowAgain && guideId && active) {
      const storageKey = `${GUIDE_STORAGE_KEY}_${active}`;
      const lastSeenData = {
        guideId,
        projectType: active,
        updatedAt: guideUpdatedAt,
        timestamp: new Date().toISOString(),
      };
      console.log("Saving to localStorage:", storageKey, lastSeenData);
      localStorage.setItem(storageKey, JSON.stringify(lastSeenData));
    }
    setIsGuideModalOpen(false);
    setDoNotShowAgain(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <_.Container>
      {usedBudget !== null && (
        <_.BudgetInfo>
          <span>{usedBudget.toLocaleString()}원</span>
        </_.BudgetInfo>
      )}

      <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

      {isLoading ? (
        <Loading />
      ) : LockedGroups.includes(active as typeof LockedGroups[number]) ? (
        <_.MessageWrapper>
          <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
          <_.Message>{lockedMessage}</_.Message>
        </_.MessageWrapper>
      ) : (
        <ItemForm hideClubSelect={true} />
      )}

      <Modal isOpen={isGuideModalOpen} closeModal={handleCloseGuideModal} maxWidth="800px">
        <_.GuideModalInner>
          <_.GuideTitle>물품 신청 안내</_.GuideTitle>
          <_.GuideEditorWrapper>
            <BlockNoteEditor
              initialContent={guideContent}
              editable={false}
            />
          </_.GuideEditorWrapper>
          <_.GuideButtonRow>
            <_.GuideCheckboxWrapper>
              <input 
                type="checkbox" 
                id="doNotShow" 
                checked={doNotShowAgain}
                onChange={(e) => setDoNotShowAgain(e.target.checked)}
              />
              <label htmlFor="doNotShow">다시 보지 않기</label>
            </_.GuideCheckboxWrapper>
            <_.GuideCloseButton onClick={handleCloseGuideModal}>
              확인
            </_.GuideCloseButton>
          </_.GuideButtonRow>
        </_.GuideModalInner>
      </Modal>
    </_.Container>
  );
}