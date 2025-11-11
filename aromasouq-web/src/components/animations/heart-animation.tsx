'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface HeartAnimationProps {
  isActive: boolean
  onClick: () => void
  className?: string
}

export function HeartAnimation({ isActive, onClick, className = '' }: HeartAnimationProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className}`}
      whileTap={{ scale: 0.8 }}
      aria-label="Toggle wishlist"
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-6 w-6 transition-all ${
            isActive ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`}
        />
      </motion.div>

      {/* Particle burst effect when favorited */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-400 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 4) * 20,
                y: Math.sin((i * Math.PI) / 4) * 20,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.button>
  )
}
