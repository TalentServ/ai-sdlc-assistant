# AI SDLC Pipeline Assistant

An AI-powered SDLC assistant that converts business requirements into a structured, developer-ready delivery pipeline: clarification, impact analysis, implementation plan, test plan, risk checklist, and delivery readiness.

Built for **Agentic Programming Hackathon — Challenge 3**.

## Features

- **Clerk authentication** — third-party login/logout with protected workspace
- **Requirement input** — paste text, upload `.md`/`.txt`, or load the sample document
- **Agentic workflow** — five specialized agents run in sequence:
  1. Requirement Analyzer
  2. Impact Analyzer
  3. Implementation Planner
  4. Test Planner
  5. Readiness Reviewer
- **Structured output** — Zod-validated pipeline schema rendered in the UI
- **Export** — copy or download Markdown report
- **Tests** — 50 automated cases + 20 AI-generated feature tests (see [demo checklist](docs/demo-checklist.md))

## Quick start

### Prerequisites

- Node.js 20+
- npm 10+
- [Clerk](https://clerk.com) account (free tier works)
- OpenAI API key (optional — app runs a deterministic mock pipeline without it)

### 1. Install dependencies

```bash
cd ~/Projects/ai-sdlc-assistant
npm install
```

### 2. Configure environment

Copy the example env file and fill in your Clerk keys:

```bash
cp .env.example .env.local
```

Required Clerk variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Optional (enables live AI agents instead of mock demo mode):

```env
OPENAI_API_KEY=sk-...
```

See [docs/auth-setup.md](docs/auth-setup.md) for manual Clerk setup, or [docs/clerk-cli-setup.md](docs/clerk-cli-setup.md) to finish with the Clerk CLI.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in, and go to **Workspace**.

### 4. Run tests

See [docs/test-scenarios.md](docs/test-scenarios.md) for the full scenario catalog.

```bash
npm test
```

## Demo & test evidence

**One-page checklist for judges:** [docs/demo-checklist.md](docs/demo-checklist.md)

| Layer | Count | How to show |
|-------|-------|-------------|
| Live app (manual) | 15 | Sign in → Load sample → Generate → Export |
| Automated (`npm test`) | 50 | Unit · API · UI · Regression · Negative · Security |
| AI-generated (report) | 20 | Test plan in downloaded `.md` |
| **Total** | **85** | |

## Demo flow

1. Sign in via Clerk (Google/GitHub/email)
2. Open **Workspace** (`/dashboard`)
3. Click **Load sample** or paste your requirement
4. Click **Generate SDLC pipeline**
5. Review all sections and delivery readiness score
6. **Copy Markdown** or **Download .md**

## Sample requirement

Included at [`public/samples/document-approval-workflow.md`](public/samples/document-approval-workflow.md):

> Add a document approval workflow for creators, approvers, and external collaborators with audit trail, notifications, and RBAC.

## Project structure

```text
src/
├── app/                    # Next.js App Router pages & API routes
├── components/             # UI components
├── lib/
│   ├── agents/             # Five SDLC agents (focused prompts)
│   ├── orchestrator/       # Pipeline runner
│   ├── schemas/            # Zod schemas
│   ├── ai/                 # OpenAI client
│   └── mock-pipeline.ts    # Demo mode without API key
tests/                      # Vitest unit & validation tests
docs/                       # Auth setup, agentic evidence
public/samples/             # Sample requirement document
```

## Deployment (Vercel)

1. Push to GitHub (TalentServ account)
2. Import project in [Vercel](https://vercel.com)
3. Add the same env vars from `.env.local`
4. Deploy

## Agentic programming evidence

See [docs/agentic-evidence.md](docs/agentic-evidence.md) for prompts, workflow design, and build notes.

## Known limitations

- Without `OPENAI_API_KEY`, the app uses a **deterministic mock pipeline** tailored to approval-workflow-style requirements (suitable for demo/judging offline).
- **No application database** — pipeline results live in browser memory only for the session (see [Data & storage](#data--storage) below).
- File upload supports `.md` and `.txt` only (no `.docx` parsing).
- Readiness score uses deterministic heuristics layered on top of AI risk analysis.
- Human approval gates before plan generation are not implemented (listed as extension).

## Data & storage

This MVP does **not** connect to PostgreSQL, MongoDB, SQLite, or any other app database.

| Data | Where it lives |
|------|----------------|
| User accounts & sessions | [Clerk](https://clerk.com) (managed auth service) |
| Generated SDLC pipeline | Browser state only — not persisted server-side |
| Requirement uploads | Read client-side into the form; not stored on disk |
| API keys | `.env.local` / Vercel env vars (never committed) |

PostgreSQL appears only as **example context** in sample requirements and in AI-generated *impact analysis* output (suggested stack for features you analyze). It is not part of this app's runtime.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm test`     | Run Vitest tests         |
| `npm run lint` | Run ESLint               |

## License

MIT — hackathon submission.
