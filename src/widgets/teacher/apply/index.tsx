import * as _ from "./style";
import { useState } from 'react';

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";
type ClassType = "전체" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const Classes: ClassType[] = ["전체", "1반", "2반", "3반", "4반"];

export default function Apply() {
    const [activeGroup, setActiveGroup] = useState<GroupType>("전공동아리");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");

    return (
        <_.Container>
            <_.Wrapper>
                <_.Group>
                    {Groups.map((label) => (
                        <_.ClassText
                            key={label}
                            isActive={activeGroup === label}
                            onClick={() => setActiveGroup(label)}
                        >
                            {label}
                        </_.ClassText>
                    ))}
                </_.Group>
                <_.Group>
                    {Classes.map((label) => (
                        <_.ClassText
                            key={label}
                            isActive={activeClass === label}
                            onClick={() => setActiveClass(label)}
                        >
                            {label}
                        </_.ClassText>
                    ))}
                </_.Group>
            </_.Wrapper>
            <_.BtnGroup>
                <_.Btn>아라</_.Btn>
                <_.Btn>인서트</_.Btn>
                <_.Btn>테라</_.Btn>
            </_.BtnGroup>
        </_.Container>
    );
}