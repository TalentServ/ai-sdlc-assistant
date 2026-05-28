import { describe, expect, it } from "vitest";
import {
  SdlcPipelineSchema,
  TestPlanSchema,
} from "@/lib/schemas/sdlc-pipeline";
import { generateMockPipeline } from "@/lib/mock-pipeline";

const sampleInput = {
  requirement:
    "Add document approval workflow for creators, approvers, and external collaborators.",
};

describe("SdlcPipelineSchema", () => {
  it("validates a complete mock pipeline output", () => {
    const pipeline = generateMockPipeline(sampleInput);
    expect(() => SdlcPipelineSchema.parse(pipeline)).not.toThrow();
  });

  it("rejects missing required sections", () => {
    expect(() =>
      SdlcPipelineSchema.parse({
        clarifiedRequirement: {},
      })
    ).toThrow();
  });
});

describe("Test plan categories", () => {
  it("includes all six test categories in mock output", () => {
    const pipeline = generateMockPipeline(sampleInput);
    const parsed = TestPlanSchema.parse(pipeline.testPlan);
    expect(parsed.unit.length).toBeGreaterThan(0);
    expect(parsed.api.length).toBeGreaterThan(0);
    expect(parsed.ui.length).toBeGreaterThan(0);
    expect(parsed.regression.length).toBeGreaterThan(0);
    expect(parsed.negative.length).toBeGreaterThan(0);
    expect(parsed.security.length).toBeGreaterThan(0);
  });
});

describe("Implementation plan", () => {
  it("sequences tasks with unique sequence numbers", () => {
    const pipeline = generateMockPipeline(sampleInput);
    const sequences = pipeline.implementationPlan.map((t) => t.sequence);
    expect(new Set(sequences).size).toBe(sequences.length);
    expect(Math.min(...sequences)).toBe(1);
  });
});

describe("Risk checklist", () => {
  it("includes severity and mitigation for each risk", () => {
    const pipeline = generateMockPipeline(sampleInput);
    for (const risk of pipeline.riskChecklist) {
      expect(risk.risk.length).toBeGreaterThan(0);
      expect(risk.mitigation.length).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(risk.severity);
    }
  });
});
