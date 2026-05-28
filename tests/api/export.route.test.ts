import { describe, expect, it, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { POST as exportPost } from "@/app/api/export/route";
import { generateMockPipeline } from "@/lib/mock-pipeline";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

function buildExportRequest(pipeline: unknown) {
  return new Request("http://localhost/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pipeline }),
  });
}

describe("API: POST /api/export", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_test_123" } as never);
  });

  it("returns 401 when the caller is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const pipeline = generateMockPipeline(SAMPLE_PIPELINE_INPUT);

    const response = await exportPost(buildExportRequest(pipeline));

    expect(response.status).toBe(401);
  });

  it("returns markdown with attachment headers for a valid pipeline", async () => {
    const pipeline = generateMockPipeline(SAMPLE_PIPELINE_INPUT);
    const response = await exportPost(buildExportRequest(pipeline));
    const markdown = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/markdown");
    expect(response.headers.get("Content-Disposition")).toContain("attachment");
    expect(markdown).toContain("# SDLC Pipeline Report");
    expect(markdown).toContain("## Test Plan");
  });

  it("returns 400 when pipeline payload fails schema validation", async () => {
    const response = await exportPost(buildExportRequest({ incomplete: true }));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error).toBeTruthy();
  });
});
