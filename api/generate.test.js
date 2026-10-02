import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const create = vi.fn()
vi.mock('groq-sdk', () => ({
  default: class {
    constructor() {
      this.chat = { completions: { create } }
    }
  },
}))

const { default: handler, DEFAULT_MODEL } = await import('./generate.js')

const answers = ['reading', 'poverty', 'create', 'alone', 'empathy']
const paths = Array.from({ length: 5 }, (_, i) => ({ title: `P${i}`, why: 'W' }))

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(data) { this.body = data; return this },
  }
}

function reply(content) {
  create.mockResolvedValueOnce({ choices: [{ message: { content } }] })
}

describe('api/generate handler', () => {
  beforeEach(() => {
    create.mockReset()
    process.env.GROQ_API_KEY = 'test-key'
    delete process.env.GROQ_MODEL
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('uses the non-retired default model with reasoning params', async () => {
    reply(JSON.stringify({ unconventional: paths, conventional: paths }))
    const res = mockRes()
    await handler({ method: 'POST', body: { answers } }, res)
    expect(res.statusCode).toBe(200)
    expect(res.body.unconventional).toHaveLength(5)
    expect(res.body.conventional).toHaveLength(5)
    const args = create.mock.calls[0][0]
    expect(args.model).toBe(DEFAULT_MODEL)
    expect(DEFAULT_MODEL).not.toBe('llama-3.1-8b-instant')
    expect(args.reasoning_effort).toBe('low')
    expect(args.response_format).toEqual({ type: 'json_object' })
  })

  it('honors GROQ_MODEL and omits reasoning params for non-gpt-oss models', async () => {
    process.env.GROQ_MODEL = 'qwen/some-model'
    reply(JSON.stringify({ unconventional: paths, conventional: paths }))
    await handler({ method: 'POST', body: { answers } }, mockRes())
    const args = create.mock.calls[0][0]
    expect(args.model).toBe('qwen/some-model')
    expect(args).not.toHaveProperty('reasoning_effort')
  })

  it('strips markdown fences', async () => {
    reply('```json\n' + JSON.stringify({ unconventional: paths, conventional: paths }) + '\n```')
    const res = mockRes()
    await handler({ method: 'POST', body: { answers } }, res)
    expect(res.statusCode).toBe(200)
  })

  it('returns 500 on bad model shape', async () => {
    reply(JSON.stringify({ paths }))
    const res = mockRes()
    await handler({ method: 'POST', body: { answers } }, res)
    expect(res.statusCode).toBe(500)
  })

  it('returns 500 when Groq throws (e.g. retired model)', async () => {
    create.mockRejectedValueOnce(Object.assign(new Error('model decommissioned'), { status: 400 }))
    const res = mockRes()
    await handler({ method: 'POST', body: { answers } }, res)
    expect(res.statusCode).toBe(500)
    expect(console.error).toHaveBeenCalled()
  })

  it('returns 500 without calling Groq when the key is missing', async () => {
    delete process.env.GROQ_API_KEY
    const res = mockRes()
    await handler({ method: 'POST', body: { answers } }, res)
    expect(res.statusCode).toBe(500)
    expect(create).not.toHaveBeenCalled()
  })

  it('rejects invalid input', async () => {
    const res = mockRes()
    await handler({ method: 'POST', body: { answers: ['a'] } }, res)
    expect(res.statusCode).toBe(400)
    const res2 = mockRes()
    await handler({ method: 'GET' }, res2)
    expect(res2.statusCode).toBe(405)
  })
})
