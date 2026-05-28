"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AppHeader } from "@/components/AppHeader";
import { RequirementForm } from "@/components/RequirementForm";
import { PipelineProgress } from "@/components/PipelineProgress";
import { PipelineResults } from "@/components/PipelineResults";
import { pipelineToMarkdown } from "@/lib/markdown-export";
import type { AgentStage, SdlcPipeline } from "@/lib/schemas/sdlc-pipeline";

type PipelineStreamEvent =
  | { type: "progress"; stage: string; status: "started" | "completed" }
  | { type: "complete"; pipeline: SdlcPipeline; stages: string[]; mode: "mock" | "live" }
  | { type: "error"; error: string };

function isAgentStage(stage: string): stage is AgentStage {
  return [
    "requirement_analyzer",
    "impact_analyzer",
    "implementation_planner",
    "test_planner",
    "readiness_reviewer",
  ].includes(stage);
}

export function DashboardClient() {
  const { user } = useUser();
  const [requirement, setRequirement] = useState("");
  const [context, setContext] = useState("");
  const [architectureRules, setArchitectureRules] = useState("");
  const [pipeline, setPipeline] = useState<SdlcPipeline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState<AgentStage | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [pipelineMode, setPipelineMode] = useState<"mock" | "live" | null>(null);

  const runPipeline = async () => {
    setError(null);
    setPipeline(null);
    setCompletedStages([]);
    setActiveStage(null);
    setPipelineMode(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/x-ndjson",
        },
        body: JSON.stringify({ requirement, context, architectureRules }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Failed to generate pipeline");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming is not supported in this browser");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line) as PipelineStreamEvent;

          if (event.type === "progress") {
            if (event.status === "started" && isAgentStage(event.stage)) {
              setActiveStage(event.stage);
            }

            if (event.status === "completed") {
              setCompletedStages((previous) =>
                previous.includes(event.stage) ? previous : [...previous, event.stage]
              );
              setActiveStage((current) =>
                current === event.stage && isAgentStage(event.stage) ? null : current
              );
            }
          }

          if (event.type === "complete") {
            setPipeline(event.pipeline);
            setCompletedStages(event.stages);
            setPipelineMode(event.mode);
            setActiveStage(null);
          }

          if (event.type === "error") {
            throw new Error(event.error);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
      setActiveStage(null);
    }
  };

  const handleExport = async () => {
    if (!pipeline) return;
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipeline }),
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sdlc-pipeline-report.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!pipeline) return;
    await navigator.clipboard.writeText(pipelineToMarkdown(pipeline));
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">SDLC workspace</h1>
            <p className="mt-2 text-slate-400">
              Submit a requirement and run the agentic delivery pipeline.
            </p>
          </div>
          {user && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="text-slate-400">Signed in as</p>
              <p className="font-medium text-white">
                {user.fullName || user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <RequirementForm
            requirement={requirement}
            context={context}
            architectureRules={architectureRules}
            onRequirementChange={setRequirement}
            onContextChange={setContext}
            onArchitectureRulesChange={setArchitectureRules}
            onSubmit={runPipeline}
            isLoading={isLoading}
          />

          <PipelineProgress
            activeStage={activeStage}
            completedStages={completedStages}
            isRunning={isLoading}
            mode={pipelineMode}
          />
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {pipeline && (
          <div className="mt-10">
            <PipelineResults
              pipeline={pipeline}
              onExport={handleExport}
              onCopy={handleCopy}
            />
          </div>
        )}
      </main>
    </div>
  );
}
