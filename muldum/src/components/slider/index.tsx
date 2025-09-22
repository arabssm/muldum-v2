import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as _ from "./style";
import sliderSettings from "./Setting";
import Data from "./data";

export default function SliderComponent() {
  return (
    <_.Container>
      <_.StyledSlider {...sliderSettings}>
        {Data.map((item, index) => (
          <_.SlideWrapper key={index}>
            <Image
              src={item.img}
              alt={item.title}
              fill
              style={{ objectFit: "cover" }}
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