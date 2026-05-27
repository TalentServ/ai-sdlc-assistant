export type ScenarioMeta = {
  id: string;
  category: string;
  description: string;
  expected: string;
};

/** Lookup table keyed by `filename::test name` for unambiguous scenario metadata. */
export const SCENARIO_CATALOG: Record<string, ScenarioMeta> = {
  "pipeline.route.test.ts::returns 401 when the caller is not authenticated": {
    id: "A-01",
    category: "API",
    description: "POST /api/pipeline without auth",
    expected: "401 Unauthorized",
  },
  "pipeline.route.test.ts::returns a complete SDLC pipeline for a valid requirement": {
    id: "A-02",
    category: "API",
    description: "POST /api/pipeline with valid requirement",
    expected: "200 + full pipeline JSON",
  },
  "pipeline.route.test.ts::includes all six test plan categories in the response": {
    id: "A-03",
    category: "API",
    description: "Pipeline response test plan completeness",
    expected: "Each test plan category array is non-empty",
  },
  "pipeline.route.test.ts::returns delivery readiness score between 0 and 100": {
    id: "A-04",
    category: "API",
    description: "Delivery readiness score in pipeline response",
    expected: "Score 0–100 with valid status enum",
  },
  "pipeline.route.test.ts::streams progress events when Accept is application/x-ndjson": {
    id: "A-08",
    category: "API",
    description: "Streaming pipeline progress for live UI updates",
    expected: "NDJSON progress + complete events returned",
  },
  "export.route.test.ts::returns 401 when the caller is not authenticated": {
    id: "A-05",
    category: "API",
    description: "POST /api/export without auth",
    expected: "401 Unauthorized",
  },
  "export.route.test.ts::returns markdown with attachment headers for a valid pipeline": {
    id: "A-06",
    category: "API",
    description: "POST /api/export with valid pipeline",
    expected: "Markdown body + Content-Disposition attachment",
  },
  "export.route.test.ts::returns 400 when pipeline payload fails schema validation": {
    id: "A-07",
    category: "API",
    description: "POST /api/export with invalid pipeline",
    expected: "400 with error message",
  },
  "schema.test.ts::validates a complete mock pipeline output": {
    id: "U-01",
    category: "Unit",
    description: "Validate complete mock pipeline against Zod schema",
    expected: "Parse succeeds",
  },
  "schema.test.ts::rejects missing required sections": {
    id: "U-02",
    category: "Unit",
    description: "Reject pipeline missing required sections",
    expected: "Schema throws",
  },
  "readiness-scoring.test.ts::returns a score between 0 and 100": {
    id: "U-03",
    category: "Unit",
    description: "Readiness score stays within 0–100",
    expected: "Score in range",
  },
  "readiness-scoring.test.ts::marks pipeline as needs_clarification when open questions exist": {
    id: "U-04",
    category: "Unit",
    description: "Open questions drive needs_clarification status",
    expected: "Status derived correctly",
  },
  "readiness-scoring.test.ts::marks pipeline as high_risk when high-severity risks exist": {
    id: "U-05",
    category: "Unit",
    description: "High-severity risks drive high_risk status",
    expected: "Status derived correctly",
  },
  "markdown-export.test.ts::includes all major sections in exported markdown": {
    id: "U-06",
    category: "Unit",
    description: "Markdown export includes all major headings",
    expected: "All sections present",
  },
  "orchestrator.test.ts::returns mock pipeline when OPENAI_API_KEY is unset": {
    id: "U-07",
    category: "Unit",
    description: "Mock orchestrator runs without OpenAI key",
    expected: "Pipeline returned",
  },
  "orchestrator.test.ts::populates all six test scenario categories": {
    id: "U-08",
    category: "Unit",
    description: "All six test plan categories populated in mock output",
    expected: "Each category has items",
  },
  "readiness-score.test.tsx::renders score, status label, and recommendation": {
    id: "UI-01",
    category: "UI",
    description: "ReadinessScore shows score and status",
    expected: "Score, label, recommendation visible",
  },
  "readiness-score.test.tsx::renders approval needs when present": {
    id: "UI-02",
    category: "UI",
    description: "ReadinessScore lists approval needs",
    expected: "Approval items rendered",
  },
  "readiness-score.test.tsx::shows Ready status for a ready pipeline": {
    id: "UI-03",
    category: "UI",
    description: "Ready status displays Ready label",
    expected: "Correct badge text",
  },
  "requirement-form.test.tsx::disables generate button when requirement is too short": {
    id: "UI-04",
    category: "UI",
    description: "Generate button disabled for short requirement",
    expected: "Button disabled",
  },
  "requirement-form.test.tsx::enables generate button when requirement meets minimum length": {
    id: "UI-05",
    category: "UI",
    description: "Generate button enabled for valid requirement",
    expected: "Button enabled",
  },
  "requirement-form.test.tsx::calls onSubmit when generate is clicked": {
    id: "UI-06",
    category: "UI",
    description: "Click Generate invokes submit handler",
    expected: "onSubmit called",
  },
  "requirement-form.test.tsx::shows loading label while pipeline is running": {
    id: "UI-07",
    category: "UI",
    description: "Loading state shows generating label",
    expected: "Button disabled + loading text",
  },
  "pipeline-results.test.tsx::renders all SDLC section headings": {
    id: "UI-08",
    category: "UI",
    description: "PipelineResults renders all SDLC sections",
    expected: "Six section headings visible",
  },
  "pipeline-results.test.tsx::renders export and copy actions": {
    id: "UI-09",
    category: "UI",
    description: "Export and copy buttons present",
    expected: "Both actions rendered",
  },
  "pipeline-workflow.test.ts::mock pipeline output remains schema-valid across releases": {
    id: "R-01",
    category: "Regression",
    description: "Mock pipeline remains schema-valid",
    expected: "No parse errors",
  },
  "pipeline-workflow.test.ts::orchestrator reports mock stage completion in demo mode": {
    id: "R-02",
    category: "Regression",
    description: "Demo mode reports all five agent stages",
    expected: "Five stages in completed list",
  },
  "pipeline-workflow.test.ts::markdown export still includes all required headings": {
    id: "R-03",
    category: "Regression",
    description: "Markdown export headings unchanged",
    expected: "All headings present",
  },
  "pipeline-workflow.test.ts::agent stage order remains stable for live mode contract": {
    id: "R-04",
    category: "Regression",
    description: "Agent stage order contract stable",
    expected: "Five stages in defined order",
  },
  "pipeline-workflow.test.ts::continues to detect approval workflow keywords in mock output": {
    id: "R-05",
    category: "Regression",
    description: "Approval workflow sample still detected",
    expected: "Summary contains approval",
  },
  "validation.test.ts::rejects requirement shorter than 10 characters": {
    id: "N-01",
    category: "Negative",
    description: "Requirement under 10 characters",
    expected: "Schema / API rejects",
  },
  "validation.test.ts::returns 400 for empty requirement body on /api/pipeline": {
    id: "N-02",
    category: "Negative",
    description: "Empty requirement via API",
    expected: "400 response",
  },
  "validation.test.ts::returns 400 for malformed JSON on /api/pipeline": {
    id: "N-03",
    category: "Negative",
    description: "Malformed JSON body",
    expected: "400 response",
  },
  "validation.test.ts::returns 400 when export payload omits pipeline object": {
    id: "N-04",
    category: "Negative",
    description: "Export without pipeline object",
    expected: "400 response",
  },
  "validation.test.ts::blocks pipeline generation without a user session": {
    id: "N-05",
    category: "Negative",
    description: "Pipeline call without session",
    expected: "401 response",
  },
  "validation.test.ts::blocks export without a user session": {
    id: "N-06",
    category: "Negative",
    description: "Export call without session",
    expected: "401 response",
  },
  "validation.test.ts::rejects delivery readiness score outside 0-100 at schema level": {
    id: "N-07",
    category: "Negative",
    description: "Invalid pipeline shape on export",
    expected: "400 response",
  },
  "auth-and-input.test.ts::does not expose pipeline generation to anonymous callers": {
    id: "S-01",
    category: "Security",
    description: "Anonymous pipeline generation blocked",
    expected: "401",
  },
  "auth-and-input.test.ts::does not expose markdown export to anonymous callers": {
    id: "S-02",
    category: "Security",
    description: "Anonymous export blocked",
    expected: "401",
  },
  "auth-and-input.test.ts::accepts requirement text with script tags without executing (stored as data)": {
    id: "S-03",
    category: "Security",
    description: "Requirement containing script tags handled safely",
    expected: "No script execution in markdown output",
  },
  "auth-and-input.test.ts::does not leak stack traces in API error responses": {
    id: "S-04",
    category: "Security",
    description: "API errors do not leak stack traces",
    expected: "No stack in JSON body",
  },
  "auth-and-input.test.ts::includes security test scenarios in generated test plan": {
    id: "S-05",
    category: "Security",
    description: "Generated test plan includes security scenarios",
    expected: "Security category covers RBAC/XSS",
  },
};

export function lookupScenario(moduleId: string, testName: string): ScenarioMeta | undefined {
  const fileName = moduleId.split("/").pop() ?? moduleId;
  return SCENARIO_CATALOG[`${fileName}::${testName}`];
}

export function listAllScenarios(): ScenarioMeta[] {
  return Object.values(SCENARIO_CATALOG);
}
