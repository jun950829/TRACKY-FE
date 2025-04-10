import React from "react"
import { useToast } from "@/hooks/use-toast"

export interface ApiError {
  code?: string
  message: string
}

export interface ErrorToastProps {
  error?: ApiError | null
}

export const ErrorToast = ({ error }: ErrorToastProps) => {
  const { toast } = useToast()

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: error.code ? `Error ${error.code}` : "Error",
        description: error.message,
      })
    }
  }, [error, toast])

  return null
} 