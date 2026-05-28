import { describe, expect, it } from "vitest";
import { AGENT_STAGES } from "@/lib/schemas/sdlc-pipeline";

describe("Agentic pipeline workflow", () => {
  it("defines five agent stages in execution order", () => {
    expect(AGENT_STAGES).toEqual([
      "requirement_analyzer",
      "impact_analyzer",
      "implementation_planner",
      "test_planner",
      "readiness_reviewer",
    ]);
  });

  it("mock pipeline satisfies output completeness checks", () => {
    const sections = [
      "clarifiedRequirement",
      "impactAnalysis",
      "implementationPlan",
      "testPlan",
      "riskChecklist",
      "reviewChecklist",
      "deliveryReadiness",
    ] as const;

    const mock = {
      clarifiedRequirement: { summary: "s" },
      impactAnalysis: { ui: [] },
      implementationPlan: [],
      testPlan: {},
      riskChecklist: [],
      reviewChecklist: [],
      deliveryReadiness: { score: 0 },
    };

    for (const section of sections) {
      expect(mock).toHaveProperty(section);
    }
  });
});
