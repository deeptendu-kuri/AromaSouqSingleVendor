'use client'

import { motion, useAnimation } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useEffect } from 'react'

interface CartShakeProps {
  itemCount: number
  triggerShake?: boolean
}

export function CartShake({ itemCount, triggerShake }: CartShakeProps) {
  const controls = useAnimation()

  useEffect(() => {
    if (triggerShake) {
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 },
      })
    }
  }, [triggerShake, controls])

  return (
    <motion.div className="relative" animate={controls}>
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-oud-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {itemCount}
        </motion.span>
      )}
    </motion.div>
  )
}
