import type { AxiosError } from "axios";

export const handleApi = async <T>(fn: () => Promise<T>) => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error: unknown) {
    let msg = "오류가 발생했습니다.";

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const responseMessage = axiosError.response;

      // 문자열이면 그대로, 객체면 message 속성 사용
      if (typeof responseMessage?.data === "string") {
        msg = responseMessage?.data;
      } else if (
        typeof responseMessage?.data === "object" &&
        responseMessage?.data !== null &&
        Object.hasOwn(responseMessage.data, "message")
      ) {
        msg = (responseMessage.data as AxiosError).message || msg;
      }
    } else if (error instanceof Error) {
      msg = error.message;
    }

    return { data: null, error: msg };
  }
};

function isAxiosError(error: unknown): error is AxiosError {
  return !!(error as AxiosError).isAxiosError;
}
