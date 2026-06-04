import { describe, it, expect } from 'vitest'
import { buildPrompt } from './prompt.js'

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
    expect(result).toContain('"paths"')
    expect(result).toContain('"title"')
    expect(result).toContain('"why"')
  })
})
