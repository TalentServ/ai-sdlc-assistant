import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PipelineResults } from "@/components/PipelineResults";
import { generateMockPipeline } from "@/lib/mock-pipeline";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

describe("UI: PipelineResults", () => {
  const pipeline = generateMockPipeline(SAMPLE_PIPELINE_INPUT);

  it("renders all SDLC section headings", () => {
    render(
      <PipelineResults pipeline={pipeline} onExport={vi.fn()} onCopy={vi.fn()} />
    );

    expect(screen.getByText("Clarified requirement")).toBeInTheDocument();
    expect(screen.getByText("Impact analysis")).toBeInTheDocument();
    expect(screen.getByText("Implementation plan")).toBeInTheDocument();
    expect(screen.getByText("Test plan")).toBeInTheDocument();
    expect(screen.getByText("Risk checklist")).toBeInTheDocument();
    expect(screen.getByText("Review checklist")).toBeInTheDocument();
  });

  it("renders export and copy actions", () => {
    render(
      <PipelineResults pipeline={pipeline} onExport={vi.fn()} onCopy={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: /Copy Markdown/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download .md/i })).toBeInTheDocument();
  });
});
