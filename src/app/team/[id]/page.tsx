"use client"
export const dynamic = "force-static";
export async function generateStaticParams() {
  return [];
}
import TeamDetail from '@/widgets/TeamDetail';

export default function TeamDetailPage() {
  return <TeamDetail />
}