"use client"
export const dynamic = "force-static";
export async function generateStaticParams() {
  return [];
}
import ClubsDetail from "@/widgets/clubsDetail";


export default function ClubsDetailPage() {
  return <ClubsDetail />
}