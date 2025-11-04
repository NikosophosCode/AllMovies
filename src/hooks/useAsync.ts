import { useEffect, useState, useCallback, useRef } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
  cache?: boolean
  cacheTtl?: number
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options: UseAsyncOptions = {}
): AsyncState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const asyncFunctionRef = useRef(asyncFunction)
  const optionsRef = useRef(options)

  // Actualizar refs cuando cambien
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction
    optionsRef.current = options
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await asyncFunctionRef.current()
      setState({ data: response, loading: false, error: null })
      optionsRef.current.onSuccess?.(response)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      optionsRef.current.onError?.(err)
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate])

  return {
    ...state,
    refetch: execute,
  }
}
