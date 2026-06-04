import Groq from 'groq-sdk'
import { buildPrompt } from '../src/utils/prompt.js'

function extractJSON(text) {
  // Strip ```json ... ``` or ``` ... ``` markdown fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return fenced ? fenced[1].trim() : text.trim()
}

const SYSTEM_PROMPT =
  "You are a career exploration expert who specializes in unconventional professional paths. Given a person's interests and traits, you identify career directions they likely haven't considered. Be specific, inspiring, and honest. Never suggest generic paths."

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

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(answers) },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content ?? ''
    if (process.env.NODE_ENV !== 'production') {
      console.log('[generate] Raw Groq response:', text.slice(0, 300))
    }
    const data = JSON.parse(extractJSON(text))

    if (!Array.isArray(data.paths) || data.paths.length < 5) {
      return res.status(500).json({ error: 'Unexpected model response' })
    }

    return res.status(200).json({ paths: data.paths.slice(0, 5) })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[generate] Error:', err?.message ?? err)
    }
    return res.status(500).json({ error: 'Failed to generate career paths' })
  }
}
