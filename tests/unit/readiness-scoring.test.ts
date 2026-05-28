import { describe, expect, it } from "vitest";
import {
  computeReadinessScore,
  deriveReadinessStatus,
} from "@/lib/readiness-scoring";
import type { RiskItem } from "@/lib/schemas/sdlc-pipeline";

describe("deriveReadinessStatus", () => {
  it("marks pipeline as needs_clarification when open questions exist", () => {
    const status = deriveReadinessStatus(
      ["Who approves external collaborators?"],
      [],
      72
    );
    expect(status).toBe("needs_clarification");
  });

  it("marks pipeline as high_risk when high-severity risks exist", () => {
    const highRisks: RiskItem[] = [
      {
        category: "security",
        risk: "External access too broad",
        mitigation: "Restrict permissions",
        severity: "high",
      },
    ];
    const status = deriveReadinessStatus([], highRisks, 90);
    expect(status).toBe("high_risk");
  });

  it("marks pipeline as ready when score is high and no blockers", () => {
    const status = deriveReadinessStatus([], [], 85);
    expect(status).toBe("ready");
  });
});

describe("computeReadinessScore", () => {
  it("returns a score between 0 and 100", () => {
    const score = computeReadinessScore({
      openQuestions: [],
      assumptions: ["Documented"],
      impactAreasPopulated: 6,
      implementationTaskCount: 5,
      testCategoriesPopulated: 6,
      highRisks: [],
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("penalizes open questions and high risks", () => {
    const clean = computeReadinessScore({
      openQuestions: [],
      assumptions: ["A"],
      impactAreasPopulated: 5,
      implementationTaskCount: 4,
      testCategoriesPopulated: 6,
      highRisks: [],
    });
    const risky = computeReadinessScore({
      openQuestions: ["Q1", "Q2"],
      assumptions: [],
      impactAreasPopulated: 2,
      implementationTaskCount: 1,
      testCategoriesPopulated: 2,
      highRisks: [
        {
          category: "security",
          risk: "R",
          mitigation: "M",
          severity: "high",
        },
      ],
    });
    expect(clean).toBeGreaterThan(risky);
  });
});
