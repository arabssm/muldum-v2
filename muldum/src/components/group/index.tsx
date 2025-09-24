import * as _ from "./style";
import { useState } from "react";

const Groups = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];

export default function Group() {
    const [active, setActive] = useState<string | null>(null);

    return (
        <_.Container>
            {Groups.map((label) => (
                <_.Text
                    key={label} isActive={active === label} onClick={() => setActive(label)} >
                    {label}
                </_.Text>
            ))}
        </_.Container>
    );
}