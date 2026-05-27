import { generateStructuredJson } from "@/lib/ai/client";
import {
  TestPlanSchema,
  type ClarifiedRequirement,
  type ImplementationTask,
  type TestPlan,
} from "@/lib/schemas/sdlc-pipeline";

const SCHEMA_HINT = `{
  "unit": ["string"],
  "api": ["string"],
  "ui": ["string"],
  "regression": ["string"],
  "negative": ["string"],
  "security": ["string"]
}`;

const SYSTEM_PROMPT = `You are a Test Planner agent in an SDLC pipeline.
Generate detailed test scenarios across unit, API, UI, regression, negative, and security categories.
Each item should be a specific, verifiable test case or scenario description.`;

export async function runTestPlanner(
  clarified: ClarifiedRequirement,
  implementation: ImplementationTask[]
): Promise<TestPlan> {
  const userPrompt = [
    `Clarified requirement:\n${JSON.stringify(clarified, null, 2)}`,
    `\nImplementation plan:\n${JSON.stringify(implementation, null, 2)}`,
  ].join("");

  const raw = await generateStructuredJson<unknown>(
    SYSTEM_PROMPT,
    userPrompt,
    SCHEMA_HINT
  );

  return TestPlanSchema.parse(raw);
}
