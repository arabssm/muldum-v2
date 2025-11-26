"use client";

import * as _ from "./style";
import * as React from "react";
import { BtnPrimary } from "@/shared/ui/button";
import BlockNoteEditor from "@/shared/ui/tag";
import { useNotion } from "@/shared/hooks/useNotion";
import type { NotionProps } from "@/shared/types/team"
import Loading from "@/shared/ui/loading";

export default function Notion({ teamId, readOnly = false }: NotionProps) {
    const {
        title, setTitle,
        content, setContent,
        icon,
        cover,
        loading, saveNotion,
        updateBanner,
        updateIcon,
        importFromNotion,
        connectNotion
    } = useNotion(teamId);

    const [showImportModal, setShowImportModal] = React.useState(false);
    const [notionUrl, setNotionUrl] = React.useState("");
    const [editorKey, setEditorKey] = React.useState(Date.now());

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            const { showToast } = await import('@/shared/ui/toast');
            const { getPresignedUrl, uploadFileToS3 } = await import('@/shared/api/admin/notice');
            
            // 1. Presigned URL 받기
            const presignedData = await getPresignedUrl(file.name);
            
            // 2. S3에 업로드
            const s3Url = await uploadFileToS3(presignedData, file);
            
            // 3. 서버에 배너 URL 업데이트
            await updateBanner(s3Url);
            
            showToast.success("배너가 수정되었습니다");
        } catch (error) {
            console.error("배너 업로드 실패:", error);
            const { showToast } = await import('@/shared/ui/toast');
            showToast.error("배너 업로드에 실패했습니다");
        }
    };

    const handleIconImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            const { showToast } = await import('@/shared/ui/toast');
            const { getPresignedUrl, uploadFileToS3 } = await import('@/shared/api/admin/notice');
            
            // 1. Presigned URL 받기
            const presignedData = await getPresignedUrl(file.name);
            
            // 2. S3에 업로드
            const s3Url = await uploadFileToS3(presignedData, file);
            
            // 3. 서버에 아이콘 URL 업데이트
            await updateIcon(s3Url);
            
            showToast.success("로고가 수정되었습니다");
        } catch (error) {
            console.error("로고 업로드 실패:", error);
            const { showToast } = await import('@/shared/ui/toast');
            showToast.error("로고 업로드에 실패했습니다");
        }
    };

    const handleImportNotion = async () => {
        if (!notionUrl.trim()) {
            const { showToast } = await import('@/shared/ui/toast');
            showToast.error("Notion URL을 입력해주세요");
            return;
        }
        
        await importFromNotion(notionUrl);
        setEditorKey(Date.now()); // 에디터 강제 리렌더링
        setShowImportModal(false);
        setNotionUrl("");
    };

    if (loading) return <><Loading /></>;

    return (
        <_.Container>
            <_.Page>
                <_.CoverContainer>
                    <_.Cover>
                        {cover ? (
                            readOnly ? (
                                <img src={cover} alt="cover" style={{ cursor: "default" }} />
                            ) : (
                                <label htmlFor="cover-upload">
                                    <img
                                        src={cover}
                                        alt="cover"
                                        style={{ cursor: "pointer" }}
                                        title="클릭하여 커버 변경"
                                    />
                                </label>
                            )
                        ) : (
                            !readOnly && (
                                <_.CoverPlaceholder>
                                    <label htmlFor="cover-upload">
                                        <span>커버 추가</span>
                                    </label>
                                </_.CoverPlaceholder>
                            )
                        )}
                        {!readOnly && (
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                                hidden
                            />
                        )}
                    </_.Cover>
                    <_.IconWrapper>
                        {icon ? (
                            <_.IconImageWrapper>
                                <_.IconImage
                                    src={icon}
                                    alt="로고"
                                    onClick={readOnly ? undefined : () =>
                                        document.getElementById("icon-upload")?.click()
                                    }
                                    style={{ cursor: readOnly ? "default" : "pointer" }}
                                    title={readOnly ? "" : "클릭하여 로고 변경"}
                                />
                            </_.IconImageWrapper>
                        ) : (
                            !readOnly && (
                                <_.IconImageWrapper>
                                    <label htmlFor="icon-upload" style={{ cursor: "pointer" }}>
                                        <_.IconDisplay>📷</_.IconDisplay>
                                    </label>
                                </_.IconImageWrapper>
                            )
                        )}
                        {!readOnly && (
                            <input
                                id="icon-upload"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleIconImage}
                            />
                        )}
                    </_.IconWrapper>
                </_.CoverContainer>
                <_.HeaderSection>
                    <_.Title
                        type="text"
                        value={title}
                        onChange={readOnly ? undefined : (e) => setTitle(e.target.value)}
                        placeholder="동아리 이름을 입력하세요"
                        readOnly={readOnly}
                        style={{ cursor: readOnly ? "default" : "text" }}
                    />
                </_.HeaderSection>
                <_.EditorWrapper>
                    {!loading && (
                        <BlockNoteEditor
                            key={editorKey}
                            initialContent={content}
                            onChange={readOnly ? undefined : (value) => setContent(value)}
                            editable={!readOnly}
                        />
                    )}
                </_.EditorWrapper>
            </_.Page>
            {!readOnly && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <BtnPrimary onClick={() => setShowImportModal(true)}>
                        Notion에서 가져오기
                    </BtnPrimary>
                    <BtnPrimary onClick={saveNotion}>저장</BtnPrimary>
                </div>
            )}

            {showImportModal && (
                <_.ModalOverlay onClick={() => setShowImportModal(false)}>
                    <_.ModalContent onClick={(e) => e.stopPropagation()}>
                        <_.ModalTitle>Notion 페이지 가져오기</_.ModalTitle>
                        
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            lineHeight: '1.6',
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            처음 사용하시나요?{' '}
                            <button
                                onClick={() => {
                                    setShowImportModal(false);
                                    connectNotion();
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#4a90e2',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    padding: 0,
                                    fontSize: 'inherit'
                                }}
                            >
                                Notion 계정 연결하기
                            </button>
                        </div>
                        
                        <_.ModalInput
                            type="text"
                            placeholder="https://www.notion.so/..."
                            value={notionUrl}
                            onChange={(e) => setNotionUrl(e.target.value)}
                        />
                        
                        <_.ModalButtons>
                            <BtnPrimary onClick={handleImportNotion}>가져오기</BtnPrimary>
                            <_.CancelButton onClick={() => setShowImportModal(false)}>
                                취소
                            </_.CancelButton>
                        </_.ModalButtons>
                    </_.ModalContent>
                </_.ModalOverlay>
            )}
        </_.Container>
    );
}