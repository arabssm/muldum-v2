import * as _ from "./style";
import { Groups, LockedGroups, GroupType, GroupProps } from "@/shared/types/team";

export default function Group({ active, setActive, setMessage }: GroupProps) {
    const handleClick = (label: GroupType) => {
        if (LockedGroups.includes(label)) setActive(label), setMessage("아직 개설되지 않은 페이지입니다");
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