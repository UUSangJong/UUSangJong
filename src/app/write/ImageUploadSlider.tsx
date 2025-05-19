import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

export default function ImageUloadSlider({ images }: { images: string[] }) {
  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={10}
      scrollbar={{ hide: false }}
      modules={[Scrollbar]}
      className="mySwiper h-[75vh]"
    >
      {images.map((url, index) => (
        <SwiperSlide
          key={index}
          className="w-auto h-[75vh]] relative flex items-center justify-center px-2"
        >
          <img
            src={url}
            alt={`uploaded-${index}`}
            className="w-auto h-full object-contain rounded mr-auto ml-auto pb-3"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
