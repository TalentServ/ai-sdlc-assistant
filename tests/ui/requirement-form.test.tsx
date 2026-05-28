import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RequirementForm } from "@/components/RequirementForm";

describe("UI: RequirementForm", () => {
  it("disables generate button when requirement is too short", () => {
    render(
      <RequirementForm
        requirement="short"
        context=""
        architectureRules=""
        onRequirementChange={vi.fn()}
        onContextChange={vi.fn()}
        onArchitectureRulesChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByRole("button", { name: /Generate SDLC pipeline/i })).toBeDisabled();
  });

  it("enables generate button when requirement meets minimum length", () => {
    render(
      <RequirementForm
        requirement="Add document approval workflow for creators and approvers."
        context=""
        architectureRules=""
        onRequirementChange={vi.fn()}
        onContextChange={vi.fn()}
        onArchitectureRulesChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByRole("button", { name: /Generate SDLC pipeline/i })).toBeEnabled();
  });

  it("calls onSubmit when generate is clicked", () => {
    const onSubmit = vi.fn();

    render(
      <RequirementForm
        requirement="Add document approval workflow for creators and approvers."
        context="Existing API"
        architectureRules="RBAC required"
        onRequirementChange={vi.fn()}
        onContextChange={vi.fn()}
        onArchitectureRulesChange={vi.fn()}
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Generate SDLC pipeline/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("shows loading label while pipeline is running", () => {
    render(
      <RequirementForm
        requirement="Add document approval workflow for creators and approvers."
        context=""
        architectureRules=""
        onRequirementChange={vi.fn()}
        onContextChange={vi.fn()}
        onArchitectureRulesChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByRole("button", { name: /Generating SDLC pipeline/i })).toBeDisabled();
  });
});
