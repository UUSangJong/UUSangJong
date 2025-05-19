import axios from "@/utils/http-commons";
import { BoardType } from "./postService";

export interface UploadPostImageInput {
  postId: number;
  image: File;
}

export interface UploadPostImageResponse {
  message: string;
}

export interface deletePostImageInput {
  image_id: number;
}

export interface PostImage {
  image_id: number;
  post_id: number;
  url: string;
}
export const getBoardList = async (): Promise<BoardType[]> => {
  const { data } = await axios.get<BoardType[]>("/post");
  return data;
};

//이미지 삭제
export const deletePostImage = async (image_id: number): Promise<string> => {
  const { data } = await axios.delete(`/post/image/delete/${image_id}`);
  return data;
};

//이미지 조회
export const getPostImage = async (post_id: number): Promise<PostImage[]> => {
  const { data } = await axios.get<PostImage[]>(`/post/image/${post_id}`);
  return data;
};

//게시글 이미지 업로드
export const uploadPostImage = async (
  params: UploadPostImageInput
): Promise<UploadPostImageResponse> => {
  const { postId, image } = params;

  const formData = new FormData();
  formData.append("file", image); // 'image'라는 키로 파일 추가
  console.log("formData", image.size);

  const response = await axios.post<UploadPostImageResponse>(
    `/post/${postId}`, // URL: /post/{postId}/image
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // FormData 전송시 필요
      },
      maxContentLength: 10 * 1024 * 1024, // 10MB
      maxBodyLength: 20 * 1024 * 1024, // 20MB
    }
  );

  return response.data;
};
