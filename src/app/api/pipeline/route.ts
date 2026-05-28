import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/orchestrator/runPipeline";
import { PipelineInputSchema } from "@/lib/schemas/sdlc-pipeline";

function wantsStream(request: Request): boolean {
  return request.headers.get("Accept") === "application/x-ndjson";
}

async function executePipeline(
  input: ReturnType<typeof PipelineInputSchema.parse>,
  simulateProgress: boolean
) {
  const stages: string[] = [];

  const pipeline = await runPipeline(
    input,
    (stage, status) => {
      if (status === "completed") {
        stages.push(stage);
      }
    },
    { simulateProgress }
  );

  return {
    pipeline,
    stages,
    mode: process.env.OPENAI_API_KEY ? ("live" as const) : ("mock" as const),
  };
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = PipelineInputSchema.parse(body);
    const simulateProgress =
      wantsStream(request) &&
      !process.env.OPENAI_API_KEY &&
      process.env.VITEST !== "true";

    if (wantsStream(request)) {
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          const send = (event: Record<string, unknown>) => {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          };

          try {
            const stages: string[] = [];
            const pipeline = await runPipeline(
              input,
              (stage, status) => {
                send({ type: "progress", stage, status });
                if (status === "completed") {
                  stages.push(stage);
                }
              },
              { simulateProgress }
            );

            send({
              type: "complete",
              pipeline,
              stages,
              mode: process.env.OPENAI_API_KEY ? "live" : "mock",
            });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to run SDLC pipeline";
            send({ type: "error", error: message });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "application/x-ndjson" },
      });
    }

    const result = await executePipeline(input, false);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to run SDLC pipeline";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
