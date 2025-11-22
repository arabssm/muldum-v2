import * as _ from "./style";
import { BtnPrimary } from "@/shared/ui/button";
import { useState } from "react";
import BlockNoteEditor from "@/shared/ui/tag";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface NotionProps {
    readOnly?: boolean;
}

export default function Notion({ readOnly = false }: NotionProps) {
    const [icon, setIcon] = useState("🌿");
    const [cover, setCover] = useState<string | null>(null);
    const [title, setTitle] = useState("동아리이름");
    const [content, setContent] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setCover(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleIconImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setIcon(ev.target?.result as string);
            setShowEmojiPicker(false);
        };
        reader.readAsDataURL(file);
    };

    const handleResetIcon = () => {
        setIcon("🌿");
        setShowEmojiPicker(false);
    };

    const handleSave = () => {
        alert("저장되었습니다");
    };

    return (
        <_.Container>
            <_.Page>
                <_.CoverContainer>
                    <_.Cover>
                        {cover ? (
                            readOnly ? (
                                <img
                                    src={cover}
                                    alt="cover"
                                    style={{ cursor: "default" }}
                                />
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
                        {icon.startsWith("data:image") ? (
                            <_.IconImageWrapper>
                                <_.IconImage
                                    src={icon}
                                    alt="icon"
                                    onClick={readOnly ? undefined : () =>
                                        document.getElementById("icon-upload")?.click()
                                    }
                                    style={{ cursor: readOnly ? "default" : "pointer" }}
                                />
                                {!readOnly && (
                                    <_.ResetButton onClick={handleResetIcon}>✕</_.ResetButton>
                                )}
                            </_.IconImageWrapper>
                        ) : (
                            <_.EmojiWrapper>
                                <_.IconDisplay
                                    onClick={readOnly ? undefined : () => setShowEmojiPicker(!showEmojiPicker)}
                                    style={{ cursor: readOnly ? "default" : "pointer" }}
                                >
                                    {icon}
                                </_.IconDisplay>
                                {!readOnly && showEmojiPicker && (
                                    <_.EmojiPickerWrapper>
                                        <Picker
                                            data={data}
                                            onEmojiSelect={(emoji: any) => {
                                                setIcon(emoji.native);
                                                setShowEmojiPicker(false);
                                            }}
                                            theme="light"
                                        />
                                        <_.ImageLabel htmlFor="icon-upload">
                                            이미지로 변경
                                        </_.ImageLabel>
                                    </_.EmojiPickerWrapper>
                                )}
                            </_.EmojiWrapper>
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
                    <BlockNoteEditor
                        initialContent={content}
                        onChange={readOnly ? undefined : (value) => setContent(value)}
                        editable={!readOnly}
                    />
                </_.EditorWrapper>
            </_.Page>
            {!readOnly && <BtnPrimary onClick={handleSave}>저장</BtnPrimary>}
        </_.Container>
    );
}