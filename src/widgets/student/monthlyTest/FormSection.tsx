import * as _ from './style';
import Image from 'next/image';
import type { FormSectionProps } from '@/shared/types/team';

interface ExtendedFormSectionProps extends FormSectionProps {
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    readOnly?: boolean;
}

export default function FormSection({
    title,
    placeholders,
    isTextarea = false,
    must = false,
    value = '',
    onChange,
    readOnly = false,
}: ExtendedFormSectionProps) {
    const isArrayValue = Array.isArray(value);
    const values = isArrayValue ? value : [value];

    const handleChange = (index: number, newValue: string) => {
        if (readOnly) return;
        if (isArrayValue) {
            const newValues = [...values];
            newValues[index] = newValue;
            onChange?.(newValues);
        } else {
            onChange?.(newValue);
        }
    };

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
                    <_.Textarea 
                        key={i} 
                        placeholder={placeholder}
                        value={values[i] || ''}
                        onChange={(e) => handleChange(i, e.target.value)}
                        readOnly={readOnly}
                        style={readOnly ? { cursor: 'default', backgroundColor: '#f5f5f5' } : {}}
                    />
                ) : (
                    <_.Input 
                        key={i} 
                        placeholder={placeholder}
                        value={values[i] || ''}
                        onChange={(e) => handleChange(i, e.target.value)}
                        readOnly={readOnly}
                        style={readOnly ? { cursor: 'default', backgroundColor: '#f5f5f5' } : {}}
                    />
                )
            )}
        </_.Wrapper>
    );
}