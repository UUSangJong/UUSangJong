"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function NoonRefresher() {
  useEffect(() => {
    const now = new Date();
    const nextNoon = new Date();
    const oneMinuteBefore = new Date();

    // 다음 정오(12:00:00)로 설정
    nextNoon.setHours(12, 0, 0, 0);
    if (now.getHours() >= 12) {
      // 이미 정오 지난 경우 내일로 넘기기
      nextNoon.setDate(now.getDate() + 1);
    }

    oneMinuteBefore.setTime(nextNoon.getTime());
    oneMinuteBefore.setMinutes(oneMinuteBefore.getMinutes() - 1); // 11:59

    const timeUntilNoon = nextNoon.getTime() - now.getTime();
    const timeUntilAlert = oneMinuteBefore.getTime() - now.getTime();

    const alertTimer = setTimeout(() => {
      toast.info("잠시 후 정오입니다. 1분 뒤 페이지가 새로고침됩니다.");
    }, timeUntilAlert);

    const reloadTimer = setTimeout(() => {
      window.location.reload();

      // 이후 매일 정오마다 새로고침 반복
      setInterval(() => {
        window.location.reload();
      }, 1000 * 60 * 60 * 24);
    }, timeUntilNoon);

    return () => {
      clearTimeout(alertTimer);
      clearTimeout(reloadTimer);
    };
  }, []);

  return null;
}
