# Finish Clerk setup with the CLI

The app is wired for Clerk (`@clerk/nextjs`, middleware, sign-in/up routes, nav controls).
Run these commands **in your Mac terminal** (not the agent shell) to link app
`app_3EDFLUl344142h99kBja9WwM5LW` and pull API keys.

## One command

```bash
cd ~/Projects/ai-sdlc-assistant
chmod +x scripts/finish-clerk-setup.sh
./scripts/finish-clerk-setup.sh
```

## Or step by step

```bash
cd ~/Projects/ai-sdlc-assistant

# 1. Install / update CLI
npm install -g clerk
clerk update --yes

# 2. Sign in (opens browser)
clerk auth login

# 3. Initialize and link your Clerk app
clerk init --app app_3EDFLUl344142h99kBja9WwM5LW --yes

# 4. Pull keys into .env.local
clerk env pull

# 5. Verify integration
clerk doctor

# 6. Start app
npm run dev
```

## After setup

1. In [Clerk Dashboard → User & authentication → Phone](https://dashboard.clerk.com/apps/app_3EDFLUl344142h99kBja9WwM5LW/user-authentication/email%2Cphone%2Cusername), disable all phone sign-up/sign-in options (email-only auth).
2. Open http://localhost:3000
3. Click **Sign up** in the nav and create your first test user
4. When your profile icon appears, open **Workspace** and run the SDLC pipeline demo

## Linked Clerk application

- Application ID: `app_3EDFLUl344142h99kBja9WwM5LW`
- Dashboard: https://dashboard.clerk.com/

## Middleware note

`src/middleware.ts` includes the Clerk auto-proxy matcher:

```ts
'/(api|trpc)(.*)',
'/__clerk/(.*)',
```

Docs: https://clerk.com/docs/cli

## Troubleshooting: "Too many requests" on login

This usually means **Clerk keyless mode** is active because `.env.local` is missing real API keys.

1. Open [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys)
2. Copy **Publishable key** and **Secret key** into `.env.local` (both from the **same** app)
3. Ensure `NEXT_PUBLIC_CLERK_KEYLESS_DISABLED=true` is set
4. Delete keyless cache: `rm -rf .clerk`
5. Clear browser cookies for `localhost`
6. Wait **1–2 minutes** (Clerk rate limit cooldown), then restart `npm run dev`

**Do not share your Clerk secret key or password with anyone.** Only paste keys into your local `.env.local` file.

If rate limits persist after adding keys, sign in at `/sign-in` directly and avoid clicking "Resend code" repeatedly.
