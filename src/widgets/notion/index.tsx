import * as _ from './style';
import { BtnPrimary } from '@/shared/ui/button';
import { useState } from 'react';

export default function Notion() {
    const [icon, setIcon] = useState('💕');
    const [cover, setCover] = useState<string | null>(null);
    const [title, setTitle] = useState('동아리이름');

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCover(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
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
                        onInput={(e) => setIcon(e.currentTarget.textContent || '')}
                    >
                        {icon}
                    </_.IconInput>
                    <_.Title
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setTitle(e.currentTarget.textContent || '')}
                    >
                        {title}
                    </_.Title>
                </_.HeaderSection>
                <_.ContentArea contentEditable suppressContentEditableWarning />
                <BtnPrimary>수정</BtnPrimary>
            </_.Page>
        </_.Container>
    );
}