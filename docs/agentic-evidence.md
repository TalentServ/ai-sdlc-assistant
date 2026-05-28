# Agentic Programming Evidence

This project was built using an **agentic SDLC workflow** — both in the product design and in how it was implemented with Cursor.

## Product: multi-agent pipeline (not one prompt)

The assistant runs **five separate agents** with distinct system prompts, inputs, and JSON schemas:

| Agent | File | Responsibility |
|-------|------|----------------|
| Requirement Analyzer | `src/lib/agents/requirement-analyzer.ts` | Summary, user story, assumptions, questions, out-of-scope |
| Impact Analyzer | `src/lib/agents/impact-analyzer.ts` | UI, API, DB, security, integration, testing impact |
| Implementation Planner | `src/lib/agents/implementation-planner.ts` | Sequenced developer tasks with dependencies |
| Test Planner | `src/lib/agents/test-planner.ts` | Unit/API/UI/regression/negative/security scenarios |
| Readiness Reviewer | `src/lib/agents/readiness-reviewer.ts` | Risks, review checklist, readiness scoring |

Orchestration lives in `src/lib/orchestrator/runPipeline.ts` — each stage receives output from prior stages.

## Example agent prompt (Requirement Analyzer)

```
You are a Requirement Analyzer agent in an SDLC pipeline.
Summarize the business requirement, rewrite it as a clear user story, list assumptions,
open clarifying questions, and explicit out-of-scope items. Be specific and developer-ready.
```

## Structured validation

All agent outputs conform to `src/lib/schemas/sdlc-pipeline.ts` (Zod). Invalid JSON from the model would fail parsing — enabling test-driven validation.

## Demo mode without API key

`src/lib/mock-pipeline.ts` provides a rich deterministic pipeline for hackathon demos when `OPENAI_API_KEY` is unset. This was designed so judges can run the app locally without AI billing setup.

## Build process with Cursor

1. **Architecture first** — defined Zod schema and five-agent orchestration before UI
2. **Incremental agents** — each agent implemented as an isolated module with schema hint
3. **Test-driven validation** — 10+ Vitest cases for schema, scoring, markdown export
4. **Auth integration** — Clerk middleware + protected API routes
5. **UI last** — dashboard consumes the same schema the API returns

## Sample input → output

**Input:** `public/samples/document-approval-workflow.md`

**Output sections:**
- Clarified requirement with 3 open questions
- Impact across 5 modules, UI/API/DB/security
- 7 sequenced implementation tasks
- 18+ test scenarios across 6 categories
- 6 risks with mitigations
- Delivery readiness score: 72 — **needs clarification**

Run locally:

```bash
npm install && npm run dev
# Sign in → Load sample → Generate SDLC pipeline
npm test
```

## Screenshots

Add demo screenshots to `docs/demo/` before submission (login, pipeline progress, readiness score, export).
