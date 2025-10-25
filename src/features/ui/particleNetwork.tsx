'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

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

/**
 * デバイス性能に基づいてパーティクル数を調整
 */
function getOptimalParticleCount(requestedCount: number): number {
  // SSR対応: windowが存在しない場合はデフォルト値を返す
  if (typeof window === 'undefined') {
    return requestedCount
  }

  // CPU コア数を取得（利用可能な場合）
  const cores = navigator.hardwareConcurrency || 4

  // デバイスピクセル比（高解像度ディスプレイの検出）
  const pixelRatio = window.devicePixelRatio || 1

  // パフォーマンス調整係数
  let factor = 1

  // 低性能デバイス（2コア以下）
  if (cores <= 2) {
    factor = 0.5
  }
  // 中性能デバイス（3-4コア）
  else if (cores <= 4) {
    factor = 0.7
  }
  // 高性能デバイス（5コア以上）
  else {
    factor = 1
  }

  // 高解像度ディスプレイでは負荷が高いため調整
  if (pixelRatio > 2) {
    factor *= 0.8
  } else if (pixelRatio > 1.5) {
    factor *= 0.9
  }

  return Math.max(20, Math.floor(requestedCount * factor))
}

/**
 * デバイス性能に基づいて目標FPSを決定
 */
function getTargetFPS(): number {
  // SSR対応: windowが存在しない場合はデフォルト値を返す
  if (typeof window === 'undefined') {
    return 60
  }

  const cores = navigator.hardwareConcurrency || 4

  // 低性能デバイスは30FPS、それ以外は60FPS
  return cores <= 2 ? 30 : 60
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
  const [isVisible, setIsVisible] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastFrameTimeRef = useRef<number>(0)
  const optimalParticleCount = useRef<number>(getOptimalParticleCount(particleCount))
  const targetFPS = useRef<number>(getTargetFPS())

  // Intersection Observer でコンポーネントの表示状態を監視
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1 // 10%以上表示されたらアニメーション開始
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

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

    const initialParticles: Particle[] = Array.from({ length: optimalParticleCount.current }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }))

    setParticles(initialParticles)
  }, [dimensions, speed])

  // アニメーションループ: パーティクルを移動（requestAnimationFrame使用）
  useEffect(() => {
    if (particles.length === 0 || !isVisible) {
      // 画面外の場合はアニメーションを停止
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const frameInterval = 1000 / targetFPS.current // ミリ秒単位のフレーム間隔

    const animate = (currentTime: number) => {
      // フレームレート制御
      if (currentTime - lastFrameTimeRef.current < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameTimeRef.current = currentTime

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

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particles.length, dimensions, maxDistance, isVisible])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
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
