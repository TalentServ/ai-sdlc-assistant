import { AppHeader } from "@/components/AppHeader";
import { HomeContent } from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <HomeContent />
    </div>
  );
}
