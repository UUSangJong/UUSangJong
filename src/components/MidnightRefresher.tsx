"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MidnightRefresher() {
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date();
    const oneMinuteBefore = new Date();

    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    oneMinuteBefore.setDate(now.getDate() + 1);
    oneMinuteBefore.setHours(0, 0, 0, 0);
    oneMinuteBefore.setMinutes(-1);

    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
    const timeUntilAlert = oneMinuteBefore.getTime() - now.getTime();

    const alertTimer = setTimeout(() => {
      toast.info("잠시 후 자정입니다. 페이지가 새로고침됩니다.");
    }, timeUntilAlert);

    const reloadTimer = setTimeout(() => {
      window.location.reload();
      setInterval(() => {
        window.location.reload();
      }, 1000 * 60 * 60 * 24);
    }, timeUntilMidnight);

    return () => {
      clearTimeout(alertTimer);
      clearTimeout(reloadTimer);
    };
  }, []);

  return null; // 화면에 표시할 내용은 없음
}
