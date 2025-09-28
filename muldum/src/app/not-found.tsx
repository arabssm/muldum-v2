import Link from "next/link";

export default function NotFound(){
    return (
        <>
            <h1>404</h1>
            <Link href='/'>홈으로</Link>
        </>
    );
}