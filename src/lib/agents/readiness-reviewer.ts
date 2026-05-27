import { generateStructuredJson } from "@/lib/ai/client";
import {
  DeliveryReadinessSchema,
  RiskItemSchema,
  type ClarifiedRequirement,
  type DeliveryReadiness,
  type ImpactAnalysis,
  type ImplementationTask,
  type RiskItem,
  type TestPlan,
} from "@/lib/schemas/sdlc-pipeline";
import {
  computeReadinessScore,
  deriveConfidence,
  deriveReadinessStatus,
} from "@/lib/readiness-scoring";
import { z } from "zod";

const ReviewerResponseSchema = z.object({
  riskChecklist: z.array(RiskItemSchema),
  reviewChecklist: z.array(z.string()),
  approvalNeeds: z.array(z.string()),
  recommendation: z.string(),
});

const SCHEMA_HINT = `{
  "riskChecklist": [
    {
      "category": "delivery|security|data|performance|rollout|dependency",
      "risk": "string",
      "mitigation": "string",
      "severity": "low|medium|high"
    }
  ],
  "reviewChecklist": ["string"],
  "approvalNeeds": ["string"],
  "recommendation": "string"
}`;

const SYSTEM_PROMPT = `You are a Readiness Reviewer agent in an SDLC pipeline.
Identify delivery, security, data, performance, rollout, and dependency risks with mitigations.
Provide a code review / architecture validation checklist and approval needs.
Give a clear go/no-go style recommendation.`;

export interface ReadinessReviewResult {
  riskChecklist: RiskItem[];
  reviewChecklist: string[];
  deliveryReadiness: DeliveryReadiness;
}

export async function runReadinessReviewer(input: {
  clarified: ClarifiedRequirement;
  impact: ImpactAnalysis;
  implementation: ImplementationTask[];
  tests: TestPlan;
}): Promise<ReadinessReviewResult> {
  const userPrompt = JSON.stringify(input, null, 2);

  const raw = await generateStructuredJson<unknown>(
    SYSTEM_PROMPT,
    userPrompt,
    SCHEMA_HINT
  );

  const reviewed = ReviewerResponseSchema.parse(raw);
  const highRisks = reviewed.riskChecklist.filter((r) => r.severity === "high");

  const impactAreas = [
    input.impact.ui,
    input.impact.api,
    input.impact.database,
    input.impact.security,
    input.impact.integrations,
    input.impact.testingImpact,
  ].filter((area) => area.length > 0).length;

  const testCategories = Object.values(input.tests).filter(
    (cases) => cases.length > 0
  ).length;

  const score = computeReadinessScore({
    openQuestions: input.clarified.openQuestions,
    assumptions: input.clarified.assumptions,
    impactAreasPopulated: impactAreas,
    implementationTaskCount: input.implementation.length,
    testCategoriesPopulated: testCategories,
    highRisks,
  });

  const status = deriveReadinessStatus(
    input.clarified.openQuestions,
    highRisks,
    score
  );

  const deliveryReadiness = DeliveryReadinessSchema.parse({
    score,
    confidence: deriveConfidence(score, input.clarified.openQuestions),
    status,
    approvalNeeds: reviewed.approvalNeeds,
    recommendation: reviewed.recommendation,
  });

  return {
    riskChecklist: reviewed.riskChecklist,
    reviewChecklist: reviewed.reviewChecklist,
    deliveryReadiness,
  };
}
