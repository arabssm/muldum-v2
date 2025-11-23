import NoticeEdit from '@/widgets/teacher/noticeEdit';

interface NoticeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
  const { id } = await params;

  return <NoticeEdit id={id} />;
}
