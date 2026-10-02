import Groq from 'groq-sdk'
import { buildPrompt, parseCareerResponse } from '../src/utils/prompt.js'

// llama-3.1-8b-instant was shut down by Groq on 2026-08-16; gpt-oss-20b is
// Groq's official replacement. Override with GROQ_MODEL if Groq retires it too.
export const DEFAULT_MODEL = 'openai/gpt-oss-20b'

function extractJSON(text) {
  // Strip ```json ... ``` or ``` ... ``` markdown fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return fenced ? fenced[1].trim() : text.trim()
}

const SYSTEM_PROMPT =
  "You are a career exploration expert. Given a person's interests and traits, you suggest both unconventional paths they likely haven't considered and solid conventional professions that fit them, each backed by a brief, realistic research snapshot. Be specific, inspiring, and honest. Never suggest generic paths."

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { answers } = req.body ?? {}

  if (!Array.isArray(answers) || answers.length !== 5) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  if (!answers.every(a => typeof a === 'string' && a.trim().length >= 3)) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('[generate] GROQ_API_KEY is not set')
    return res.status(500).json({ error: 'Server is missing its API key' })
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL
  const isReasoningModel = model.startsWith('openai/gpt-oss')

  try {
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(answers) },
      ],
      temperature: 0.8,
      max_completion_tokens: 8000,
      response_format: { type: 'json_object' },
      ...(isReasoningModel && { reasoning_effort: 'low', include_reasoning: false }),
    })

    const text = completion.choices[0]?.message?.content ?? ''
    if (process.env.NODE_ENV !== 'production') {
      console.log('[generate] Raw Groq response:', text.slice(0, 300))
    }
    const data = parseCareerResponse(JSON.parse(extractJSON(text)))

    if (!data) {
      console.error('[generate] Unexpected model response shape')
      return res.status(500).json({ error: 'Unexpected model response' })
    }

    return res.status(200).json(data)
  } catch (err) {
    // Logged in production too so Groq failures (bad key, retired model,
    // rate limit) show up in the Vercel function logs.
    console.error('[generate] Groq error:', err?.status ?? '', err?.message ?? err)
    return res.status(500).json({ error: 'Failed to generate career paths' })
  }
}
