import type { Meta, StoryObj } from '@storybook/react'
import { FadeIn, StaggerContainer, StaggerItem } from './animations'

/**
 * FadeIn Component Stories
 */
const fadeInMeta = {
  title: 'UI/Animations/FadeIn',
  component: FadeIn,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    delay: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Animation delay in seconds'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
} satisfies Meta<typeof FadeIn>

export default fadeInMeta

type FadeInStory = StoryObj<typeof fadeInMeta>

/**
 * Basic fade-in animation with no delay
 */
export const FadeInDefault: FadeInStory = {
  args: {
    children: (
      <div className="p-8 bg-blue-500 text-white rounded-lg">
        <h2 className="text-2xl font-bold">Fade In Animation</h2>
        <p>This content fades in smoothly</p>
      </div>
    )
  }
}

/**
 * Fade-in animation with 0.5s delay
 */
export const FadeInWithDelay: FadeInStory = {
  args: {
    delay: 0.5,
    children: (
      <div className="p-8 bg-green-500 text-white rounded-lg">
        <h2 className="text-2xl font-bold">Delayed Fade In</h2>
        <p>This content fades in after 0.5 seconds</p>
      </div>
    )
  }
}

/**
 * Multiple fade-in elements with different delays
 */
export const MultipleFadeIns: FadeInStory = {
  render: () => (
    <div className="space-y-4">
      <FadeIn delay={0}>
        <div className="p-4 bg-red-500 text-white rounded">First (no delay)</div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="p-4 bg-orange-500 text-white rounded">Second (0.3s delay)</div>
      </FadeIn>
      <FadeIn delay={0.6}>
        <div className="p-4 bg-yellow-500 text-white rounded">Third (0.6s delay)</div>
      </FadeIn>
    </div>
  )
}

/**
 * StaggerContainer and StaggerItem Stories
 */
type StaggerStory = StoryObj<typeof StaggerContainer>

/**
 * Staggered animation for list items
 */
export const StaggeredList: StaggerStory = {
  render: () => (
    <StaggerContainer className="space-y-2">
      <StaggerItem>
        <div className="p-4 bg-purple-500 text-white rounded">Item 1</div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-4 bg-purple-600 text-white rounded">Item 2</div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-4 bg-purple-700 text-white rounded">Item 3</div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-4 bg-purple-800 text-white rounded">Item 4</div>
      </StaggerItem>
    </StaggerContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Items appear one after another with a stagger delay of 0.1s between each'
      }
    }
  }
}

/**
 * Staggered grid layout
 */
export const StaggeredGrid: StaggerStory = {
  render: () => (
    <StaggerContainer className="grid grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <StaggerItem key={i}>
          <div className="p-6 bg-indigo-500 text-white rounded text-center">
            <span className="text-2xl font-bold">{i + 1}</span>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid items appear with staggered animation for a smooth loading effect'
      }
    }
  }
}

/**
 * Card showcase with staggered animation
 */
export const StaggeredCards: StaggerStory = {
  render: () => (
    <StaggerContainer className="grid grid-cols-2 gap-4 max-w-4xl">
      <StaggerItem>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Card 1</h3>
          <p className="text-neutral-600 dark:text-neutral-300">This is the first card</p>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Card 2</h3>
          <p className="text-neutral-600 dark:text-neutral-300">This is the second card</p>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Card 3</h3>
          <p className="text-neutral-600 dark:text-neutral-300">This is the third card</p>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Card 4</h3>
          <p className="text-neutral-600 dark:text-neutral-300">This is the fourth card</p>
        </div>
      </StaggerItem>
    </StaggerContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card components with staggered entrance animation'
      }
    }
  }
}
