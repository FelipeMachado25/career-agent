export function encodeAnswers(answers) {
  return btoa(JSON.stringify(answers))
}

export function decodeAnswers(encoded) {
  try {
    const parsed = JSON.parse(atob(encoded))
    return Array.isArray(parsed) && parsed.length === 5 ? parsed : null
  } catch {
    return null
  }
}
