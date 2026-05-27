import { SignIn } from "@clerk/nextjs";
import { ClerkHiddenPhoneFix } from "@/components/auth/ClerkHiddenPhoneFix";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <ClerkHiddenPhoneFix />
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={clerkAppearance}
      />
    </div>
  );
}
