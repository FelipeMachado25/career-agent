export function buildPrompt(answers) {
  return `Based on these answers, suggest 5 unconventional career paths.
Answer 1 (what makes them lose time): ${answers[0]}
Answer 2 (problem they want to solve): ${answers[1]}
Answer 3 (create/analyze/teach/lead): ${answers[2]}
Answer 4 (solo/people): ${answers[3]}
Answer 5 (fastest skill): ${answers[4]}

Respond ONLY with valid JSON. No markdown, no explanation, no preamble.
Format:
{
  "paths": [
    {
      "title": "Career path name",
      "why": "2-3 sentences explaining exactly why this fits this specific person based on their answers"
    }
  ]
}`
}
