import { ApiError, ErrorToastProps } from "@/types/error";
import { ErrorToast } from "@/components/custom/ErrorToast";

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    ErrorToast({ message: error.message });
    return;
  }
  
  if (error instanceof Error) {
    ErrorToast({ message: error.message });
    return;
  }

  ErrorToast({ message: "알 수 없는 오류가 발생했습니다." });
};

export const createApiError = (message: string, status?: number): ApiError => {
  return new ApiError(message, status);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
}; 