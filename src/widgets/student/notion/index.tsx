import * as _ from "./style";
import { BtnPrimary } from "@/shared/ui/button";
import { useState } from "react";
import BlockNoteEditor from "@/shared/ui/tag";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function Notion() {
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
        alert('저장되었습니다');
    };

    return (
        <_.Container>
            <_.Page>
                <_.Cover>
                    {cover ? (
                        <img src={cover} alt="cover" />
                    ) : (
                        <_.CoverPlaceholder>
                            <label htmlFor="cover-upload">
                                <span>커버 추가</span>
                            </label>
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                                hidden
                            />
                        </_.CoverPlaceholder>
                    )}
                </_.Cover>
                <_.HeaderSection>
                    <_.IconWrapper>
                        {icon.startsWith("data:image") ? (
                            <_.IconImageWrapper>
                                <_.IconImage
                                    src={icon}
                                    alt="icon"
                                    onClick={() =>
                                        document.getElementById("icon-upload")?.click()
                                    }
                                />
                                <_.ResetButton onClick={handleResetIcon}>✕</_.ResetButton>
                            </_.IconImageWrapper>
                        ) : (
                            <_.EmojiWrapper>
                                <_.IconDisplay
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    {icon}
                                </_.IconDisplay>
                                {showEmojiPicker && (
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
                        <input
                            id="icon-upload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleIconImage}
                        />
                    </_.IconWrapper>
                    <_.Title
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) =>
                            setTitle(e.currentTarget.textContent || "")
                        }
                    >
                        {title}
                    </_.Title>
                </_.HeaderSection>
                <_.EditorWrapper>
                    <BlockNoteEditor
                        initialContent={content}
                        onChange={(value) => setContent(value)}
                    />
                </_.EditorWrapper>
            </_.Page>
            <BtnPrimary onClick={handleSave}>저장</BtnPrimary>
        </_.Container>
    );
}