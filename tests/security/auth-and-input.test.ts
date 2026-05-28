import { describe, expect, it, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { POST as exportPost } from "@/app/api/export/route";
import { generateMockPipeline } from "@/lib/mock-pipeline";
import { pipelineToMarkdown } from "@/lib/markdown-export";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

describe("Security: authentication boundaries", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
  });

  it("does not expose pipeline generation to anonymous callers", async () => {
    const { POST: pipelinePost } = await import("@/app/api/pipeline/route");
    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SAMPLE_PIPELINE_INPUT),
      })
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("does not expose markdown export to anonymous callers", async () => {
    const pipeline = generateMockPipeline(SAMPLE_PIPELINE_INPUT);
    const response = await exportPost(
      new Request("http://localhost/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline }),
      })
    );

    expect(response.status).toBe(401);
  });
});

describe("Security: input handling", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_test_123" } as never);
    delete process.env.OPENAI_API_KEY;
  });

  it("accepts requirement text with script tags without executing (stored as data)", async () => {
    const { POST: pipelinePost } = await import("@/app/api/pipeline/route");
    const malicious = `<script>alert('xss')</script> Add secure document approval workflow.`;

    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: malicious }),
      })
    );

    expect(response.status).toBe(200);
    const { pipeline } = await response.json();
    const markdown = pipelineToMarkdown(pipeline);
    expect(markdown).not.toContain("<script>");
  });

  it("does not leak stack traces in API error responses", async () => {
    const { POST: pipelinePost } = await import("@/app/api/pipeline/route");
    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: "x" }),
      })
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(typeof payload.error).toBe("string");
    expect(payload.error).not.toMatch(/stack trace|node_modules|\.tsx?:\d+/i);
  });
});

describe("Security: mock pipeline test plan coverage", () => {
  it("includes security test scenarios in generated test plan", async () => {
    const { POST: pipelinePost } = await import("@/app/api/pipeline/route");
    vi.mocked(auth).mockResolvedValue({ userId: "user_test_123" } as never);

    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SAMPLE_PIPELINE_INPUT),
      })
    );

    const { pipeline } = await response.json();
    expect(pipeline.testPlan.security.some((s: string) => /privilege|xss|audit/i.test(s))).toBe(
      true
    );
  });
});
