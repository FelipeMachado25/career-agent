# Career Explorer

Career Explorer asks you five introspective questions about what drives and defines you, then uses AI to surface five unconventional career paths tailored specifically to your answers. Results are shareable — a unique URL encodes your answers so you can bookmark them or send them to a friend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| AI | Groq API (`llama-3.1-8b-instant`) |
| Backend | Vercel Serverless Functions |
| Deployment | Vercel |

## Local Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd career-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set GROQ_API_KEY to your key from console.groq.com
   ```

4. **Start the dev server**

   For UI-only development (no API calls):
   ```bash
   npm run dev
   ```

   For full-stack local development (API + UI):
   ```bash
   npx vercel dev
   ```

   The app runs at `http://localhost:3000` with `vercel dev`, or `http://localhost:5173` with `npm run dev`.

## Vercel Deployment

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Settings → Environment Variables**, add:
   - `GROQ_API_KEY` = your Groq API key
4. Deploy. Vercel auto-detects Vite and configures the build.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Groq API key from [console.groq.com](https://console.groq.com) | Yes |

## Project Structure

```
career-agent/
├── api/
│   └── generate.js        # Vercel serverless — Groq API call, never exposes key
├── src/
│   ├── App.jsx             # State machine router
│   ├── components/
│   │   ├── Welcome.jsx     # Landing screen
│   │   ├── Question.jsx    # Question + progress bar + validation
│   │   ├── Loading.jsx     # Animated loading indicator
│   │   ├── Results.jsx     # Career cards + error state
│   │   └── ShareButton.jsx # Clipboard copy with fallback
│   ├── hooks/
│   │   └── useCareerAgent.js  # All app state and logic
│   └── utils/
│       ├── prompt.js       # Groq user prompt builder
│       └── url.js          # Answer encode/decode helpers
├── vercel.json             # SPA routing + API function config
└── .env.example
```

## How the Groq Integration Works

All AI calls are routed through `api/generate.js` — a Vercel serverless function. The `GROQ_API_KEY` is a server-side environment variable and is never included in the browser bundle.

1. The React app collects 5 answers and sends `POST /api/generate` with `{ answers: [...] }`
2. The serverless function builds a structured prompt and calls Groq's `llama-3.1-8b-instant`
3. Groq returns a JSON object with 5 career path objects (`title` + `why`)
4. The function validates the response shape and returns it to the frontend

If the call fails (network error, bad response, model returns fewer than 5 paths), the client retries up to 3 times with a 2-second delay between attempts before showing the error screen.

## Running Tests

```bash
npm test
```

Tests cover the `url.js` encode/decode helpers and the `prompt.js` builder.
