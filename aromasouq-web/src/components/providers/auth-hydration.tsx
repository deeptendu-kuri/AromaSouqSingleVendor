'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

/**
 * Component that handles one-time hydration of the auth store from localStorage
 * This prevents SSR/CSR hydration mismatches and should be mounted once in the root layout
 */
export function AuthHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Only hydrate once on client-side mount
    if (!hydrated && typeof window !== 'undefined') {
      useAuthStore.persist.rehydrate()
      setHydrated(true)
    }
  }, [hydrated])

  return null
}
