import { useState } from 'react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      window.prompt('Copy this link to share your results:', window.location.href)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="w-full border border-gold text-gold font-semibold py-3 rounded-full hover:bg-gold hover:text-navy transition-colors"
    >
      {copied ? 'Copied!' : 'Share Results'}
    </button>
  )
}
