import { generateStructuredJson } from "@/lib/ai/client";
import {
  ClarifiedRequirementSchema,
  type ClarifiedRequirement,
  type PipelineInput,
} from "@/lib/schemas/sdlc-pipeline";

const SCHEMA_HINT = `{
  "summary": "string",
  "userStory": "As a ... I want ... so that ...",
  "assumptions": ["string"],
  "openQuestions": ["string"],
  "outOfScope": ["string"]
}`;

const SYSTEM_PROMPT = `You are a Requirement Analyzer agent in an SDLC pipeline.
Summarize the business requirement, rewrite it as a clear user story, list assumptions,
open clarifying questions, and explicit out-of-scope items. Be specific and developer-ready.`;

export async function runRequirementAnalyzer(
  input: PipelineInput
): Promise<ClarifiedRequirement> {
  const userPrompt = [
    `Requirement:\n${input.requirement}`,
    input.context ? `\nModule/context:\n${input.context}` : "",
    input.architectureRules
      ? `\nArchitecture rules:\n${input.architectureRules}`
      : "",
  ].join("");

  const raw = await generateStructuredJson<unknown>(
    SYSTEM_PROMPT,
    userPrompt,
    SCHEMA_HINT
  );

  return ClarifiedRequirementSchema.parse(raw);
}
