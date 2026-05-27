import { describe, expect, it } from "vitest";
import { runPipeline } from "@/lib/orchestrator/runPipeline";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

const TEST_CATEGORIES = ["unit", "api", "ui", "regression", "negative", "security"] as const;

describe("Unit: orchestrator", () => {
  it("returns mock pipeline when OPENAI_API_KEY is unset", async () => {
    delete process.env.OPENAI_API_KEY;
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);

    expect(pipeline.clarifiedRequirement.userStory).toMatch(/^As a /);
    expect(pipeline.implementationPlan.every((t) => t.sequence >= 1)).toBe(true);
  });

  it("invokes progress callback for completed mock stage", async () => {
    delete process.env.OPENAI_API_KEY;
    const completed: string[] = [];

    await runPipeline(SAMPLE_PIPELINE_INPUT, (stage, status) => {
      if (status === "completed") completed.push(stage);
    });

    expect(completed).toEqual([
      "requirement_analyzer",
      "impact_analyzer",
      "implementation_planner",
      "test_planner",
      "readiness_reviewer",
    ]);
  });
});

describe("Unit: mock test plan categories", () => {
  it("populates all six test scenario categories", async () => {
    delete process.env.OPENAI_API_KEY;
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);

    for (const category of TEST_CATEGORIES) {
      expect(pipeline.testPlan[category].length).toBeGreaterThan(0);
    }
  });

  it("includes realistic unit test scenarios for approval workflow", async () => {
    delete process.env.OPENAI_API_KEY;
    const pipeline = await runPipeline(SAMPLE_PIPELINE_INPUT);

    expect(
      pipeline.testPlan.unit.some((scenario) => /state machine|RBAC|transition/i.test(scenario))
    ).toBe(true);
  });
});
