import ShareButton from './ShareButton.jsx'

export default function Results({ paths, onRetry, isError }) {
  if (isError) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-white text-lg">
            Something went wrong generating your career paths. Please try again.
          </p>
          <button
            onClick={onRetry}
            className="bg-gold text-navy font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy p-4">
      <div className="max-w-md mx-auto py-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">
          Your Career Paths
        </h2>

        <div className="space-y-4">
          {paths.map((path, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 shadow-lg space-y-2"
            >
              <h3 className="text-gold font-bold text-lg">{path.title}</h3>
              <p className="text-white text-sm leading-relaxed">{path.why}</p>
            </div>
          ))}
        </div>

        <ShareButton />
      </div>
    </div>
  )
}
