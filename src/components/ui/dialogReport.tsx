import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { createReport } from "@/services/report";
import { useRouter } from "next/navigation";
import { DialogRepoerProps } from "@/types/report";
import { useUser } from "@/hooks/useUser";

export function DialogReport({ postId, reportedUserId }: Partial<DialogRepoerProps>) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const router = useRouter();

  const onClickReportCancel = () => {
    setOpen(false);
  };

  console.log("postId:", postId);

  const { userInfo } = useUser();

  const reporterId = userInfo?.user_id || null;

  const onClickReportSubmit = async () => {
    if (!reporterId) {
      alert("로그인 후 신고 가능합니다.");
      return;
    }

    if (!content || content.trim() === "") {
      alert("신고 내용을 입력해주세요.");
      return;
    }

    const reportData = {
      post_id: postId!, // 게시물 ID
      reported_user_id: reportedUserId!, // 신고된 사용자 ID
      content: content, // 신고 내용
      // created_at: new Date().toLocaleDateString(), // 신고 날짜
      reporter_id: reporterId,
    };
    if (!content || content.trim() === "") {
      alert("신고 내용을 입력해주세요.");
      return;
    } else
      try {
        await createReport(reportData);
        alert("신고가 완료되었습니다.");
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error("신고 실패:", error);
        alert("신고에 실패했습니다. 다시 시도해주세요.");
      }
  };

  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <AlertTriangle className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <div className="-mx-6 w-auto border-b border-gray-300 shadow-sm"></div>
          {/* <DialogDescription>신고할 내용을 입력해주세요.</DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right"></Label>
            <textarea
              id="name"
              //   value="내용을 입력해 주세요."
              className="col-span-4 w-full h-[209px] border rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#4C4528]"
              onChange={onChangeContent}
              placeholder="신고 내용을 입력해 주세요."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter className="flex gap-[30px]">
          <button
            onClick={onClickReportCancel}
            type="button"
            className="text-[#777777] w-[135px] border-b border-[#777777] hover:text-black cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            className="bg-red-500 w-[135px] text-white mr-[40px] hover:text-black cursor-pointer"
            onClick={onClickReportSubmit}
          >
            신고하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
