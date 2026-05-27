import type { PipelineInput, SdlcPipeline } from "@/lib/schemas/sdlc-pipeline";
import { AGENT_STAGES, SdlcPipelineSchema } from "@/lib/schemas/sdlc-pipeline";
import { runRequirementAnalyzer } from "@/lib/agents/requirement-analyzer";
import { runImpactAnalyzer } from "@/lib/agents/impact-analyzer";
import { runImplementationPlanner } from "@/lib/agents/implementation-planner";
import { runTestPlanner } from "@/lib/agents/test-planner";
import { runReadinessReviewer } from "@/lib/agents/readiness-reviewer";
import { generateMockPipeline } from "@/lib/mock-pipeline";

export type PipelineProgressCallback = (
  stage: string,
  status: "started" | "completed"
) => void;

export type RunPipelineOptions = {
  /** Adds short delays between mock stages so progress UI is visible. */
  simulateProgress?: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runPipeline(
  input: PipelineInput,
  onProgress?: PipelineProgressCallback,
  options?: RunPipelineOptions
): Promise<SdlcPipeline> {
  if (!process.env.OPENAI_API_KEY) {
    for (const stage of AGENT_STAGES) {
      onProgress?.(stage, "started");
      if (options?.simulateProgress) {
        await sleep(450);
      }
      onProgress?.(stage, "completed");
    }
    return generateMockPipeline(input);
  }

  onProgress?.("requirement_analyzer", "started");
  const clarified = await runRequirementAnalyzer(input);
  onProgress?.("requirement_analyzer", "completed");

  onProgress?.("impact_analyzer", "started");
  const impact = await runImpactAnalyzer(clarified, input);
  onProgress?.("impact_analyzer", "completed");

  onProgress?.("implementation_planner", "started");
  const implementation = await runImplementationPlanner(clarified, impact);
  onProgress?.("implementation_planner", "completed");

  onProgress?.("test_planner", "started");
  const tests = await runTestPlanner(clarified, implementation);
  onProgress?.("test_planner", "completed");

  onProgress?.("readiness_reviewer", "started");
  const readiness = await runReadinessReviewer({
    clarified,
    impact,
    implementation,
    tests,
  });
  onProgress?.("readiness_reviewer", "completed");

  return SdlcPipelineSchema.parse({
    clarifiedRequirement: clarified,
    impactAnalysis: impact,
    implementationPlan: implementation,
    testPlan: tests,
    riskChecklist: readiness.riskChecklist,
    reviewChecklist: readiness.reviewChecklist,
    deliveryReadiness: readiness.deliveryReadiness,
  });
}
