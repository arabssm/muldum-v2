"use client";

import * as _ from "./style";
import { useState, useEffect } from "react";
import { BtnPrimary } from "@/shared/ui/button";
import { createItemGuide, getLatestItemGuide } from "@/shared/api/items";
import { showToast } from "@/shared/ui/toast";
import { useRouter } from "next/navigation";
import BlockNoteEditor from "@/shared/ui/tag";

const ProjectTypes = ["전공동아리", "네트워크"] as const;

export default function Caution() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [projectType, setProjectType] = useState<string>("전공동아리");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getLatestItemGuide(projectType);
        if (guide && guide.content) {
          setContent(guide.content);
        }
      } catch (error) {
        console.error("Failed to fetch guide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [projectType]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast.warning("안내 내용을 입력해주세요.");
      return;
    }

    try {
      await createItemGuide({ content, projectType });
      showToast.success("주의사항이 저장되었습니다.");
      router.push("/apply");
    } catch (error) {
      console.error("Failed to create item guide:", error);
      showToast.error("주의사항 저장에 실패했습니다.");
    }
  };

  if (loading) {
    return <_.Container>로딩 중...</_.Container>;
  }

  return (
    <_.Container>
      <_.Page>
        <_.HeaderSection>
          <_.Title>물품 신청 주의사항 작성</_.Title>
          <_.SelectWrapper>
            <_.Select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
              {ProjectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </_.Select>
          </_.SelectWrapper>
        </_.HeaderSection>
        <_.EditorWrapper>
          <BlockNoteEditor
            initialContent={content}
            onChange={(value) => setContent(value)}
            editable={true}
          />
        </_.EditorWrapper>
      </_.Page>
      <BtnPrimary onClick={handleSubmit}>저장</BtnPrimary>
    </_.Container>
  );
}
