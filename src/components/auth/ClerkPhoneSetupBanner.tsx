import {
  CLERK_PHONE_SETTINGS_URL,
  getClerkAuthStatus,
} from "@/lib/clerk-auth-status";

type ClerkPhoneSetupBannerProps = {
  compact?: boolean;
};

export async function ClerkPhoneSetupBanner({
  compact = false,
}: ClerkPhoneSetupBannerProps) {
  const status = await getClerkAuthStatus();

  if (!status.phoneRequired) {
    return null;
  }

  if (compact) {
    return (
      <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
        Phone is still required in Clerk.{" "}
        <a
          href={CLERK_PHONE_SETTINGS_URL}
          className="font-medium underline hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          Disable phone in dashboard
        </a>{" "}
        to finish sign-up.
      </p>
    );
  }

  return (
    <div className="mx-auto mb-6 max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
      <p className="font-semibold text-amber-100">Sign-up is blocked until phone auth is turned off</p>
      <p className="mt-1 text-amber-100/90">
        Your Clerk app still requires a phone number. India SMS is not enabled by default, so
        Continue appears to do nothing. Turn off all phone options in the Clerk dashboard, then
        refresh this page.
      </p>
      <a
        href={status.dashboardUrl}
        className="mt-3 inline-flex rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400"
        target="_blank"
        rel="noreferrer"
      >
        Open Clerk phone settings
      </a>
    </div>
  );
}
