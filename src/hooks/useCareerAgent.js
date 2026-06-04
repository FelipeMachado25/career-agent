import { useState, useEffect } from 'react'
import { encodeAnswers, decodeAnswers } from '../utils/url.js'

export const QUESTIONS = [
  'What activity makes you completely lose track of time?',
  'What problem in the world would you most want to solve?',
  'Do you prefer to create, analyze, teach, or lead?',
  'Do you work better alone or with other people?',
  'What skill do you learn faster than most people around you?',
]

async function fetchPaths(answers) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  if (!res.ok) throw new Error('Request failed')
  const data = await res.json()
  if (!Array.isArray(data.paths) || data.paths.length < 5) {
    throw new Error('Invalid response')
  }
  return data.paths
}

export function useCareerAgent() {
  const [screen, setScreen] = useState('welcome') // welcome | questions | loading | results | error
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState(['', '', '', '', ''])
  const [paths, setPaths] = useState([])

  async function submit(submittedAnswers) {
    setScreen('loading')
    let attempt = 0
    while (attempt < 3) {
      try {
        const result = await fetchPaths(submittedAnswers)
        window.history.replaceState(null, '', `?q=${encodeAnswers(submittedAnswers)}`)
        setPaths(result)
        setScreen('results')
        return
      } catch {
        attempt++
        if (attempt < 3) await new Promise(r => setTimeout(r, 2000))
      }
    }
    setScreen('error')
  }

  // On mount: if ?q= param present, decode and auto-submit
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    if (!q) return
    const decoded = decodeAnswers(q)
    if (!decoded) return // malformed — stay on welcome
    setAnswers(decoded)
    submit(decoded)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function start() {
    setScreen('questions')
  }

  function nextQuestion(currentAnswer) {
    const updated = answers.map((a, i) => (i === currentQ ? currentAnswer : a))
    setAnswers(updated)
    if (currentQ < 4) {
      setCurrentQ(q => q + 1)
    } else {
      submit(updated)
    }
  }

  function retry() {
    submit(answers)
  }

  return {
    screen,
    currentQ,
    answers,
    paths,
    questions: QUESTIONS,
    start,
    nextQuestion,
    retry,
  }
}
