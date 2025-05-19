"use client";
import { DialogContent } from "@/components/ui/dialog";
import { memo, MouseEvent, useCallback, useMemo, useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

function DialogWrapper() {
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const handleChangeModal = useCallback((e?: MouseEvent<HTMLButtonElement>) => {
    setIsFirst((prev) => !prev);
    console.log(e);
  }, []);
  const modalContent = useMemo(() => {
    return isFirst ? (
      <SignupModal handleChangeModal={handleChangeModal} />
    ) : (
      <LoginModal handleChangeModal={handleChangeModal} />
    );
  }, [handleChangeModal, isFirst]);

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <DialogContent
        className="overflow-hidden w-[1012px] h-[654px] border-0 shadow-lg"
        style={{
          maxWidth: "unset",
          maxHeight: "unset",
          width: "1012px",
          height: "654px",
        }}
      >
        {modalContent}
      </DialogContent>
    </div>
  );
}

export default memo(DialogWrapper);
