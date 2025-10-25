'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params: Record<string, unknown>) => void
  }
}

/**
 * Web Vitals measurement component
 *
 * Measures and logs Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint): Time to render largest content element
 * - INP (Interaction to Next Paint): Responsiveness to user interactions (replaced FID)
 * - CLS (Cumulative Layout Shift): Visual stability measure
 * - FCP (First Contentful Paint): Time to first content render
 * - TTFB (Time to First Byte): Server response time
 *
 * In production, these metrics can be sent to analytics services
 * for monitoring and optimization.
 */
export function WebVitals() {
  useEffect(() => {
    // Send to console in development, replace with analytics in production
    const sendToAnalytics = (metric: { name: string; value: number; rating: string; delta: number; id: string }) => {
      // In development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating,
          delta: Math.round(metric.delta),
          id: metric.id
        })
      }

      // In production, send to Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating
        })
      }

      // Example: Vercel Analytics
      // if (window.va) {
      //   window.va('event', {
      //     name: metric.name,
      //     data: {
      //       value: metric.value,
      //       rating: metric.rating,
      //     },
      //   });
      // }
    }

    // Measure Core Web Vitals
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)

    // Additional metrics
    onFCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }, [])

  return null
}
