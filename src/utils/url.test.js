import { describe, it, expect } from 'vitest'
import { encodeAnswers, decodeAnswers } from './url.js'

describe('encodeAnswers', () => {
  it('returns a non-empty string', () => {
    const encoded = encodeAnswers(['a', 'b', 'c', 'd', 'e'])
    expect(typeof encoded).toBe('string')
    expect(encoded.length).toBeGreaterThan(0)
  })
})

describe('decodeAnswers', () => {
  it('round-trips correctly', () => {
    const answers = ['coding', 'climate', 'create', 'alone', 'writing']
    expect(decodeAnswers(encodeAnswers(answers))).toEqual(answers)
  })

  it('returns null for garbage input', () => {
    expect(decodeAnswers('!!!not-base64!!!')).toBeNull()
  })

  it('returns null when decoded value is not an array of 5', () => {
    const short = btoa(JSON.stringify(['only', 'three', 'items']))
    expect(decodeAnswers(short)).toBeNull()
  })
})
