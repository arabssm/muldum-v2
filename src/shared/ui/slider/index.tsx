import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as _ from "./style";
import sliderSettings from "./Setting";
import Data from "./data";

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="next-arrow" onClick={onClick}>
      &gt;
    </_.ArrowButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <_.ArrowButton className="prev-arrow" onClick={onClick}>
      &lt;
    </_.ArrowButton>
  );
};

export default function SliderComponent() {
  const settings = {
    ...sliderSettings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <_.Container>
      <_.StyledSlider {...settings}>
        {Data.map((item, index) => (
          <_.SlideWrapper key={index}>
            <Image
              src={"/assets/basicBG.svg"}
              alt={item.title}
              width={1700}
              height={320}
              style={{ objectFit: "cover", borderRadius: "1rem" }}
            />
            <_.Overlay />
            <_.Title>{item.title}</_.Title>
            <_.Date>{item.date}</_.Date>
            <_.SubTitle>{item.subtitle}</_.SubTitle>
            <_.Ddate>{item.dDay}</_.Ddate>
            <_.Index>
              {index + 1}/{Data.length}
            </_.Index>
          </_.SlideWrapper>
        ))}
      </_.StyledSlider>
    </_.Container>
  );
}