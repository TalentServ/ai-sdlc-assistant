import type { DeliveryReadiness, RiskItem } from "@/lib/schemas/sdlc-pipeline";

export interface ReadinessSignals {
  openQuestions: string[];
  assumptions: string[];
  impactAreasPopulated: number;
  implementationTaskCount: number;
  testCategoriesPopulated: number;
  highRisks: RiskItem[];
}

export function deriveReadinessStatus(
  openQuestions: string[],
  highRisks: RiskItem[],
  score: number
): DeliveryReadiness["status"] {
  if (highRisks.length > 0 || score < 50) {
    return "high_risk";
  }
  if (openQuestions.length > 0 || score < 80) {
    return "needs_clarification";
  }
  return "ready";
}

export function computeReadinessScore(signals: ReadinessSignals): number {
  let score = 0;

  if (signals.openQuestions.length === 0) score += 25;
  if (signals.assumptions.length > 0) score += 10;

  const impactScore = Math.min(15, signals.impactAreasPopulated * 2);
  score += impactScore;

  if (signals.implementationTaskCount >= 3) score += 15;
  else if (signals.implementationTaskCount > 0) score += 8;

  const testScore = Math.min(15, signals.testCategoriesPopulated * 2.5);
  score += testScore;

  if (signals.highRisks.length === 0) score += 20;
  else if (signals.highRisks.length === 1) score += 10;

  return Math.min(100, Math.round(score));
}

export function deriveConfidence(
  score: number,
  openQuestions: string[]
): DeliveryReadiness["confidence"] {
  if (score >= 80 && openQuestions.length === 0) return "high";
  if (score >= 60) return "medium";
  return "low";
}
