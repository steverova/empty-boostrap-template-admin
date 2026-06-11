import { create } from 'zustand'

export type ToastPayload = {
  title?: string
  message?: string
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary'
  autoHide?: number | false
}

type ToastItem = ToastPayload & { id: string }

type ToastState = {
  toasts: ToastItem[]
  show: (t: ToastPayload) => string
  hide: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (t) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9)
    const item: ToastItem = { id, ...t }
    set((s) => ({ toasts: [...s.toasts, item] }))

    const ms = t.autoHide === false ? null : (typeof t.autoHide === 'number' ? t.autoHide : 5000)
    if (ms) {
      setTimeout(() => {
        get().hide(id)
      }, ms)
    }

    return id
  },
  hide: (id) => {
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
  },
  clear: () => set({ toasts: [] }),
}))

export function useToast() {
  const show = useToastStore((s) => s.show)
  const hide = useToastStore((s) => s.hide)
  const clear = useToastStore((s) => s.clear)
  return { show, hide, clear }
}

export default useToastStore
