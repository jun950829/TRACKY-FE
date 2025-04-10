import { AxiosError } from "axios"

export interface ApiError {
  code?: string
  message: string
}

export interface ApiErrorResponse {
  status: number
  data?: {
    message?: string
  }
  message?: string
}

export const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
}

export const createApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return {
      code: error.response?.status?.toString() || '500',
      message: error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.'
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.'
    }
  }

  return {
    message: '알 수 없는 오류가 발생했습니다.'
  }
} 