import { getClerkAuthStatus } from "@/lib/clerk-auth-status";
import { ClerkPhoneSetupBanner } from "@/components/auth/ClerkPhoneSetupBanner";
import { EmailSignUpForm } from "@/components/auth/EmailSignUpForm";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const authStatus = await getClerkAuthStatus();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-10">
      <ClerkPhoneSetupBanner />
      <EmailSignUpForm phoneRequiredInClerk={authStatus.phoneRequired} />
    </div>
  );
}
