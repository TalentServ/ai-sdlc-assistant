import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadinessScore } from "@/components/ReadinessScore";
import type { DeliveryReadiness } from "@/lib/schemas/sdlc-pipeline";

const baseReadiness: DeliveryReadiness = {
  score: 72,
  confidence: "medium",
  status: "needs_clarification",
  approvalNeeds: ["Product sign-off on approval model"],
  recommendation: "Clarify open questions before implementation.",
};

describe("UI: ReadinessScore", () => {
  it("renders score, status label, and recommendation", () => {
    render(<ReadinessScore readiness={baseReadiness} />);

    expect(screen.getByText("Delivery readiness")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("Needs clarification")).toBeInTheDocument();
    expect(screen.getByText(/Clarify open questions/)).toBeInTheDocument();
  });

  it("renders approval needs when present", () => {
    render(<ReadinessScore readiness={baseReadiness} />);

    expect(screen.getByText("Approval needs")).toBeInTheDocument();
    expect(screen.getByText(/Product sign-off/)).toBeInTheDocument();
  });

  it("shows Ready status for a ready pipeline", () => {
    const ready: DeliveryReadiness = {
      ...baseReadiness,
      score: 88,
      status: "ready",
      confidence: "high",
      approvalNeeds: [],
      recommendation: "Proceed with implementation.",
    };

    render(<ReadinessScore readiness={ready} />);

    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
  });
});
