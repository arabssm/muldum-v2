"use client";

import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as _ from "./style";
import sliderSettings from "./Setting";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getNotices } from "@/shared/api/admin/notice";

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="next-arrow" onClick={onClick}>
      <Image src="/assets/Warrow.svg" alt="Next" width={24} height={24} style={{ transform: "rotate(180deg)", opacity: 0.5 }} />
    </_.ArrowButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="prev-arrow" onClick={onClick}>
      <Image src="/assets/Warrow.svg" alt="Prev" width={24} height={24} style={{ opacity: 0.5 }} />
    </_.ArrowButton>
  );
};

export default function SliderComponent() {
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getNotices();
      const arr = Array.isArray(res) ? res : res.data ?? [];
      setNotices(arr);
      setIsLoading(false);
    })();
  }, []);

  const settings = {
    ...sliderSettings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (isLoading) {
    return (
      <_.Container>
        <div style={{ padding: "2rem 0", textAlign: "center" }}>로딩 중...</div>
      </_.Container>
    );
  }

  if (notices.length === 0) {
    return (
      <_.Container>
        <div style={{ padding: "2rem 0", textAlign: "center", color: "#B2B2B2" }}>
          현재 공지사항이 없습니다.
        </div>
      </_.Container>
    );
  }

  return (
    <_.Container>
      <_.StyledSlider {...settings}>
        {notices.map((item, index) => (
          <Link key={item.path || index} href={item.path || `/notice/${index + 1}`}>
            <_.SlideWrapper>
              <Image
                src={"/assets/basicBG.svg"}
                alt={item.notice}
                width={1700}
                height={320}
                style={{ objectFit: "cover", borderRadius: "1rem" }}
              />
              <_.Overlay />
              <_.Title>{item.notice}</_.Title>
              <_.Date>{item.date}</_.Date>
              {item.subtitle && <_.SubTitle>{item.subtitle}</_.SubTitle>}
              {item.dDay && <_.Ddate>{item.dDay}</_.Ddate>}
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