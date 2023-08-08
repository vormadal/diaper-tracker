import { useEffect, useRef, useState } from 'react'

type loaderType<T, A> = (arg?: A) => Promise<T | undefined>
type UseDataContent<T, A> = [
  {
    error?: string
    loading: boolean
    data?: T
  },
  (arg?: A) => Promise<void>,
  (data?: T) => void
]

function rand() {
  return Math.random().toString(36).substring(2) // remove `0.`
}

function token() {
  return rand() + rand() // to make it longer
}

export const useData = <T, A>(loader: loaderType<T, A>, initialArg?: A): UseDataContent<T, A> => {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()

  const t = useRef('')

  const load = async (arg?: A) => {
    const myToken = token()
    t.current = myToken

    setLoading(true)
    setError(undefined)
    try {
      const result = await loader(arg)
      if (t.current === myToken) setData(result)
    } catch (e: any) {
      setError(e?.response?.Title ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(initialArg)
  }, [initialArg])

  const reload = async (args?: A, obj?: T) => {
    if (args && (args as A)) {
      load(args)
    } else if (initialArg) {
      load(initialArg)
    } else {
      load()
    }
  }

  return [{ error, loading, data }, reload, setData]
}
