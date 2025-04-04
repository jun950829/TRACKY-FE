import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"

export interface CommonModalProps {
  open: boolean
  onClose: () => void;
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  showCancel?: boolean
}

export const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title = "알림",
  description = "",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  showCancel = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          {showCancel && (
            <CustomButton variant="outline" onClick={onClose}>
              {cancelText}
            </CustomButton>
          )}
          <CustomButton onClick={() => {
            onConfirm?.()
            onClose()
          }}>{confirmText}</CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CommonModal
