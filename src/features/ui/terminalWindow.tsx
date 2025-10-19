'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'

interface Command {
  prompt?: string
  command: string
  output: string | string[]
  delay?: number
}

interface TerminalWindowProps {
  commands: Command[]
  prompt?: string
}

function Cursor() {
  return (
    <motion.span
      className="inline-block w-2 h-5 bg-green-500 dark:bg-green-400 ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function TerminalHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-300 dark:bg-neutral-800 border-b border-neutral-400 dark:border-neutral-700 rounded-t-lg">
      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-mono font-semibold">
        dev-roar-lab@terminal: ~
      </span>
      <div className="flex gap-3 items-center">
        <button className="w-5 h-5 flex items-center justify-center hover:bg-neutral-400 dark:hover:bg-neutral-700 rounded transition-colors">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs">─</span>
        </button>
        <button className="w-5 h-5 flex items-center justify-center hover:bg-neutral-400 dark:hover:bg-neutral-700 rounded transition-colors">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs">□</span>
        </button>
        <button className="w-5 h-5 flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-600 rounded transition-colors group">
          <span className="text-neutral-600 dark:text-neutral-400 group-hover:text-white text-xs">✕</span>
        </button>
      </div>
    </div>
  )
}

function TypeWriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50) // タイピング速度（ミリ秒）

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayedText}</span>
}

function CommandLine({
  command,
  prompt,
  showCursor = false,
  onComplete
}: {
  command: string
  prompt: string
  showCursor?: boolean
  onComplete?: () => void
}) {
  return (
    <div className="font-mono text-sm">
      <span className="text-green-500 dark:text-green-400">{prompt}</span>{' '}
      <TypeWriter text={command} onComplete={onComplete} />
      {showCursor && <Cursor />}
    </div>
  )
}

function OutputLine({ content }: { content: string }) {
  // リンク検出（blog/, projects/, about/ など）
  const linkMatch = content.match(/^(blog|projects|about)\//)

  if (linkMatch) {
    const path = linkMatch[1]
    return (
      <Link href={`/${path}`} className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline block">
        {content}
      </Link>
    )
  }

  return <div className="font-mono text-sm text-neutral-700 dark:text-neutral-300">{content}</div>
}

export function TerminalWindow({ commands, prompt = 'user@dev-roar-lab:~$' }: TerminalWindowProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [showOutput, setShowOutput] = useState(false)

  const handleCommandComplete = () => {
    // コマンド入力完了後、出力を表示
    setShowOutput(true)

    // 次のコマンドへ移行（遅延あり）
    setTimeout(() => {
      if (currentCommandIndex < commands.length - 1) {
        setCurrentCommandIndex((prev) => prev + 1)
        setShowOutput(false)
      }
    }, commands[currentCommandIndex]?.delay || 1500)
  }

  const currentCommand = commands[currentCommandIndex]
  const isLastCommand = currentCommandIndex === commands.length - 1

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="rounded-lg shadow-2xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <TerminalHeader />

        <div className="p-6 min-h-[400px] bg-neutral-50 dark:bg-neutral-950">
          {/* 過去のコマンド */}
          {commands.slice(0, currentCommandIndex).map((cmd, index) => (
            <div key={index} className="mb-4">
              <div className="font-mono text-sm">
                <span className="text-green-500 dark:text-green-400">{cmd.prompt || prompt}</span> {cmd.command}
              </div>
              {Array.isArray(cmd.output) ? (
                cmd.output.map((line, i) => <OutputLine key={i} content={line} />)
              ) : (
                <OutputLine content={cmd.output} />
              )}
            </div>
          ))}

          {/* 現在のコマンド */}
          {currentCommand && (
            <div className="mb-4">
              <CommandLine
                command={currentCommand.command}
                prompt={currentCommand.prompt || prompt}
                showCursor={!showOutput && isLastCommand}
                onComplete={handleCommandComplete}
              />
              {showOutput &&
                (Array.isArray(currentCommand.output) ? (
                  currentCommand.output.map((line, i) => <OutputLine key={i} content={line} />)
                ) : (
                  <OutputLine content={currentCommand.output} />
                ))}
            </div>
          )}

          {/* 最後のコマンド完了時のカーソル */}
          {isLastCommand && showOutput && (
            <div className="font-mono text-sm">
              <span className="text-green-500 dark:text-green-400">{prompt}</span>
              <Cursor />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
