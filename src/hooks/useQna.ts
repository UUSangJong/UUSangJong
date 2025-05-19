import { useCallback, useEffect, useState } from "react";
import { handleApi } from "@/utils/handleApi";
import { Qna } from "@/types/qna";
import { getQnas } from "@/services/qnaService";

//해당 postId에 대한 QnA 목록을 가져오는 커스텀 훅
export const useQna = (postId: number) => {
  const [qnas, setQnas] = useState<Qna[]>([]);

  // 질문/답변 성공 시 onSuccess로 refetch() 실행 → 리스트 갱신됨
  const fetchQna = useCallback(async () => {
    const { data } = await handleApi(() => getQnas(postId));
    if (data) setQnas(data.data); // 백엔드에서 data: [...] 구조로 내려주는 경우
  }, [postId]);

  useEffect(() => {
    fetchQna();
  }, [fetchQna, postId]);

  return { qnas, refetch: fetchQna };
};
