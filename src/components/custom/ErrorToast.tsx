import React from "react"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/types/error"

interface ErrorToastProps {
  error: ApiError
}

export const ErrorToast = ({ error }: ErrorToastProps) => {
  const { toast } = useToast()

  React.useEffect(() => {
    console.log("ErrorToast triggered with error:", error)
    toast({
      variant: "destructive",
      title: error.code ? `Error ${error.code}` : "Error",
      description: error.message,
      duration: 5000,
    })
  }, [error, toast])

  return null
} 