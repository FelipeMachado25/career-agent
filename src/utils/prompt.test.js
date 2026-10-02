import { describe, it, expect } from 'vitest'
import { buildPrompt, parseCareerResponse } from './prompt.js'

describe('buildPrompt', () => {
  it('includes all 5 answers in the output', () => {
    const answers = ['reading', 'poverty', 'create', 'alone', 'empathy']
    const result = buildPrompt(answers)
    answers.forEach(a => expect(result).toContain(a))
  })

  it('instructs the model to return valid JSON only', () => {
    const result = buildPrompt(['a', 'b', 'c', 'd', 'e'])
    expect(result).toContain('valid JSON')
    expect(result.toLowerCase()).toContain('no markdown')
  })

  it('includes the paths format template', () => {
    const result = buildPrompt(['a', 'b', 'c', 'd', 'e'])
    expect(result).toContain('"unconventional"')
    expect(result).toContain('"title"')
    expect(result).toContain('"why"')
  })
})

describe('buildPrompt categories', () => {
  it('asks for both unconventional and conventional paths with research fields', () => {
    const result = buildPrompt(['a', 'b', 'c', 'd', 'e'])
    expect(result).toContain('"unconventional"')
    expect(result).toContain('"conventional"')
    ;['"salary"', '"outlook"', '"skills"', '"firstStep"'].forEach(f =>
      expect(result).toContain(f)
    )
  })
})

const makePaths = n =>
  Array.from({ length: n }, (_, i) => ({
    title: ` Path ${i} `,
    why: 'Because.',
    salary: '$50k–$80k',
    outlook: 'Growing.',
    skills: ['a', 'b', 'c', 'd'],
    firstStep: 'Do a thing.',
  }))

describe('parseCareerResponse', () => {
  it('returns 5 normalized paths per category', () => {
    const out = parseCareerResponse({ unconventional: makePaths(6), conventional: makePaths(5) })
    expect(out.unconventional).toHaveLength(5)
    expect(out.conventional).toHaveLength(5)
    expect(out.unconventional[0].title).toBe('Path 0')
    expect(out.unconventional[0].skills).toEqual(['a', 'b', 'c'])
  })

  it('fills missing research fields with safe defaults', () => {
    const bare = Array.from({ length: 5 }, () => ({ title: 'T', why: 'W' }))
    const out = parseCareerResponse({ unconventional: bare, conventional: bare })
    expect(out.conventional[0]).toEqual({
      title: 'T', why: 'W', salary: '', outlook: '', skills: [], firstStep: '',
    })
  })

  it('returns null when a category is missing or too short', () => {
    expect(parseCareerResponse({ unconventional: makePaths(5) })).toBeNull()
    expect(parseCareerResponse({ unconventional: makePaths(5), conventional: makePaths(4) })).toBeNull()
    expect(parseCareerResponse({ paths: makePaths(5) })).toBeNull()
    expect(parseCareerResponse(null)).toBeNull()
  })

  it('drops paths without a title or why', () => {
    const list = [...makePaths(4), { title: '', why: 'x' }]
    expect(parseCareerResponse({ unconventional: list, conventional: makePaths(5) })).toBeNull()
  })
})
