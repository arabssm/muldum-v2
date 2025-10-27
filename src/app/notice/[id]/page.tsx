"use client"
export const dynamic = "force-static";
export async function generateStaticParams() {
  return [];
}

import NoticeDetail from '@/widgets/noticeDetail';

export default function NoticeDetailPage() {
  return <NoticeDetail />
}