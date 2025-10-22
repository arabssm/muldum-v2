"use client";

import * as _ from "./style";
import Image from "next/image";
import type { FormInputProps } from "@/types/group";

export function FormInput({
    label,
    value,
    setValue,
    placeholder,
    width,
    height,
    error,
}: FormInputProps) {
    return (
        <_.Wrapper>
            <_.Title>{label}</_.Title>
            {height ? (
                <_.Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    style={{ height }}
                    isError={!!error}
                />
            ) : (
                <_.Input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    inputWidth={width}
                    isError={!!error}
                />
            )}
            {error && (
                <_.ErrorMessage>
                    <Image src="/assets/error.svg" alt="Error" width={16} height={16} />
                    {error}
                </_.ErrorMessage>
            )}
        </_.Wrapper>
    );
}