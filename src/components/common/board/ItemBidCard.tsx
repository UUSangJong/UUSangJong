"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBoardItemList } from "@/store/store";
// import { useUser } from "@/store/store";
// import { useUser } from "@/store/store";
import React, { memo, useEffect } from "react";
import { DialogReport } from "@/components/ui/dialogReport";
import BidToPost from "./BidToPost";
import { addHours, format } from "date-fns";
import { useUser } from "@/hooks/useUser";

// ✅ props 타입 명확하게 정의
interface ItemBidCardProps {
  postId: number;
  title: string;
  content: string;
  startPrice: number;
  instantPrice: number;
  nowPrice?: number;
  endDate: string;
  isSold: string;
  writerId: number;
  userId: number;
}

const ItemBidCard = ({
  postId,
  title,
  startPrice,
  instantPrice,
  endDate,
  isSold,
  // writerId,
  userId: postOwnerId,
  nowPrice,
}: ItemBidCardProps) => {
  const router = useRouter();
  const { setCurrentId } = useBoardItemList();

  useEffect(() => {
    setCurrentId(postId);
  }, [postId, setCurrentId]);

  const onClickEdit = () => {
    router.push(`/board/${postId}/edit?isEdit=true`);
  };
  console.log(instantPrice);

  // 로그인 유저와 비교
  const { userInfo } = useUser();
  const userId = userInfo?.user_id;
  const isOwner = userId === postOwnerId; // 로그인한 유저가 게시글 작성자와 같은지 확인하고 답변 권한 부여

  const isBidDisabled = isSold !== "on_sale";

  // console.log("postId", postId, "isSold", isSold);
  console.log("userId:", userId);
  console.log("postOwnerId:", postOwnerId);
  console.log("isOwner:", isOwner);
  return (
    <Card className="w-[90vw] max-w-[440px] h-[75vh] mt-[6vh] lg:mt-[84px] lg:mr-[39px] border-none shadow-none">
      <CardContent className="p-0 relative">
        <div className="absolute top-0 left-[33px] font-light text-black text-base whitespace-nowrap">
          종료일: {format(addHours(endDate, 12), "yyyy.MM.dd HH:mm")}
        </div>

        <h1 className="absolute w-[249px] top-[26px] left-[33px] font-bold text-black text-[32px] whitespace-nowrap">
          {title}
        </h1>

        <Separator className="absolute top-24 w-[428px] bg-[#cccccc] left-0" />

        <div className="absolute top-[110px] left-[34px] font-light text-black text-2xl">
          즉시 구매가 :&nbsp;&nbsp; {instantPrice} 원
        </div>

        <div className="absolute top-[150px] left-[33px] font-light text-black text-2xl">
          시작가 :&nbsp;&nbsp;{startPrice} 원
        </div>

        <div className="absolute top-[190px] left-[33px] font-light text-black text-2xl">
          현재 가격 :&nbsp;&nbsp;{nowPrice ? nowPrice : startPrice} 원
        </div>

        <div className="absolute top-[230px] left-[33px] font-light text-black text-2xl">
          현재 상태 :&nbsp;&nbsp;
          {isSold === "on_sale" ? "판매중" : isSold === "sold_out" ? "판매 완료" : "판매 취소"}
        </div>

        <Separator className="absolute top-[277px] w-[428px] bg-[#cccccc] left-0" />

        <div className="absolute top-[295px] left-[33px] font-normal text-black text-2xl">입찰</div>

        <BidToPost postId={postId} isDisabled={isBidDisabled} />

        <Separator className="absolute top-[553px] w-[428px] bg-[#cccccc] left-0" />

        {isSold === "on_sale" && isOwner && (
          <div className="flex items-center gap-1.5 absolute top-[567px] left-[255px]">
            <Edit className="w-6 h-6" />
            <button
              onClick={onClickEdit}
              className="relative font-normal text-uusj-theme-schemes-outline text-xl underline cursor-pointer"
            >
              게시물 수정
            </button>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <DialogReport postId={postId} reportedUserId={postOwnerId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ItemBidCard);
