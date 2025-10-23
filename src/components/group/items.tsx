import * as _ from "./style";
import { Groups, LockedGroups, GroupType, GroupProps } from "@/shared/types/group";

export default function Group({ active, setActive, setMessage }: GroupProps) {
    const handleClick = (label: GroupType) => {
        if (LockedGroups.includes(label)) setActive(label), setMessage("현재는 이용이 제한되어 있습니다.");
        else setActive(label), setMessage("");
    };

    return (
        <_.Wrapper>
            {Groups.map(label => (
                <_.Text key={label} isActive={active === label} onClick={() => handleClick(label)} >
                    {label}
                </_.Text>
            ))}
        </_.Wrapper>
    );
}