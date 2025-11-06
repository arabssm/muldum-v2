import * as _ from './style';
import Image from 'next/image';
import type { FormSectionProps } from '@/shared/types/team';

export default function FormSection({
    title,
    placeholders,
    isTextarea = false,
    must = false,
}: FormSectionProps) {
    return (
        <_.Wrapper>
            <_.TitleWrapper>
                <_.Title>{title}</_.Title>
                {must && (
                    <Image
                        src="/assets/must.svg"
                        alt="필수"
                        width={10}
                        height={10}
                    />
                )}
            </_.TitleWrapper>
            {placeholders.map((placeholder, i) =>
                isTextarea ? (
                    <_.Textarea key={i} placeholder={placeholder} />
                ) : (
                    <_.Input key={i} placeholder={placeholder} />
                )
            )}
        </_.Wrapper>
    );
}