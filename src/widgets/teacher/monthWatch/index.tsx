import MonthlyTest from "@/widgets/student/monthlyTest";
import Image from "next/image";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";

export default function MonthWatch() {
    const router = useRouter();

    return (
        <Container>
            <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} onClick={() => router.push('/TteamSpace')} style={{ cursor: "pointer" }} />
            <MonthlyTest />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 2.5rem;
`;