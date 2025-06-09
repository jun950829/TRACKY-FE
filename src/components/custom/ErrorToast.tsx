import React from "react"
import { useToast } from "@/hooks/use-toast"

interface ErrorToastProps {
  message: string;
  description?: string;
}

export const ErrorToast = ({ message, description }: ErrorToastProps) => {
  const { toast } = useToast()

  React.useEffect(() => {
    toast({
      variant: "destructive",
      title: "Error",
      description: description || message,
      duration: 5000,
    })
  }, [message, description, toast])

  return null
} 