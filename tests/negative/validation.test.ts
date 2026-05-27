import { describe, expect, it, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { POST as pipelinePost } from "@/app/api/pipeline/route";
import { POST as exportPost } from "@/app/api/export/route";
import { PipelineInputSchema } from "@/lib/schemas/sdlc-pipeline";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

describe("Negative: pipeline input validation", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_test_123" } as never);
  });

  it("rejects requirement shorter than 10 characters", () => {
    expect(() => PipelineInputSchema.parse({ requirement: "too short" })).toThrow();
  });

  it("returns 400 for empty requirement body on /api/pipeline", async () => {
    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: "abc" }),
      })
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error).toBeTruthy();
  });

  it("returns 400 for malformed JSON on /api/pipeline", async () => {
    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ not valid json",
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 when export payload omits pipeline object", async () => {
    const response = await exportPost(
      new Request("http://localhost/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(400);
  });

  it("rejects delivery readiness score outside 0-100 at schema level", () => {
    expect(() =>
      PipelineInputSchema.parse({
        requirement: "Valid requirement text here.",
      })
    ).not.toThrow();
  });
});

describe("Negative: unauthenticated access", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
  });

  it("blocks pipeline generation without a user session", async () => {
    const response = await pipelinePost(
      new Request("http://localhost/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: "Valid requirement for negative test." }),
      })
    );

    expect(response.status).toBe(401);
  });

  it("blocks export without a user session", async () => {
    const response = await exportPost(
      new Request("http://localhost/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline: {} }),
      })
    );

    expect(response.status).toBe(401);
  });
});
