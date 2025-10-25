import { ComponentType } from 'react'

/**
 * Custom SVG icons for technologies not available in react-icons
 * These are lightweight alternatives to avoid large bundle sizes from icon libraries
 */

export interface CustomIconProps {
  size?: number | string
  color?: string
  className?: string
}

/**
 * Playwright icon - Custom SVG implementation
 * Based on the official Playwright logo
 */
export const PlaywrightIcon: ComponentType<CustomIconProps> = ({ size = 24, color = '#2EAD33', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8V16M8 10L12 12L16 10M8 14L12 16L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
