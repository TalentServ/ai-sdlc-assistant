import type { PipelineInput } from "@/lib/schemas/sdlc-pipeline";

export const SAMPLE_REQUIREMENT = `# Feature: Document Approval Workflow

Add a document approval workflow for creators, approvers, and external collaborators.
Creators upload documents and submit for approval.
Approvers can approve, reject, or request changes.
External collaborators can comment but not approve.
Audit trail required for all actions.`;

export const SAMPLE_PIPELINE_INPUT: PipelineInput = {
  requirement: SAMPLE_REQUIREMENT,
  context: "Next.js frontend, REST API backend, PostgreSQL database",
  architectureRules: "Layered architecture, RBAC on all mutations, Zod validation",
};

export const MINIMAL_REQUIREMENT =
  "Add user profile avatar upload with size and type validation.";
