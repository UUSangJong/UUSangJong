import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import { X } from "lucide-react";

export default function ImageSlider({
  images,
  onClickDeleteImage,
  onClickImageUpload,
}: {
  images: { url: string; type: "server" | "local"; image_id?: number }[];
  onClickImageUpload: () => void;
  onClickDeleteImage: (index: number, type: "server" | "local", image_id?: number) => void;
}) {
  console.log("이미지 데이터 확인:", images);

  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={10}
      scrollbar={{ hide: false }}
      modules={[Scrollbar]}
      className="mySwiper h-[300px]"
    >
      {images.map((img, index) => (
        <SwiperSlide
          key={index}
          className="w-auto h-[195px] relative flex items-center justify-center px-2"
        >
          <img
            src={img.url}
            alt={`uploaded${index}`}
            className="w-auto h-full object-fit rounded mr-auto ml-auto pb-3"
          />
          <button
            className="absolute top-0 right-8 text-white bg-black rounded-full w-5 h-5 p-0
          "
            onClick={() => onClickDeleteImage(index, img.type, img.image_id)}
          >
            <X className="w-5 h-5 cursor-pointer" fill="black " />
          </button>
        </SwiperSlide>
      ))}

      {images.length < 5 && (
        <SwiperSlide key="add-button" className=" pb-3">
          <div
            onClick={onClickImageUpload}
            className="w-full h-full border-2 border-dashed  border-gray-400 flex items-center justify-center cursor-pointer text-2xl text-gray-500 hover:border-blue-500 transition"
          >
            +
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
}
