export function ClerkSetupBanner() {
  return (
    <div className="border-b border-rose-500/30 bg-rose-500/10 px-6 py-4 text-center text-sm text-rose-100">
      <p className="font-semibold">Clerk API keys are missing in `.env.local`</p>
      <p className="mt-1 text-rose-200/90">
        Without keys, Clerk runs in keyless mode and rate-limits logins (&quot;Too many
        requests&quot;). Paste your keys from{" "}
        <a
          href="https://dashboard.clerk.com/last-active?path=api-keys"
          className="underline hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          Clerk Dashboard → API Keys
        </a>
        , then restart <code className="text-rose-50">npm run dev</code>.
      </p>
      <p className="mt-2 text-xs text-rose-200/80">
        See <code className="text-rose-50">docs/clerk-cli-setup.md</code> or run{" "}
        <code className="text-rose-50">./scripts/finish-clerk-setup.sh</code>
      </p>
    </div>
  );
}
