"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/services/userInfo";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserForm } from "@/types/userInfo";
import { handleApi } from "@/utils/handleApi";
import { useUser } from "@/hooks/useUser";
import AlertDialogComponent from "@/components/common/AlertDialog";

export default function UpdateInfoPage() {
  const router = useRouter();
  const { userInfo } = useUser();

  const original = userInfo ?? {
    email: "",
    realname: "",
    nickname: "",
  };

  const [form, setForm] = useState<UserForm>({
    email: "",
    realname: "",
    nickname: "",
    password: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const { email, realname, nickname } = userInfo;
      setForm({ email, realname, nickname, password: "" });
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const updateFields: Record<string, string> = {};

    for (const key in form) {
      const value = form[key as keyof typeof form];
      const trimmed = value ? (value as string).trim() : "";
      const isChanged = trimmed !== original[key as keyof typeof original];
      if (trimmed !== "" && (key === "password" || isChanged)) {
        updateFields[key] = trimmed;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      toast.warning("변경된 항목이 없습니다.");
      return;
    }

    const { data, error } = await handleApi(() => updateUser(updateFields));

    if (data) {
      toast.success("회원정보가 성공적으로 업데이트되었습니다.");
      router.push("/mypage");
      return;
    }
    if (error) {
      toast.warning(error);
      return;
    }
  };

  return (
    <div className="flex justify-center py-20 bg-[#fefdf6] min-h-screen">
      <div className="w-[340px] space-y-10">
        {["email", "realname", "nickname"].map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm text-gray-500 capitalize">
              {field.replace("_", " ")}
            </label>
            <Input
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="border-b border-gray-300 px-2 rounded-none focus-visible:ring-0"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-sm text-gray-500">New Password</label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="변경할 비밀번호 입력 해주세요."
            className="border-b border-gray-300 px-2 rounded-none focus-visible:ring-0"
          />
        </div>

        <Button
          className="w-full h-[60px] mt-6 bg-[#222] text-white text-xl font-semibold rounded-[10px] hover:bg-[#666666]"
          onClick={() => setShowDialog(true)}
        >
          UPDATE
        </Button>

        <AlertDialogComponent
          open={showDialog}
          onOpenChange={setShowDialog}
          title="회원정보를 업데이트할까요?"
          description="변경된 내용을 저장합니다."
          onConfirm={handleUpdate}
        />
      </div>
    </div>
  );
}
