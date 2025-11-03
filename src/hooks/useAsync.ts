import { useEffect, useState, useCallback } from 'react'

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
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await asyncFunction()
      setState({ data: response, loading: false, error: null })
      options.onSuccess?.(response)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      options.onError?.(err)
    }
  }, [asyncFunction, options])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    ...state,
    refetch: execute,
  }
}
