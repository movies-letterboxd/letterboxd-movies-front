import { useEffect } from "react"
import { createPortal } from "react-dom"
import cls from "../../utils/cls"

interface Props {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onCancel: () => void
  onConfirm: () => void
  danger?: boolean
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onCancel,
  onConfirm,
  danger = true,
  loading = false
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0f172a] p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-white/70">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={cls("h-10 rounded-md border border-white/15 px-4 text-white hover:bg-white/5")}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cls(
              'h-10 rounded-md px-4 font-medium text-white', 
              danger ? 'bg-red-600 hover:bg-red-600/90' : "bg-blue-600 hover:bg-blue-600/90",
              loading ? 'opacity-90' : 'opacity-100'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}