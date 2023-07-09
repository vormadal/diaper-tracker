import { useContext, createContext } from 'react'

type ToastConfig = {
  success: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastConfig>({
  success: () => {},
  error: () => {}
})

export const useToast = () => {
  const notify = useContext(ToastContext)
  return notify
}
