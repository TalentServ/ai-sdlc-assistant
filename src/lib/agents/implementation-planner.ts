import { generateStructuredJson } from "@/lib/ai/client";
import {
  ImplementationTaskSchema,
  type ClarifiedRequirement,
  type ImpactAnalysis,
  type ImplementationTask,
} from "@/lib/schemas/sdlc-pipeline";
import { z } from "zod";

const TasksResponseSchema = z.object({
  tasks: z.array(ImplementationTaskSchema),
});

const SCHEMA_HINT = `{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "string",
      "description": "string",
      "sequence": 1,
      "dependencies": ["TASK-000"]
    }
  ]
}`;

const SYSTEM_PROMPT = `You are an Implementation Planner agent in an SDLC pipeline.
Generate sequenced, developer-ready technical tasks with logical ordering and dependencies.
Tasks should be actionable and suitable for sprint planning.`;

export async function runImplementationPlanner(
  clarified: ClarifiedRequirement,
  impact: ImpactAnalysis
): Promise<ImplementationTask[]> {
  const userPrompt = [
    `Clarified requirement:\n${JSON.stringify(clarified, null, 2)}`,
    `\nImpact analysis:\n${JSON.stringify(impact, null, 2)}`,
  ].join("");

  const raw = await generateStructuredJson<unknown>(
    SYSTEM_PROMPT,
    userPrompt,
    SCHEMA_HINT
  );

  return TasksResponseSchema.parse(raw).tasks.sort((a, b) => a.sequence - b.sequence);
}
