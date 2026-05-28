#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Clerk CLI setup for ai-sdlc-assistant"
echo "    Linked app: app_3EDFLUl344142h99kBja9WwM5LW"
echo

if ! command -v clerk >/dev/null 2>&1; then
  echo "Installing Clerk CLI..."
  npm install -g clerk
fi

echo "==> Updating Clerk CLI"
clerk update --yes || true

echo "==> Signing in to Clerk (browser will open)"
clerk auth login

echo "==> Linking project and applying Next.js integration"
clerk init --app app_3EDFLUl344142h99kBja9WwM5LW --yes

echo "==> Pulling environment variables to .env.local"
clerk env pull

echo "==> Running health check"
clerk doctor

echo
echo "Done. Start the app with: npm run dev"
echo "Then sign up from the nav to create your first test user."
