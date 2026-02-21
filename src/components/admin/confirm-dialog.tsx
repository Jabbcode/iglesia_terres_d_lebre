"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { AlertTriangle, Trash2, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfirmVariant = "danger" | "warning" | "info"

interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider")
  }
  return context.confirm
}

interface ConfirmDialogProviderProps {
  children: React.ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setOpen(true)

    return new Promise((resolve) => {
      setResolveRef(() => resolve)
    })
  }, [])

  const handleConfirm = () => {
    setOpen(false)
    resolveRef?.(true)
  }

  const handleCancel = () => {
    setOpen(false)
    resolveRef?.(false)
  }

  const getIcon = () => {
    switch (options?.variant) {
      case "danger":
        return <Trash2 className="size-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="size-6 text-amber-500" />
      case "info":
      default:
        return <Info className="size-6 text-blue-500" />
    }
  }

  const getConfirmButtonStyle = () => {
    switch (options?.variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "warning":
        return "bg-amber hover:bg-amber-dark text-white"
      case "info":
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white"
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-gray-100">
              {getIcon()}
            </div>
            <DialogTitle className="text-center">
              {options?.title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {options?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="min-w-[100px]"
            >
              {options?.cancelLabel || "Cancelar"}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`min-w-[100px] ${getConfirmButtonStyle()}`}
            >
              {options?.confirmLabel || "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}
