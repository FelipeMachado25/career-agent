export const CATEGORIES = ['unconventional', 'conventional']

export function buildPrompt(answers) {
  return `Based on these answers, suggest 5 unconventional career paths AND 5 conventional career paths.
Answer 1 (what makes them lose time): ${answers[0]}
Answer 2 (problem they want to solve): ${answers[1]}
Answer 3 (create/analyze/teach/lead): ${answers[2]}
Answer 4 (solo/people): ${answers[3]}
Answer 5 (fastest skill): ${answers[4]}

"unconventional": niche, emerging or surprising paths they likely haven't considered.
"conventional": well-established, widely recognized professions that still fit this person.

For every path include a short research snapshot:
- "salary": typical annual salary range in USD for a mid-level professional (e.g. "$60k–$90k")
- "outlook": one sentence on demand and growth trends for this field
- "skills": 3 key skills to develop
- "firstStep": one concrete action they could take this week to explore it

Respond ONLY with valid JSON. No markdown, no explanation, no preamble.
Format:
{
  "unconventional": [
    {
      "title": "Career path name",
      "why": "2-3 sentences explaining exactly why this fits this specific person based on their answers",
      "salary": "$X–$Y",
      "outlook": "One sentence",
      "skills": ["skill", "skill", "skill"],
      "firstStep": "One concrete action"
    }
  ],
  "conventional": [ same shape, 5 items ]
}`
}

function isValidPath(p) {
  return (
    p &&
    typeof p.title === 'string' &&
    p.title.trim() !== '' &&
    typeof p.why === 'string' &&
    p.why.trim() !== ''
  )
}

function normalizePath(p) {
  return {
    title: p.title.trim(),
    why: p.why.trim(),
    salary: typeof p.salary === 'string' ? p.salary.trim() : '',
    outlook: typeof p.outlook === 'string' ? p.outlook.trim() : '',
    skills: Array.isArray(p.skills)
      ? p.skills.filter(s => typeof s === 'string' && s.trim()).slice(0, 3)
      : [],
    firstStep: typeof p.firstStep === 'string' ? p.firstStep.trim() : '',
  }
}

// Validates the model output and returns { unconventional, conventional } with
// exactly 5 normalized paths each, or null if the shape is unusable.
export function parseCareerResponse(data) {
  if (!data || typeof data !== 'object') return null
  const result = {}
  for (const key of CATEGORIES) {
    const list = Array.isArray(data[key]) ? data[key].filter(isValidPath) : []
    if (list.length < 5) return null
    result[key] = list.slice(0, 5).map(normalizePath)
  }
  return result
}
