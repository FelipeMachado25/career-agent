import { useState } from 'react'

export default function Question({ question, questionIndex, totalQuestions, onNext }) {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)

  const progress = ((questionIndex + 1) / totalQuestions) * 100
  const isLast = questionIndex === totalQuestions - 1

  function handleNext() {
    if (value.trim().length < 3) {
      setShowError(true)
      return
    }
    setShowError(false)
    onNext(value.trim())
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-surface">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2">
            <p className="text-muted text-sm font-medium tracking-wide uppercase">
              {questionIndex + 1} of {totalQuestions}
            </p>
            <h2 className="text-2xl font-semibold text-white leading-snug">
              {question}
            </h2>
          </div>

          <div className="space-y-2">
            <textarea
              value={value}
              onChange={e => {
                setValue(e.target.value)
                if (showError && e.target.value.trim().length >= 3) setShowError(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Your answer…"
              rows={3}
              className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-muted resize-none focus:outline-none focus:border-gold transition-colors"
            />
            {showError && (
              <p className="text-sm text-muted">
                Please write at least 3 characters to continue.
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-gold text-navy font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            {isLast ? 'See My Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
