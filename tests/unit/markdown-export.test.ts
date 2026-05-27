import { describe, expect, it } from "vitest";
import { pipelineToMarkdown } from "@/lib/markdown-export";
import { generateMockPipeline } from "@/lib/mock-pipeline";

describe("pipelineToMarkdown", () => {
  it("includes all major sections in exported markdown", () => {
    const pipeline = generateMockPipeline({
      requirement: "Add document approval workflow",
    });
    const markdown = pipelineToMarkdown(pipeline);

    expect(markdown).toContain("# SDLC Pipeline Report");
    expect(markdown).toContain("## Clarified Requirement");
    expect(markdown).toContain("## Impact Analysis");
    expect(markdown).toContain("## Implementation Plan");
    expect(markdown).toContain("## Test Plan");
    expect(markdown).toContain("## Risk Checklist");
    expect(markdown).toContain("## Review Checklist");
    expect(markdown).toContain("## Delivery Readiness");
  });
});
