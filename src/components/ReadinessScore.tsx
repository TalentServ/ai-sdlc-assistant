import type { DeliveryReadiness } from "@/lib/schemas/sdlc-pipeline";

const statusStyles: Record<DeliveryReadiness["status"], string> = {
  ready: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  needs_clarification: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  high_risk: "border-rose-500/40 bg-rose-500/10 text-rose-100",
};

const statusLabels: Record<DeliveryReadiness["status"], string> = {
  ready: "Ready",
  needs_clarification: "Needs clarification",
  high_risk: "High risk",
};

interface ReadinessScoreProps {
  readiness: DeliveryReadiness;
}

export function ReadinessScore({ readiness }: ReadinessScoreProps) {
  return (
    <div className={`glass-panel border p-6 ${statusStyles[readiness.status]}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide opacity-80">Delivery readiness</p>
          <p className="mt-2 text-4xl font-bold">{readiness.score}</p>
          <p className="text-sm opacity-80">out of 100</p>
        </div>
        <div className="text-right">
          <span className="inline-flex rounded-full border border-current px-3 py-1 text-sm font-semibold">
            {statusLabels[readiness.status]}
          </span>
          <p className="mt-2 text-sm capitalize opacity-80">
            Confidence: {readiness.confidence}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{readiness.recommendation}</p>
      {readiness.approvalNeeds.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase opacity-80">Approval needs</p>
          <ul className="mt-2 space-y-1 text-sm">
            {readiness.approvalNeeds.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
