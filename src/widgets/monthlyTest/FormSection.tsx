import * as _ from './style';
import type { FormSectionProps } from '@/shared/types/team'

export default function FormSection({
    title,
    placeholders,
    isTextarea = false,
}: FormSectionProps) {
    return (
        <_.Wrapper>
            <_.Title>{title}</_.Title>
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
