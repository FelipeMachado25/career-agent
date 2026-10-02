import { useCareerAgent } from './hooks/useCareerAgent.js'
import Welcome from './components/Welcome.jsx'
import Question from './components/Question.jsx'
import Loading from './components/Loading.jsx'
import Results from './components/Results.jsx'

export default function App() {
  const { screen, currentQ, careers, questions, start, nextQuestion, retry } =
    useCareerAgent()

  if (screen === 'welcome') return <Welcome onStart={start} />

  if (screen === 'questions')
    return (
      <Question
        question={questions[currentQ]}
        questionIndex={currentQ}
        totalQuestions={questions.length}
        onNext={nextQuestion}
      />
    )

  if (screen === 'loading') return <Loading />

  if (screen === 'results')
    return <Results careers={careers} onRetry={retry} isError={false} />

  if (screen === 'error')
    return <Results careers={null} onRetry={retry} isError={true} />

  return null
}
