# Clerk Authentication Setup

This app uses [Clerk](https://clerk.com) for third-party authentication. No passwords are stored in the application.

## Steps

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Configure **email-only** sign-up (required for India / no SMS):
   - Open [User & authentication](https://dashboard.clerk.com/apps/app_3EDFLUl344142h99kBja9WwM5LW/user-authentication/email%2Cphone%2Cusername) for this app.
   - **Email** tab: enable sign-up and sign-in with email (password or verification code — your choice).
   - **Phone** tab: turn **off** sign-up with phone, sign-in with phone, and any “require phone number” option.
   - The app hides phone fields in the UI (`src/lib/clerk-appearance.ts`), but Clerk still rejects sign-up until phone is disabled in the dashboard.
3. Copy **Publishable key** and **Secret key** into `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. In Clerk dashboard → **Paths**, ensure sign-in/sign-up paths match `/sign-in` and `/sign-up`.

## Protected routes

Middleware in `src/middleware.ts` protects:

- `/dashboard` — main assistant workspace
- `/api/pipeline` — pipeline generation API
- `/api/export` — Markdown export API

## User identity

The dashboard displays the signed-in user's name or email via Clerk's `useUser()` hook.

## Troubleshooting

### Continue does nothing on sign-up

This happens when **phone is still required in Clerk** but the phone field is hidden or SMS is unavailable (e.g. India +91). The sign-up page now shows an amber banner with a direct link to fix this.

1. Open [User & authentication → Phone](https://dashboard.clerk.com/apps/app_3EDFLUl344142h99kBja9WwM5LW/user-authentication/email%2Cphone%2Cusername).
2. Turn **off** sign-up with phone, sign-in with phone, and any require-phone option.
3. On the **Email** tab, keep email sign-up/sign-in enabled.
4. Refresh http://localhost:3000/sign-up and try again.

## Production (Vercel)

Add the same environment variables in your Vercel project settings. Set Clerk's production keys when deploying to a production domain.

## Logout

Users can sign out via the Clerk `UserButton` in the header. After sign-out they are redirected to `/`.
