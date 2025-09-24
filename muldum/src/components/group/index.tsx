import * as _ from "./style";
import { Dispatch, SetStateAction } from "react";

const Groups = ["전공동아리", "네트워크", "자율동아리", "졸업작품"] as const;
const LockedGroups = ["자율동아리", "졸업작품"] as const;

export type GroupType = typeof Groups[number];

interface GroupProps {
    active: GroupType | null;
    setActive: Dispatch<SetStateAction<GroupType | null>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

export default function Group({ active, setActive, setMessage }: GroupProps) {
    const handleClick = (label: GroupType) => {
        if ((LockedGroups as readonly string[]).includes(label)) setActive(label), setMessage("현재는 이용이 제한되어 있습니다.");
        else setActive(label), setMessage("");
    };

    return (
        <_.Wrapper>
            {Groups.map(label => <_.Text key={label} isActive={active === label} onClick={() => handleClick(label)}>{label}</_.Text>)}
        </_.Wrapper>
    );
}