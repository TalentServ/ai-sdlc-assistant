import { z } from "zod";

export const ClarifiedRequirementSchema = z.object({
  summary: z.string(),
  userStory: z.string(),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  outOfScope: z.array(z.string()),
});

export const ImpactAnalysisSchema = z.object({
  affectedModules: z.array(z.string()),
  ui: z.array(z.string()),
  api: z.array(z.string()),
  database: z.array(z.string()),
  security: z.array(z.string()),
  integrations: z.array(z.string()),
  testingImpact: z.array(z.string()),
});

export const ImplementationTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sequence: z.number(),
  dependencies: z.array(z.string()).optional(),
});

export const TestPlanSchema = z.object({
  unit: z.array(z.string()),
  api: z.array(z.string()),
  ui: z.array(z.string()),
  regression: z.array(z.string()),
  negative: z.array(z.string()),
  security: z.array(z.string()),
});

export const RiskItemSchema = z.object({
  category: z.enum([
    "delivery",
    "security",
    "data",
    "performance",
    "rollout",
    "dependency",
  ]),
  risk: z.string(),
  mitigation: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});

export const DeliveryReadinessSchema = z.object({
  score: z.number().min(0).max(100),
  confidence: z.enum(["low", "medium", "high"]),
  status: z.enum(["ready", "needs_clarification", "high_risk"]),
  approvalNeeds: z.array(z.string()),
  recommendation: z.string(),
});

export const SdlcPipelineSchema = z.object({
  clarifiedRequirement: ClarifiedRequirementSchema,
  impactAnalysis: ImpactAnalysisSchema,
  implementationPlan: z.array(ImplementationTaskSchema),
  testPlan: TestPlanSchema,
  riskChecklist: z.array(RiskItemSchema),
  reviewChecklist: z.array(z.string()),
  deliveryReadiness: DeliveryReadinessSchema,
});

export type ClarifiedRequirement = z.infer<typeof ClarifiedRequirementSchema>;
export type ImpactAnalysis = z.infer<typeof ImpactAnalysisSchema>;
export type ImplementationTask = z.infer<typeof ImplementationTaskSchema>;
export type TestPlan = z.infer<typeof TestPlanSchema>;
export type RiskItem = z.infer<typeof RiskItemSchema>;
export type DeliveryReadiness = z.infer<typeof DeliveryReadinessSchema>;
export type SdlcPipeline = z.infer<typeof SdlcPipelineSchema>;

export const PipelineInputSchema = z.object({
  requirement: z.string().min(10, "Requirement must be at least 10 characters"),
  context: z.string().optional(),
  architectureRules: z.string().optional(),
});

export type PipelineInput = z.infer<typeof PipelineInputSchema>;

export const AGENT_STAGES = [
  "requirement_analyzer",
  "impact_analyzer",
  "implementation_planner",
  "test_planner",
  "readiness_reviewer",
] as const;

export type AgentStage = (typeof AGENT_STAGES)[number];

export const AGENT_STAGE_LABELS: Record<AgentStage, string> = {
  requirement_analyzer: "Requirement Analyzer",
  impact_analyzer: "Impact Analyzer",
  implementation_planner: "Implementation Planner",
  test_planner: "Test Planner",
  readiness_reviewer: "Readiness Reviewer",
};
