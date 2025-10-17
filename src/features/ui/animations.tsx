'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
