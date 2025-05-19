"use client";

import ItemBidCard from "@/components/common/board/ItemBidCard";
import ItemInfo from "@/components/common/board/ItemInfo";
import ItemInfoTabs from "@/components/common/board/ItemInfoTabs";
import { fetchPostDetail } from "@/services/postService";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";

import React, { useEffect, useMemo, useState } from "react";
import { BidMessage } from "@/types/bid";
import { useBidSocket } from "@/hooks/useBidSocket";
import { getBidList } from "@/services/bid";
import { useQuery } from "@tanstack/react-query";
import { postItem } from "@/types/post";

export default function DetailPageUI() {
  const params = useParams();
  const postId = Number(params?.postId);
  const [bids, setBids] = useState<BidMessage[]>([]);
  const { data: postData, refetch: refetchPostData } = useQuery<postItem>({
    queryKey: ["post", { postId }],
    queryFn: () => fetchPostDetail<postItem>(postId),
  });
  const { data: bidData, refetch: refetchBidData } = useQuery<BidMessage[]>({
    queryKey: ["bid", { postId }],
    queryFn: () => getBidList(postId),
    enabled: !!postId,
  });
  const [nowPrice, setNowPrice] = useState<number>(
    postData?.now_price || postData?.start_price || 0
  );

  useEffect(() => {
    if (bidData && Array.isArray(bidData)) {
      setBids(bidData);
      if (bidData.at(0)?.bid_price)
        setNowPrice(bidData.at(0)?.bid_price || postData?.start_price || 0);
    }
  }, [bidData, postData?.start_price]);

  useEffect(() => {
    if (!postId) {
      console.error("postId가 없습니다. URL을 확인하세요.");
      return;
    }
    refetchPostData();
    refetchBidData();
  }, [postId, refetchBidData, refetchPostData]);

  useEffect(() => {
    console.log(bids);
  }, [bids]);

  useEffect(() => {
    console.log("postData:", postData);
  }, [postData]);
  useBidSocket(postId, (newBid) => {
    setBids((prev) => [newBid, ...prev]);
    setNowPrice(newBid.bid_price);
  });

  const safeHtml = useMemo(
    () => ({ content: postData ? DOMPurify.sanitize(postData.content) : "" }),
    [postData]
  );

  if (!postId) return <div>postId가 없습니다. URL을 확인하세요.</div>;
  if (!postData) return <div>로딩 중...</div>;

  // console.log("writerEmail", postData.email);

  return (
    <div className="relative w-full min-h-screen px-4 bg-[#fefdf6]">
      <div className="pt-[5vh] flex flex-col items-center gap-y-10 xl:flex-row justify-evenly ">
        <ItemInfo images={postData?.images ?? []} />
        {/* 이미지 썸네일부분 */}
        <ItemBidCard
          postId={postId}
          title={postData?.title}
          content={postData?.content}
          startPrice={postData?.start_price}
          instantPrice={postData?.instant_price}
          endDate={postData?.end_date}
          isSold={postData?.is_sold}
          writerId={postData.user_id}
          userId={postData?.user_id}
          nowPrice={nowPrice}
        />
        {/* 입찰 내용 */}
      </div>
      <ItemInfoTabs postId={postId} userId={postData.user_id} data={safeHtml} bids={bids} />
      {/* 입찰 댓글.제품설명.QnA */}
    </div>
  );
}
