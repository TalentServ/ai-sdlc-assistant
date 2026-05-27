#!/usr/bin/env bash
set -euo pipefail

# Publish feat/ai-sdlc-assistant-hackathon and open a PR.
#
# Default target: TalentServ/ai-sdlc-assistant
# Override if you lack org create permissions:
#   REPO=jitendakumar/ai-sdlc-assistant ./scripts/publish-to-talentserv.sh
#
# Prerequisites: gh auth login

REPO="${REPO:-TalentServ/ai-sdlc-assistant}"
BRANCH="${BRANCH:-feat/ai-sdlc-assistant-hackathon}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

echo "==> Quality gate"
npm test
npm run lint
npm run build

echo "==> Resolve GitHub repository: ${REPO}"

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repository not found. Attempting to create ${REPO}..."
  if ! gh repo create "$REPO" \
    --public \
    --description "AI SDLC Pipeline Assistant — Agentic Programming Hackathon Challenge 3" 2>/tmp/gh-repo-create.err; then
    echo
    echo "Could not create ${REPO}."
    cat /tmp/gh-repo-create.err
    echo
    echo "This usually means your GitHub user cannot create repos in the TalentServ org."
    echo
    echo "Fix options:"
    echo "  1) Ask a TalentServ org admin to create github.com/TalentServ/ai-sdlc-assistant"
    echo "     and grant you write access, then re-run this script."
    echo "  2) Push to your personal account first, then transfer or open PR to TalentServ:"
    echo "     REPO=\$(gh api user -q .login)/ai-sdlc-assistant ./scripts/publish-to-talentserv.sh"
    echo "  3) Create the repo manually in GitHub UI, then re-run this script."
    exit 1
  fi
fi

echo "==> Configure remote and push branch"
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${REPO}.git"
else
  git remote set-url origin "https://github.com/${REPO}.git"
fi

git push -u origin "$BRANCH"

echo "==> Create pull request (skip if one already exists)"
if gh pr view --repo "$REPO" --head "$BRANCH" >/dev/null 2>&1; then
  gh pr view --repo "$REPO" --head "$BRANCH"
else
  if gh api "repos/${REPO}/git/ref/heads/main" >/dev/null 2>&1; then
    PR_BASE="main"
  else
    echo "Note: remote has no main branch yet. Opening PR may require a TalentServ admin"
    echo "      to create the repo default branch first, or push main manually."
    PR_BASE="main"
  fi

  gh pr create \
    --repo "$REPO" \
    --base "$PR_BASE" \
    --head "$BRANCH" \
    --title "feat: AI SDLC Pipeline Assistant (Hackathon Challenge 3)" \
    --body "$(cat <<'EOF'
## Summary

- Adds **AI SDLC Pipeline Assistant**: a Clerk-authenticated Next.js app that converts business requirements into a structured delivery pipeline (clarification, impact analysis, implementation plan, test plan, risks, readiness score).
- Implements a **five-agent orchestrator** with optional OpenAI integration and a deterministic **demo/mock mode** when `OPENAI_API_KEY` is unset.
- Delivers **email-only custom sign-up**, streaming **green pipeline progress**, Markdown export, sample requirements, and **51 automated tests** with scenario IDs/descriptions.

## Architecture

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 App Router, Tailwind |
| Auth | Clerk (no app database) |
| Agents | OpenAI (live) or mock pipeline (demo) |
| Validation | Zod schemas for pipeline output |
| Tests | Vitest (unit, API, UI, regression, negative, security) |

**No application database** — user sessions via Clerk; pipeline results are session-only in the browser.

## Test plan

- [x] `npm test` — 51/51 passing with detailed scenario reporter
- [x] `npm run lint` — no ESLint errors
- [x] `npm run build` — production build succeeds
- [ ] Manual: sign up / sign in at `/sign-in` (Clerk phone auth disabled in dashboard)
- [ ] Manual: load sample requirement → Generate pipeline → verify green stage progress
- [ ] Manual: download exported `.md` report
- [ ] Optional: set `OPENAI_API_KEY` and verify live agent output

## Setup for reviewers

```bash
cp .env.example .env.local
# Add Clerk keys from dashboard.clerk.com
npm install && npm run dev
```

See `docs/auth-setup.md`, `docs/demo-checklist.md`, and `docs/test-scenarios.md`.
EOF
)"
fi

echo "Done."
