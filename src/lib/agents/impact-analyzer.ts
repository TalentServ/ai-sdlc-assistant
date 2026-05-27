import { generateStructuredJson } from "@/lib/ai/client";
import {
  ImpactAnalysisSchema,
  type ClarifiedRequirement,
  type ImpactAnalysis,
  type PipelineInput,
} from "@/lib/schemas/sdlc-pipeline";

const SCHEMA_HINT = `{
  "affectedModules": ["string"],
  "ui": ["string"],
  "api": ["string"],
  "database": ["string"],
  "security": ["string"],
  "integrations": ["string"],
  "testingImpact": ["string"]
}`;

const SYSTEM_PROMPT = `You are an Impact Analyzer agent in an SDLC pipeline.
Assess likely impact across UI, API, database, security, integrations, and testing.
Identify affected modules/components. Be concrete about change areas.`;

export async function runImpactAnalyzer(
  clarified: ClarifiedRequirement,
  input: PipelineInput
): Promise<ImpactAnalysis> {
  const userPrompt = [
    `Clarified requirement:\n${JSON.stringify(clarified, null, 2)}`,
    input.context ? `\nExisting context:\n${input.context}` : "",
    input.architectureRules
      ? `\nArchitecture rules:\n${input.architectureRules}`
      : "",
  ].join("");

  const raw = await generateStructuredJson<unknown>(
    SYSTEM_PROMPT,
    userPrompt,
    SCHEMA_HINT
  );

  return ImpactAnalysisSchema.parse(raw);
}
