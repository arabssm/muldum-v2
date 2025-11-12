import * as _ from './style';
import Team from '@/widgets/student/team';
import { useState } from 'react';

type ItemType = "월말평가" | "학생추가";

export default function Tteamspace() {
    const Groups: ItemType[] = ["월말평가", "학생추가"];
    const [activeGroup, setActiveGroup] = useState<ItemType>("월말평가");

    return (
        <_.Container>
            <_.TabWrapper>
                {Groups.map((group) => (
                    <_.ClassText
                        key={group}
                        isActive={activeGroup === group}
                        onClick={() => setActiveGroup(group)}
                    >
                        {group}
                    </_.ClassText>
                ))}
            </_.TabWrapper>

            {activeGroup === "월말평가" && <Team />}
            {activeGroup === "학생추가" && <div>학생 추가 화면 내용</div>}
        </_.Container>
    );
}