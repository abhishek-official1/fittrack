'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
  timeout?: number
}

interface UseApiState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
  retry: () => Promise<T | null>
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
    timeout = 30000,
  } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  const lastArgsRef = useRef<unknown[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  const executeWithRetry = useCallback(
    async (args: unknown[], retriesLeft: number): Promise<T | null> => {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        })

        // Race between API call and timeout
        const result = await Promise.race([
          apiFunction(...args),
          timeoutPromise,
        ])

        if (!mountedRef.current) return null

        setState({
          data: result,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        })

        onSuccess?.(result)
        return result
      } catch (error) {
        if (!mountedRef.current) return null

        const err = error instanceof Error ? error : new Error(String(error))

        // Check if we should retry
        if (retriesLeft > 0 && !err.message.includes('abort')) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          
          if (!mountedRef.current) return null
          
          // Exponential backoff
          return executeWithRetry(args, retriesLeft - 1)
        }

        setState({
          data: null,
          error: err,
          isLoading: false,
          isError: true,
          isSuccess: false,
        })

        onError?.(err)
        return null
      }
    },
    [apiFunction, onSuccess, onError, retryDelay, timeout]
  )

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      // Cancel any pending request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      lastArgsRef.current = args

      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }))

      return executeWithRetry(args, retryCount)
    },
    [executeWithRetry, retryCount]
  )

  const retry = useCallback(async (): Promise<T | null> => {
    return execute(...lastArgsRef.current)
  }, [execute])

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
    retry,
  }
}

// Simplified fetch wrapper with retry logic
interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  timeout?: number
}

export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { retries = 3, retryDelay = 1000, timeout = 30000, ...fetchOptions } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`)
      }

      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on abort or client errors (4xx)
      if (lastError.name === 'AbortError') {
        break
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        )
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Request failed',
  }
}

// Hook for data fetching with automatic retry
export function useFetch<T>(url: string | null, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!url) return

    setIsLoading(true)
    setError(null)

    const result = await fetchWithRetry<T>(url, options)

    if (result.success && result.data) {
      setData(result.data as T)
    } else {
      setError(result.error || 'Failed to fetch data')
    }

    setIsLoading(false)
  }, [url, options])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, error, isLoading, refetch }
}
