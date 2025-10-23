import * as _ from "./style";
import { BtnPrimary } from "@/shared/ui/button";
import { useState } from "react";
import BlockNoteEditor from "@/shared/ui/tag";

export default function Notion() {
    const [icon, setIcon] = useState("🌿");
    const [cover, setCover] = useState<string | null>(null);
    const [title, setTitle] = useState("동아리이름");
    const [content, setContent] = useState<string>("");

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCover(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        // 저장 로직
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
                    <_.IconInput
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setIcon(e.currentTarget.textContent || "")}
                    >
                        {icon}
                    </_.IconInput>

                    <_.Title
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setTitle(e.currentTarget.textContent || "")}
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