'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
}

interface ParticleNetworkProps {
  particleCount?: number
  maxDistance?: number
  particleSize?: number
  lineOpacity?: number
  speed?: number
}

export function ParticleNetwork({
  particleCount = 50,
  maxDistance = 150,
  particleSize = 2,
  lineOpacity = 0.08,
  speed = 0.3
}: ParticleNetworkProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [connections, setConnections] = useState<Array<{ from: Particle; to: Particle; distance: number }>>([])

  // 初期化: パーティクルを生成
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }))

    setParticles(initialParticles)
  }, [dimensions, particleCount, speed])

  // アニメーションループ: パーティクルを移動
  useEffect(() => {
    if (particles.length === 0) return

    const animate = () => {
      setParticles((prevParticles) => {
        const newParticles = prevParticles.map((particle) => {
          let { x, y, vx, vy } = particle

          // 位置更新
          x += vx
          y += vy

          // 壁で跳ね返る
          if (x <= 0 || x >= dimensions.width) vx *= -1
          if (y <= 0 || y >= dimensions.height) vy *= -1

          return { ...particle, x, y, vx, vy }
        })

        // 接続を計算
        const newConnections: Array<{ from: Particle; to: Particle; distance: number }> = []
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const dx = newParticles[i].x - newParticles[j].x
            const dy = newParticles[i].y - newParticles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < maxDistance) {
              newConnections.push({
                from: newParticles[i],
                to: newParticles[j],
                distance
              })
            }
          }
        }
        setConnections(newConnections)

        return newParticles
      })
    }

    const intervalId = setInterval(animate, 1000 / 60) // 60 FPS

    return () => clearInterval(intervalId)
  }, [particles.length, dimensions, maxDistance])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
        {/* 接続線 */}
        {connections.map(({ from, to, distance }, index) => {
          const opacity = lineOpacity * (1 - distance / maxDistance)
          return (
            <line
              key={`line-${index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              strokeWidth="1"
              opacity={opacity}
              className="text-blue-500 dark:text-blue-400"
            />
          )
        })}

        {/* パーティクル */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particleSize}
            fill="currentColor"
            className="text-blue-500 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />
        ))}
      </svg>
    </div>
  )
}
