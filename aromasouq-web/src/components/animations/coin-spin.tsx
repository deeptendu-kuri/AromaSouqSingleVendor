'use client'

import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'

interface CoinSpinProps {
  amount: number
  trigger?: boolean
}

export function CoinSpin({ amount, trigger }: CoinSpinProps) {
  return (
    <motion.div
      className="flex items-center gap-2 text-oud-gold"
      animate={trigger ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={trigger ? { rotateY: [0, 360] } : { rotateY: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Coins className="h-5 w-5" />
      </motion.div>
      <span className="font-medium">{amount} coins</span>
    </motion.div>
  )
}
