'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
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

  // textが変わったら状態をリセット
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 80) // タイピング速度を少し遅く（よりリアルに）

      return () => clearTimeout(timeout)
    } else if (currentIndex === text.length && onComplete) {
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
      <Link
        href={`/${path}`}
        className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline block whitespace-pre"
      >
        {content}
      </Link>
    )
  }

  return <div className="font-mono text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre">{content}</div>
}

export function TerminalWindow({ commands, prompt = 'user@dev-roar-lab:~$' }: TerminalWindowProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [showOutput, setShowOutput] = useState(false)
  const nextCommandTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 初期ローディング（ターミナル起動のシミュレーション）
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // 800msのローディング時間

    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    // クリーンアップ時にタイマーをクリア
    return () => {
      if (nextCommandTimerRef.current) {
        clearTimeout(nextCommandTimerRef.current)
      }
    }
  }, [])

  const handleCommandComplete = () => {
    // コマンド入力完了後、出力を即座に表示
    setShowOutput(true)

    const delay = commands[currentCommandIndex]?.delay || 100

    // 既存のタイマーをクリア（重複実行を防ぐ）
    if (nextCommandTimerRef.current) {
      clearTimeout(nextCommandTimerRef.current)
    }

    // 次のコマンドへ移行
    nextCommandTimerRef.current = setTimeout(() => {
      if (currentCommandIndex < commands.length - 1) {
        setCurrentCommandIndex((prev) => prev + 1)
        setShowOutput(false)
        nextCommandTimerRef.current = null
      }
    }, delay)
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
          {isLoading ? (
            /* ローディングアニメーション */
            <div className="flex items-center gap-2 font-mono text-sm text-neutral-600 dark:text-neutral-400">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Initializing terminal...
              </motion.span>
              <Cursor />
            </div>
          ) : (
            <>
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
                    showCursor={!showOutput}
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

              {/* コマンド実行後のプロンプト表示 */}
              {showOutput && !isLastCommand && (
                <div className="font-mono text-sm">
                  <span className="text-green-500 dark:text-green-400">{prompt}</span>
                  <Cursor />
                </div>
              )}

              {/* 最後のコマンド完了時のカーソル */}
              {isLastCommand && showOutput && (
                <div className="font-mono text-sm">
                  <span className="text-green-500 dark:text-green-400">{prompt}</span>
                  <Cursor />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
