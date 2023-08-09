import { useContext, createContext } from 'react'
import { MessageOptions } from '../components/shared/Toast'

type ToastConfig = {
  success: (message: string, options?: MessageOptions) => void
  error: (message: string, options?: MessageOptions) => void
}

export const ToastContext = createContext<ToastConfig>({
  success: () => {},
  error: () => {}
})

export const useToast = () => {
  const notify = useContext(ToastContext)
  return notify
}
