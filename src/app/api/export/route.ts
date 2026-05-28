import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { pipelineToMarkdown } from "@/lib/markdown-export";
import { SdlcPipelineSchema } from "@/lib/schemas/sdlc-pipeline";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pipeline = SdlcPipelineSchema.parse(body.pipeline);
    const markdown = pipelineToMarkdown(pipeline);

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sdlc-pipeline-report.md"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
