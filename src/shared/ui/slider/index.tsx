"use client";

import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as _ from "./style";
import sliderSettings from "./Setting";
import { useQuery } from "@tanstack/react-query";
import { getNotices } from "@/shared/api/admin/notice";
import type { Notice } from "@/shared/types/notice";

const getDDay = (dateString: string) => {
  if (!dateString) return "";
  const clean = dateString.replace(/\./g, "");
  const target = new Date(clean);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (day === 0) return "D-0";
  if (day > 0) return `D-${day}`;
  return `D+${Math.abs(day)}`;
};

const NextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="next-arrow" onClick={onClick}>
      <Image
        src="/assets/Warrow.svg"
        alt="Next"
        width={24}
        height={24}
        style={{ transform: "rotate(180deg)", opacity: 0.5 }}
      />
    </_.ArrowButton>
  );
};

const PrevArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="prev-arrow" onClick={onClick}>
      <Image src="/assets/Warrow.svg" alt="Prev" width={24} height={24} style={{ opacity: 0.5 }} />
    </_.ArrowButton>
  );
};

function useNoticesQuery() {
  return useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await getNotices();
      return res?.data ?? res;
    },
  });
}

export default function SliderComponent() {
  const { data } = useNoticesQuery();

  const notices: Notice[] = (data?.content ?? []).map((item: any) => {
    const rawDate = item.updatedAt?.slice(0, 10);
    const deadline = item.deadline?.slice(0, 10);

    return {
      id: item.id,
      notice: item.title,
      date: rawDate ? rawDate.replace(/-/g, ". ") + "." : "",
      teacher: item.teacher,
      dday: getDDay(deadline || rawDate),
      path: `/notice/${item.id}`,
    };
  });

  const settings = {
    ...sliderSettings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (notices.length === 0) {
    return (
      <_.Container>
        <div>
          현재 공지사항이 없습니다.
        </div>
      </_.Container>
    );
  }

  return (
    <_.Container>
      <_.StyledSlider {...settings}>
        {notices.map((item: Notice, index: number) => (
          <Link key={item.id} href={item.path}>
            <_.SlideWrapper>
              <Image
                src="/assets/basicBG.svg"
                alt={item.notice}
                width={2500}
                height={320}
                style={{ objectFit: "cover", borderRadius: "1rem" }}
              />
              <_.Overlay />
              <_.DDay>{item.dday}</_.DDay>
              <_.Title>{item.notice}</_.Title>
              <_.Date>{item.date}</_.Date>
              <_.SubTitle>{item.teacher}</_.SubTitle>
              <_.Index>
                {index + 1}/{notices.length}
              </_.Index>
            </_.SlideWrapper>
          </Link>
        ))}
      </_.StyledSlider>
    </_.Container>
  );
}