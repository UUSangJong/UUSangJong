"use client";

import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/scrollbar";
import ImageSlider from "../../app/write/ImageSlider";
import TextEditor from "@/components/common/Texteditor";
import { Slider } from "@/components/ui/slider";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { addDays, format } from "date-fns";
import ConfirmDialog from "@/components/common/confirmDialog";
import { FormError } from "./WritePage";

interface WritePageUIProps {
  imageUrls: string[];
  onClickImageUpload: () => void;

  onChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onClickButton: () => Promise<void>;
  onClickBUttonBack: () => void;
  onClickButtonCancle: () => Promise<void>;
  onChangeForm: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => void;
  onClickDeleteImage: (index: number, type: "server" | "local", image_id?: number) => void;
  onChangeContents: (html: string) => void;
  isEdit: boolean;
  form: {
    title: string;
    price: string;
    startPrice: string;
    contents: string;
    endDate: string;
  };
  formError: FormError;
  imageFiles: File[];
  setImageFiles: Dispatch<SetStateAction<File[]>>;
  isCancle: boolean;
  serverLocalImages: {
    url: string;
    type: "server" | "local";
    image_id?: number;
  }[];
}

export default function WritePageUI(props: WritePageUIProps) {
  const [dueDate, setDueDate] = useState(1);

  console.log("isEdit", props.isEdit);
  console.log("isCancle", props.isCancle);
  console.log("gdgd:", props.form.endDate);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fefdf6]">
      {/* 제목 */}
      <div className="mt-[168px] mb-[69px] w-[1111px]">
        <h1 className="text-[40px] font-normal text-left text-[#5B5A5A] mb-[69px]">
          {`\"삶의 한조각을 공유해주세요.\"`}
        </h1>
      </div>

      {/* 상단: 이미지 + 입력창 */}
      <div className="flex w-[1111px] gap-6 mb-6">
        {/* 이미지 영역 */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="w-full mb-2 h-full">
            <ImageSlider
              images={props.serverLocalImages}
              onClickImageUpload={props.onClickImageUpload}
              onClickDeleteImage={props.onClickDeleteImage}
            />
            {props.formError.images && (
              <p className="text-red-500 text-sm text-left mt-2">{props.formError.images}</p>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={props.onChangeFile}
            ref={props.fileInputRef}
            className="hidden"
          />
          {props.formError.images && <p className="text-red-500 text-sm text-left w-full"></p>}
        </div>

        {/* 작성 영역 */}
        <div className="w-1/2 flex flex-col">
          {/* Title */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 block mb-1">Title</label>
            <input
              name="title"
              placeholder="Value"
              className="border-b p-2 w-full text-sm mb-1"
              value={props.form.title}
              onChange={props.onChangeForm}
            />
            {props.formError.title && (
              <p className="text-red-500 text-sm text-left">{props.formError.title}</p>
            )}
          </div>

          {/* 시작 가격 */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 block mb-1">시작 가격</label>
            <input
              name="startPrice"
              value={props.form.startPrice}
              placeholder="Value"
              min={0}
              step={100}
              className="border-b p-2 text-sm w-full mb-1"
              onChange={props.onChangeForm}
            />
            {props.formError.startPrice && (
              <p className="text-red-500 text-sm text-left">{props.formError.startPrice}</p>
            )}
          </div>

          {/* 즉시 구매가 */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 block mb-1">즉시 구매가</label>
            <input
              name="price"
              type="number"
              value={props.form.price}
              placeholder="Value"
              min={Number(props.form.startPrice)}
              step={100}
              className="border-b p-2 text-sm w-full mb-1"
              onChange={props.onChangeForm}
            />
            {props.formError.price && (
              <p className="text-red-500 text-sm text-left">{props.formError.price}</p>
            )}
          </div>

          {/* 경매 마감일 (슬라이더) */}
          <div className="mb-4">
            <label htmlFor="endDate" className="text-sm text-gray-700 block mb-1">
              경매 마감일
            </label>
            <div className="relative w-full mt-[5px]">
              <Slider
                value={[dueDate]}
                min={1}
                max={7}
                step={2}
                onValueChange={(value) => {
                  setDueDate(value[0]);
                  const nextDate = format(addDays(new Date(), value[0]), "yyyy-MM-dd");
                  props.onChangeForm({
                    target: { name: "endDate", value: nextDate },
                  });
                }}
                className="
                  w-full mt-2
                  [&_[data-slot=slider-track]]:h-[4px] 
                  [&_[data-slot=slider-track]]:bg-gray-300 
                  [&_[data-slot=slider-range]]:h-[4px] 
                  [&_[data-slot=slider-range]]:bg-[#4C4528] 
                  [&_[data-slot=slider-thumb]]:w-6 
                  [&_[data-slot=slider-thumb]]:h-6 
                  [&_[data-slot=slider-thumb]]:bg-white 
                  [&_[data-slot=slider-thumb]]:border 
                  [&_[data-slot=slider-thumb]]:border-gray-400 
                  [&_[data-slot=slider-thumb]]:rounded-full
                  [&_[data-slot=slider-track]]:rounded-full
                "
              />
              <div className="text-sm text-gray-500 mt-2">
                {props.form.endDate ? props.form.endDate : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 제품 상세 설명 */}
      <div className="w-[1111px] mb-[113px]">
        <label className="text-[16px] text-gray-700 block mb-1">제품 상세 설명</label>

        <TextEditor
          value={props.form.contents}
          onChange={(html) => {
            props.onChangeContents(html);
          }}
        />
      </div>
      {props.formError.contents && (
        <p className="text-red-500 text-sm text-left">{props.formError.contents}</p>
      )}

      {/* 버튼 영역 */}
      <div className="flex gap-15 mt-8 mb-[148px]">
        <Button
          className="cursor-pointer bg-[#BEB8B8] text-white text-[23.06px] font-light w-[200.15px] h-[49.42px] rounded-[12px]"
          onClick={props.onClickBUttonBack}
        >
          돌아가기
        </Button>
        {props.isEdit && !props.isCancle && (
          <Button
            className="cursor-pointer bg-[#4C4528] text-white text-[23.06px] font-light w-[200.15px] h-[49.42px] rounded-[12px]"
            onClick={props.onClickButton}
          >
            수정하기
          </Button>
        )}
        {props.isEdit && (
          <ConfirmDialog
            title="Warning"
            description="경매 등록을 취소하시면 현재 게시글을 더는 수정하실 수 없습니다. 정말 취소하시겠습니까?"
            confirmText="위 사항을 확인했으며, 취소에 동의합니다."
            cancelText="Cancel"
            onConfirm={props.onClickButtonCancle}
          >
            <Button
              className="cursor-pointer bg-[#BA1A1A] text-white text-[23.06px] font-light w-[200.15px] h-[49.42px] rounded-[12px]"
              disabled={props.isCancle}
            >
              {props.isCancle ? "경매 취소됨" : "경매 취소하기"}
            </Button>
          </ConfirmDialog>
        )}
        {!props.isEdit && (
          <Button
            className="cursor-pointer bg-[#4C4528] text-white text-[23.06px] font-light w-[200.15px] h-[49.42px] rounded-[12px]"
            onClick={props.onClickButton}
          >
            등록하기
          </Button>
        )}
      </div>
    </div>
  );
}
