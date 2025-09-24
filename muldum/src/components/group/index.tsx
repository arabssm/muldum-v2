import * as _ from "./style";
import Image from "next/image";
import { useState } from "react";

const Groups = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const LockedGroups = ["자율동아리", "졸업작품"];

export default function Group() {
    const [active, setActive] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleClick = (label: string) => {
        if (LockedGroups.includes(label)) setActive(label), setMessage(`현재는 이용이 제한되어 있습니다.`);
        else setActive(label), setMessage("");
    };

    return (
        <_.Container>
            <_.Wrapper>
                {Groups.map((label) => (
                    <_.Text key={label} isActive={active === label} onClick={() => handleClick(label)} >
                        {label}
                    </_.Text>
                ))}
            </_.Wrapper>
            {message && (
                <_.MessageWrapper>
                    <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
                    <_.Message>{message}</_.Message>
                </_.MessageWrapper>
            )}
        </_.Container>
    );
}
