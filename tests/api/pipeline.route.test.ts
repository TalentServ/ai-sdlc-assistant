import { describe, expect, it, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { POST as pipelinePost } from "@/app/api/pipeline/route";
import { SAMPLE_PIPELINE_INPUT } from "../fixtures/sample-requirement";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

function buildPipelineRequest(body: unknown, accept = "application/json") {
  return new Request("http://localhost/api/pipeline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: accept,
    },
    body: JSON.stringify(body),
  });
}

async function readNdjsonStream(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Missing response body");

  const decoder = new TextDecoder();
  let buffer = "";
  const events: Array<Record<string, unknown>> = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) events.push(JSON.parse(line) as Record<string, unknown>);
    }
  }

  return events;
}

describe("API: POST /api/pipeline", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_test_123" } as never);
    delete process.env.OPENAI_API_KEY;
  });

  it("returns 401 when the caller is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const response = await pipelinePost(buildPipelineRequest(SAMPLE_PIPELINE_INPUT));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns a complete SDLC pipeline for a valid requirement", async () => {
    const response = await pipelinePost(buildPipelineRequest(SAMPLE_PIPELINE_INPUT));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe("mock");
    expect(payload.pipeline.clarifiedRequirement.summary).toBeTruthy();
    expect(payload.pipeline.implementationPlan.length).toBeGreaterThan(0);
    expect(payload.pipeline.testPlan.unit.length).toBeGreaterThan(0);
    expect(payload.stages).toContain("requirement_analyzer");
    expect(payload.stages).toHaveLength(5);
  });

  it("includes all six test plan categories in the response", async () => {
    const response = await pipelinePost(buildPipelineRequest(SAMPLE_PIPELINE_INPUT));
    const { pipeline } = await response.json();
    const categories = ["unit", "api", "ui", "regression", "negative", "security"] as const;

    for (const category of categories) {
      expect(pipeline.testPlan[category].length).toBeGreaterThan(0);
    }
  });

  it("returns delivery readiness score between 0 and 100", async () => {
    const response = await pipelinePost(buildPipelineRequest(SAMPLE_PIPELINE_INPUT));
    const { pipeline } = await response.json();

    expect(pipeline.deliveryReadiness.score).toBeGreaterThanOrEqual(0);
    expect(pipeline.deliveryReadiness.score).toBeLessThanOrEqual(100);
    expect(["ready", "needs_clarification", "high_risk"]).toContain(
      pipeline.deliveryReadiness.status
    );
  });

  it("streams progress events when Accept is application/x-ndjson", async () => {
    const response = await pipelinePost(
      buildPipelineRequest(SAMPLE_PIPELINE_INPUT, "application/x-ndjson")
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/x-ndjson");

    const events = await readNdjsonStream(response);
    const progressEvents = events.filter((event) => event.type === "progress");
    const completeEvent = events.find((event) => event.type === "complete");

    expect(progressEvents.length).toBeGreaterThan(0);
    expect(progressEvents.some((event) => event.status === "started")).toBe(true);
    expect(progressEvents.some((event) => event.status === "completed")).toBe(true);
    expect(completeEvent).toBeTruthy();
    expect(completeEvent?.mode).toBe("mock");
  });
});
