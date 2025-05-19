"use client";
import { useRef, useState, useEffect } from "react";
import WritePageUI from "@/components/page-component/WritePageUI";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/createPost";
import { updatePost, fetchPostDetail, cancelPost } from "@/services/postService";
import {
  getPostImage,
  PostImage,
  uploadPostImage,
  deletePostImage,
} from "@/services/uploadPostImage";
import { useParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
import { postItem } from "@/types/post";

export interface FormError {
  title: string;
  price: string;
  startPrice: string;
  contents: string;
  images: string;
}

interface PostImageType {
  url: string;
  type: "server" | "local";
  image_id?: number;
}

// console.log("edit content:", content);
export default function WritePage({ isEdit }: { isEdit: boolean }) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isCancle, setIsCancle] = useState(false);
  const [formError, setFormError] = useState<FormError>({
    title: "",
    price: "",
    startPrice: "",
    contents: "",
    images: "",
  });
  const [form, setForm] = useState({
    title: "",
    price: "",
    startPrice: "",
    contents: "",
    endDate: format(addDays(new Date(Date.now()), 1), "yyyy-MM-dd"),
  });
  const [images, setImages] = useState<PostImage[]>([]);
  const [deletedImage, setDeletedImage] = useState<number[]>([]);
  const { postId } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  //게시물
  useEffect(() => {
    if (isEdit && postId) {
      fetchPostDetail<postItem>(Number(postId))
        .then((data) => {
          setForm({
            title: data.title ?? "",
            price: String(data.instant_price ?? "0"),
            startPrice: String(data.start_price ?? "0"),
            contents: data.content ?? "",
            endDate: data.end_date.slice(0, 10),
          });
          if (data.is_sold === "cancelled") setIsCancle(true);
          {
          }
        })
        .catch((error) => {
          console.error("게시물 불러오기 실패:", error);
        });
    }
  }, [isEdit, postId]);

  //이미지
  useEffect(() => {
    if (postId) {
      getPostImage(Number(postId)).then(setImages);
    }
  }, [postId]);
  useEffect(() => {
    if (isEdit && images.length > 0) {
      const exUrls = images.map((image) => image.url);
      setPreviewUrls(exUrls);
    }
  }, [isEdit, images]);

  //로컬 이미지 삭제
  const onClickDeleteImage = (index: number, type: "server" | "local", image_id?: number) => {
    if (type === "server" && image_id && typeof image_id === "number") {
      console.log("aaa:", image_id);
      setImages((prev) => prev.filter((img) => img.image_id !== image_id && image_id > 0));
      setDeletedImage((prev) => [...prev, image_id]);
    }
    if (type === "local") {
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const selectedFiles = Array.from(files).slice(0, 5 - imageFiles.length);
    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
    setFormError((prev) => ({ ...prev, images: "" })); // 이미지 에러 즉시 제거
  };

  const onClickButton = async () => {
    const totalImages = images.length + imageFiles.length;
    const errors = {
      title: form.title ? "" : "제목을 입력해주세요.",
      startPrice: form.startPrice ? "" : "시작가를 입력해주세요.",
      price: form.price ? "" : "즉시구매 가격을 입력해주세요.",
      contents: form.contents ? "" : "내용을 입력해주세요.",
      images: totalImages > 0 ? "" : "이미지는 1개 이상 등록해주세요.",
    };

    const hasError = Object.values(errors).some((msg) => msg !== "");
    if (hasError) {
      setFormError(errors);
      toast.error("필드를 확인해 주세요.");
      return;
    }

    try {
      let createdPostId = Number(postId);

      if (isEdit) {
        //삭제 먼저..
        if (isEdit && deletedImage.length > 0) {
          console.log("삭제목록:", deletedImage);
          Promise.all(
            deletedImage.map((imageId) => {
              console.log("qqq:", imageId);
              return deletePostImage(imageId);
            })
          );
        }
        // 게시글 수정..
        await updatePost({
          post_id: createdPostId,
          title: form.title,
          content: form.contents,
          start_price: Number(form.startPrice),
          instant_price: Number(form.price),
          end_date: form.endDate,
          is_sold: "on_sale",
        });
        // 새 이미지 업로드
        if (imageFiles.length > 0) {
          for (const file of imageFiles) {
            await uploadPostImage({ postId: createdPostId, image: file });
          }
        }

        alert("수정 완료");
      } else {
        const response = await createPost({
          title: form.title,
          content: form.contents,
          start_price: Number(form.startPrice),
          instant_price: Number(form.price),
          end_date: form.endDate,
          is_sold: "on_sale",
        });

        if (!response?.postId) {
          toast.error("게시물 등록 실패");
          return;
        }

        createdPostId = response.postId;

        if (imageFiles.length > 0) {
          for (const file of imageFiles) {
            await uploadPostImage({ postId: createdPostId, image: file });
          }
        }

        toast.success("등록 완료");
      }

      router.push(`/board/${createdPostId}?isPreview=true`);
    } catch (err: unknown) {
      console.error(err);
      toast.error(`오류: ${err as FormError}`);
    }
  };

  const onClickBUttonBack = () => {
    router.push("/board");
  };

  const onClickButtonCancle = async () => {
    try {
      await cancelPost(Number(postId));
      toast.success("경매가 취소되었습니다.");
      setIsCancle(true);
      router.push(`/board/${postId}`);
      console.log("pi", postId);
    } catch (error) {
      console.error("경매 취소 실패:", error);
      toast.error("경매 취소 실패했습니다.");
    }
  };

  // 실시간 입력 시 해당 필드 에러 제거
  const onChangeForm = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };

  const onChangeContents = (html: string) => {
    setForm((prev) => ({ ...prev, contents: html }));
    setFormError((prev) => ({ ...prev, contents: "" }));
  };

  const onClickImageUpload = () => {
    fileInputRef.current?.click();
  };

  //서버 | 로컬 이미지 데이터 통합
  const serverLocalImages: PostImageType[] = [
    ...images.map(
      (image) =>
        ({
          url: image.url,
          type: "server",
          image_id: image.image_id,
        } as PostImageType)
    ),
    ...imageFiles.map(
      (file) =>
        ({
          url: URL.createObjectURL(file),
          type: "local",
        } as PostImageType)
    ),
  ];

  return (
    <WritePageUI
      imageUrls={previewUrls}
      onClickImageUpload={onClickImageUpload}
      onChangeFile={onChangeFile}
      fileInputRef={fileInputRef}
      onClickButton={onClickButton}
      onClickBUttonBack={onClickBUttonBack}
      onClickButtonCancle={onClickButtonCancle}
      onChangeForm={onChangeForm}
      onClickDeleteImage={onClickDeleteImage}
      onChangeContents={onChangeContents}
      isEdit={isEdit}
      form={form}
      formError={formError}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
      isCancle={isCancle}
      serverLocalImages={serverLocalImages}
    />
  );
}
