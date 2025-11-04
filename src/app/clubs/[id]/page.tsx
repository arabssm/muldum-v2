import ClubsDetail from "@/widgets/student/clubsDetail";

export async function generateStaticParams() {
  // 빌드 시점에 생성할 id 목록을 반환해야 합니다.
  // 실제로는 API 요청 등을 통해 받아올 수 있습니다.
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

interface ClubsDetailPageProps {
  params: {
    id: string;
  }
}

export default function ClubsDetailPage({params}: ClubsDetailPageProps) {
  const {id} = params;
  return <ClubsDetail />
}