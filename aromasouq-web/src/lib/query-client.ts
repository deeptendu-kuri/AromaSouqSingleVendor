import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on component mount
      refetchOnReconnect: false, // Don't refetch on network reconnect
      retry: 1,
    },
  },
})
