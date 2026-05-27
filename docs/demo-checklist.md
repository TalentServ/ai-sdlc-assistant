# Demo & Test Evidence Checklist

One-page summary for hackathon demo and submission. Full detail: [test-scenarios.md](./test-scenarios.md).

**Totals:** 15 live app checks · 50 automated tests · 20 AI-generated feature tests · **85 scenarios**

---

## 5-minute demo script

| Step | Action | What to say |
|------|--------|-------------|
| 1 | Sign in at http://localhost:3000 | Third-party auth via Clerk; protected workspace |
| 2 | Open **Workspace** → **Load sample** | Sample requirement: document approval workflow |
| 3 | **Generate SDLC pipeline** | Five-agent flow → structured SDLC output |
| 4 | Show **72/100** readiness | Not 100 — open questions + high risk = needs clarification |
| 5 | Scroll impact, plan, test plan, risks | All hackathon sections populated |
| 6 | **Download .md** | Exportable developer-ready report |
| 7 | Run `npm test` in terminal | 50 automated tests, 6 categories, all passing |

---

## Live app tests (15) — show in browser

- [ ] M-01 Sign up works
- [ ] M-02 Sign in / sign out works
- [ ] M-03 `/dashboard` blocked when logged out
- [ ] M-04 User name/email visible in workspace
- [ ] M-05 Load sample fills requirement
- [ ] M-06 Generate disabled for short input
- [ ] M-07 Pipeline generates all sections
- [ ] M-08 Clarification: assumptions + open questions
- [ ] M-09 Impact: UI, API, DB, security, integrations
- [ ] M-10 Implementation plan: sequenced tasks
- [ ] M-11 Test plan: unit, API, UI, regression, negative, security
- [ ] M-12 Risk checklist with severity + mitigation
- [ ] M-13 Delivery readiness score + recommendation
- [ ] M-14 Copy Markdown works
- [ ] M-15 Download `.md` works

---

## Automated tests (50) — run `npm test`

| Category | Count | Evidence |
|----------|-------|----------|
| Unit | 8 | Schema, scoring, export, orchestrator |
| API | 7 | Auth, pipeline, export routes |
| UI | 9 | Forms, results, readiness display |
| Regression | 5 | Pipeline stability, agent order |
| Negative | 7 | Invalid input, 401/400 handling |
| Security | 5 | Auth boundaries, XSS, no stack leaks |

---

## AI-generated feature tests (20) — from exported report

From `public/samples/document-approval-workflow.md` pipeline output:

**Unit (3):** state machine transitions · RBAC permissions · notification PII masking

**API (4):** submit 403 non-owner · approve + audit · audit-trail order · collaborator approve 403

**UI (4):** creator submit · approver actions · collaborator comment-only · status timeline

**Regression (2):** document list unchanged · legacy docs accessible

**Negative (3):** double-submit idempotent · reject without comment 400 · session expiry redirect

**Security (4):** no cross-user approve · immutable audit · XSS sanitization · rate limiting

---

## Hackathon criteria mapping

| Criterion | Evidence |
|-----------|----------|
| Third-party auth | Clerk sign-in/up, protected `/dashboard` |
| SDLC workflow | Clarification → impact → plan → tests → risks → readiness |
| Test evidence | `npm test` (50) + generated test plan (20) + manual (15) |
| Agentic workflow | 5 agents in `src/lib/agents/`; see [agentic-evidence.md](./agentic-evidence.md) |
| Sample requirement | `public/samples/document-approval-workflow.md` |
| Export | Markdown copy/download |
| Demo clarity | This checklist + 5-minute script above |

---

## Commands

```bash
cd ~/Projects/ai-sdlc-assistant
npm install
npm run dev          # http://localhost:3000
npm test             # 50 passing tests
```
