import { describe, expect, it, vi, beforeEach } from "vitest";
import { runPipeline } from "@/lib/orchestrator/runPipeline";
import { pipelineToMarkdown } from "@/lib/markdown-export";
import { AGENT_STAGES } from "@/lib/schemas/sdlc-pipeline";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

describe("Regression: SDLC pipeline workflow", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it("mock pipeline output remains schema-valid across releases", async () => {
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);
    expect(pipeline.deliveryReadiness.score).toBeGreaterThan(0);
    expect(pipeline.riskChecklist.length).toBeGreaterThan(0);
  });

  it("orchestrator reports mock stage completion in demo mode", async () => {
    const stages: string[] = [];
    await runPipeline(SAMPLE_PIPELINE_INPUT, (_stage, status) => {
      if (status === "completed") stages.push(_stage);
    });

    expect(stages).toEqual([...AGENT_STAGES]);
  });

  it("markdown export still includes all required headings", async () => {
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);
    const markdown = pipelineToMarkdown(pipeline);

    for (const heading of [
      "## Clarified Requirement",
      "## Impact Analysis",
      "## Implementation Plan",
      "## Test Plan",
      "## Risk Checklist",
      "## Delivery Readiness",
    ]) {
      expect(markdown).toContain(heading);
    }
  });

  it("agent stage order remains stable for live mode contract", () => {
    expect(AGENT_STAGES).toEqual([
      "requirement_analyzer",
      "impact_analyzer",
      "implementation_planner",
      "test_planner",
      "readiness_reviewer",
    ]);
  });
});

describe("Regression: approval workflow sample", () => {
  it("continues to detect approval workflow keywords in mock output", async () => {
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);

    expect(pipeline.clarifiedRequirement.summary.toLowerCase()).toContain("approval");
    expect(pipeline.impactAnalysis.api.some((item) => /approve|reject/i.test(item))).toBe(
      true
    );
  });
});
