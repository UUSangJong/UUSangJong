"use client";
import { useBoardItemList } from "@/store/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from "react";

function NavPanel() {
  const searchParams = useSearchParams();
  const { getNavPanelInfo } = useBoardItemList();
  const { nextID, prevID, currentIndex, totalCount } = getNavPanelInfo();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const isPreview = searchParams.get("isPreview");
  const isEdit = searchParams.get("isEdit");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePrevPage = useCallback(() => {
    if (prevID) router.push(`${prevID}`);
  }, [prevID, router]);

  const handleNextPage = useCallback(() => {
    if (nextID) router.push(`${nextID}`);
  }, [nextID, router]);

  const CountNavigation = useMemo(
    () => `${currentIndex + 1} of ${totalCount}`,
    [currentIndex, totalCount]
  );
  const prevDisabled = useMemo(() => prevID === undefined, [prevID]);
  const nextDisabled = useMemo(() => nextID === undefined, [nextID]);

  if (!isHydrated)
    return (
      <div className="flex items-center gap-[5px] invisible">
        {/* 미스매치를 방지하기 위해 크기 유지용 뼈대 렌더 */}
        <button disabled>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="w-[88px] text-2xl text-center">&nbsp;</span>
        <button disabled>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );

  return isPreview || isEdit ? (
    <Fragment></Fragment>
  ) : (
    <div className="flex items-center gap-[5px]">
      <button onClick={handlePrevPage} disabled={prevDisabled}>
        <ChevronLeft className="w-6 h-6" />
      </button>
      <span className="w-[88px] [font-family:'Julius_Sans_One-Regular',Helvetica] font-normal text-black text-2xl text-center">
        {CountNavigation}
      </span>
      <button onClick={handleNextPage} disabled={nextDisabled}>
        <ChevronRight className="w-6 h-6" onClick={handleNextPage} />
      </button>
    </div>
  );
}

export default memo(NavPanel);
