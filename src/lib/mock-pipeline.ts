import type { PipelineInput, SdlcPipeline } from "@/lib/schemas/sdlc-pipeline";
import { SdlcPipelineSchema } from "@/lib/schemas/sdlc-pipeline";

function extractFeatureName(requirement: string): string {
  const firstLine = requirement.split("\n").find((l) => l.trim().length > 0)?.trim();
  return firstLine?.replace(/^#+\s*/, "").slice(0, 80) || "Feature request";
}

export function generateMockPipeline(input: PipelineInput): SdlcPipeline {
  const feature = extractFeatureName(input.requirement);
  const isApprovalWorkflow =
    /approval|approver|document|workflow/i.test(input.requirement);

  const pipeline: SdlcPipeline = {
    clarifiedRequirement: {
      summary: isApprovalWorkflow
        ? "Implement a multi-role document approval workflow with audit trail and notifications."
        : `Deliver the requested capability: ${feature}`,
      userStory: isApprovalWorkflow
        ? "As a document creator, I want to submit documents for approval so that approvers can review, approve, or reject with a full audit trail."
        : `As a user, I want ${feature.toLowerCase()} so that the business outcome is achieved with clear scope and controls.`,
      assumptions: [
        "Existing authentication and role management can be extended for creator, approver, and external collaborator roles.",
        "Documents are stored in the existing file/document service with metadata.",
        "Email notifications use the organization's existing notification provider.",
        "Approval states follow: Draft → Submitted → In Review → Approved / Rejected / Changes Requested.",
      ],
      openQuestions: isApprovalWorkflow
        ? [
            "Can external collaborators view documents before approval is requested?",
            "What is the SLA for approver response before escalation?",
            "Are multi-level approvals (sequential approvers) required in MVP?",
          ]
        : [
            "What are the non-functional requirements (performance, availability)?",
            "Which user roles are in scope for the first release?",
          ],
      outOfScope: [
        "Bulk document migration from legacy systems",
        "Offline/mobile-native clients",
        "Custom e-signature integrations beyond basic approval actions",
      ],
    },
    impactAnalysis: {
      affectedModules: [
        "Document Management UI",
        "Approval Workflow Service",
        "Notification Service",
        "Audit Log Module",
        "Role & Permission Management",
      ],
      ui: [
        "Document upload and submission screens",
        "Approver dashboard with action buttons (approve/reject/request changes)",
        "External collaborator read-only/comment view",
        "Status timeline and audit history panel",
      ],
      api: [
        "POST /documents — upload and create draft",
        "POST /documents/{id}/submit — submit for approval",
        "POST /documents/{id}/approve | reject | request-changes",
        "GET /documents/{id}/audit-trail",
        "POST /documents/{id}/comments — collaborator comments",
      ],
      database: [
        "documents table — status, owner, current approver",
        "approval_actions table — action type, actor, timestamp, comment",
        "document_comments table — collaborator feedback",
        "notification_queue table — pending email events",
      ],
      security: [
        "Role-based access control for creator, approver, external collaborator",
        "Authorization checks on every state transition",
        "Audit immutability for compliance",
        "PII handling in notification payloads",
      ],
      integrations: [
        "Email provider (SendGrid/SES) for status change notifications",
        "Optional SSO identity provider for external collaborators",
      ],
      testingImpact: [
        "State machine transition tests for all approval paths",
        "Permission matrix tests per role",
        "End-to-end workflow tests with multiple actors",
      ],
    },
    implementationPlan: [
      {
        id: "TASK-001",
        title: "Define approval workflow state machine",
        description:
          "Model document states and valid transitions. Document business rules for submit, approve, reject, and request-changes actions.",
        sequence: 1,
      },
      {
        id: "TASK-002",
        title: "Extend data model and migrations",
        description:
          "Add documents, approval_actions, comments, and notification_queue tables with indexes for status queries.",
        sequence: 2,
        dependencies: ["TASK-001"],
      },
      {
        id: "TASK-003",
        title: "Implement RBAC policies",
        description:
          "Define permissions for creators, approvers, and external collaborators. Enforce on API middleware.",
        sequence: 3,
        dependencies: ["TASK-001"],
      },
      {
        id: "TASK-004",
        title: "Build workflow API endpoints",
        description:
          "Implement submit, approve, reject, request-changes, audit-trail, and comment endpoints with validation.",
        sequence: 4,
        dependencies: ["TASK-002", "TASK-003"],
      },
      {
        id: "TASK-005",
        title: "Build creator and approver UI flows",
        description:
          "Upload/submit screens, approver action panel, status timeline, and collaborator comment UI.",
        sequence: 5,
        dependencies: ["TASK-004"],
      },
      {
        id: "TASK-006",
        title: "Integrate email notifications",
        description:
          "Send templated emails on status changes. Queue retries and log delivery status.",
        sequence: 6,
        dependencies: ["TASK-004"],
      },
      {
        id: "TASK-007",
        title: "Add audit logging and observability",
        description:
          "Structured logs for all transitions. Dashboards for failed notifications and stuck approvals.",
        sequence: 7,
        dependencies: ["TASK-004", "TASK-006"],
      },
    ],
    testPlan: {
      unit: [
        "State machine rejects invalid transitions (e.g., approve from Draft)",
        "RBAC helper returns correct permissions per role",
        "Notification payload builder masks sensitive fields",
      ],
      api: [
        "POST submit returns 403 for non-owner creator",
        "POST approve transitions status and writes audit record",
        "GET audit-trail returns ordered actions with actor metadata",
        "External collaborator POST approve returns 403",
      ],
      ui: [
        "Creator can upload, save draft, and submit for approval",
        "Approver sees pending queue and can approve/reject/request changes",
        "Collaborator can comment but cannot see approve actions",
        "Status timeline reflects each transition with timestamps",
      ],
      regression: [
        "Existing document list/search unaffected after workflow rollout",
        "Legacy documents without workflow metadata remain accessible",
      ],
      negative: [
        "Double-submit approval action is idempotent or rejected",
        "Missing required comment on reject returns 400",
        "Expired session mid-approval redirects to login",
      ],
      security: [
        "Horizontal privilege escalation: user A cannot approve user B's document",
        "Audit records cannot be modified via API",
        "Comment input sanitized against XSS",
        "Rate limiting on submit and comment endpoints",
      ],
    },
    riskChecklist: [
      {
        category: "delivery",
        risk: "Open questions on multi-level approval may expand scope mid-sprint",
        mitigation: "Confirm MVP approval model with stakeholders before TASK-004",
        severity: "medium",
      },
      {
        category: "security",
        risk: "External collaborator access boundaries unclear",
        mitigation: "Define least-privilege policy and add permission matrix tests",
        severity: "high",
      },
      {
        category: "data",
        risk: "Audit log growth without retention policy",
        mitigation: "Define retention/archival strategy before production rollout",
        severity: "medium",
      },
      {
        category: "performance",
        risk: "Approver queue queries slow at scale",
        mitigation: "Index status + approver_id; paginate dashboard lists",
        severity: "low",
      },
      {
        category: "rollout",
        risk: "Email notification failures block perceived workflow completion",
        mitigation: "Async queue with retry; in-app notification fallback",
        severity: "medium",
      },
      {
        category: "dependency",
        risk: "Email provider outage affects notifications",
        mitigation: "Circuit breaker and dead-letter queue monitoring",
        severity: "low",
      },
    ],
    reviewChecklist: [
      "State transitions enforced in single domain service (no duplicated logic in UI)",
      "All API endpoints have authorization tests",
      "Audit records are append-only",
      "Notification templates reviewed for PII compliance",
      "Database migrations are backward compatible",
      "Feature flagged for phased rollout",
    ],
    deliveryReadiness: {
      score: 72,
      confidence: "medium",
      status: "needs_clarification",
      approvalNeeds: [
        "Product sign-off on multi-level approval scope",
        "Security review for external collaborator access model",
        "Legal/compliance review of audit retention requirements",
      ],
      recommendation:
        "Proceed with technical spike on RBAC and state machine (TASK-001–003) while clarifying open questions. Defer full UI build until approval model is confirmed.",
    },
  };

  return SdlcPipelineSchema.parse(pipeline);
}
