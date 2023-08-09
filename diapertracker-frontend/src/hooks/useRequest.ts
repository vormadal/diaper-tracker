import { useCallback, useState } from 'react'

interface RequestStatus {
  loading: boolean
  error: string
}

type RequestAction = <T>(action: () => T | Promise<T>) => Promise<{ success: boolean; data: T | undefined }>

export function useRequest(): [RequestStatus, RequestAction] {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = useCallback(async <T>(action: () => T | Promise<T>) => {
    setLoading(true)
    setError('')
    let result: T | undefined = undefined
    let hasError = false
    try {
      result = await action()
    } catch (e: any) {
      hasError = true
      setError(e.message)
    } finally {
      setLoading(false)
    }
    return { data: result, success: !hasError }
  }, [])
  return [{ loading, error }, send]
}
