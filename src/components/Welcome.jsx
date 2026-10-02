export default function Welcome({ onStart }) {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">Career Explorer</h1>
          <p className="text-muted text-lg leading-relaxed">
            Answer 5 questions. Discover 5 unconventional and 5 conventional career paths, each with a quick research snapshot.
          </p>
        </div>
        <button
          onClick={onStart}
          className="bg-gold text-navy font-semibold px-10 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Start Exploring
        </button>
      </div>
    </div>
  )
}
