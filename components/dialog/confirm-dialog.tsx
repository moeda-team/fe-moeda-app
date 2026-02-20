"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void

  title?: string
  description?: React.ReactNode

  /** label tombol */
  confirmText?: string
  cancelText?: string

  /** style tombol confirm */
  confirmVariant?: "default" | "destructive"

  /** loading / disabled state */
  loading?: boolean

  /** handler */
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
