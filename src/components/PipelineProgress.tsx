"use client";

import { AGENT_STAGE_LABELS, type AgentStage } from "@/lib/schemas/sdlc-pipeline";

interface PipelineProgressProps {
  activeStage: AgentStage | null;
  completedStages: string[];
  isRunning: boolean;
  mode?: "mock" | "live" | null;
}

const STAGES: Array<{ id: AgentStage; label: string }> = [
  { id: "requirement_analyzer", label: AGENT_STAGE_LABELS.requirement_analyzer },
  { id: "impact_analyzer", label: AGENT_STAGE_LABELS.impact_analyzer },
  { id: "implementation_planner", label: AGENT_STAGE_LABELS.implementation_planner },
  { id: "test_planner", label: AGENT_STAGE_LABELS.test_planner },
  { id: "readiness_reviewer", label: AGENT_STAGE_LABELS.readiness_reviewer },
];

function StageIcon({ completed, active }: { completed: boolean; active: boolean }) {
  if (completed) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
        ✓
      </span>
    );
  }

  if (active) {
    return (
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-emerald-400/40" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400" />
      </span>
    );
  }

  return <span className="h-6 w-6 rounded-full border-2 border-slate-600 bg-slate-800" />;
}

export function PipelineProgress({
  activeStage,
  completedStages,
  isRunning,
  mode,
}: PipelineProgressProps) {
  const completedCount = STAGES.filter((stage) => completedStages.includes(stage.id)).length;
  const hasActiveStage =
    activeStage !== null && STAGES.some((stage) => stage.id === activeStage);
  const progressPercent = Math.min(
    100,
    Math.round(((completedCount + (hasActiveStage ? 0.35 : 0)) / STAGES.length) * 100)
  );

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-white">Agent pipeline</h3>
        <span
          className={`text-xs font-medium ${
            isRunning ? "animate-pulse text-emerald-300" : "text-emerald-400"
          }`}
        >
          {isRunning
            ? `${completedCount}/${STAGES.length} stages`
            : completedCount === STAGES.length
              ? "Complete"
              : "Ready"}
        </span>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-emerald-300/90">
          {progressPercent}% complete
          {hasActiveStage && activeStage
            ? ` · Running ${AGENT_STAGE_LABELS[activeStage]}`
            : ""}
        </p>
      </div>

      {mode === "mock" && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          Demo mode: deterministic mock pipeline (set OPENAI_API_KEY for live agents)
        </p>
      )}

      <ol className="mt-4 space-y-2">
        {STAGES.map((stage, index) => {
          const completed = completedStages.includes(stage.id);
          const active = activeStage === stage.id;

          return (
            <li
              key={stage.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${
                completed
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
                  : active
                    ? "border-emerald-400/70 bg-emerald-500/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-white/10 bg-white/[0.02] text-slate-400"
              }`}
            >
              <StageIcon completed={completed} active={active && !completed} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{stage.label}</p>
                <p className="text-xs opacity-80">
                  {completed
                    ? "Completed"
                    : active
                      ? "In progress…"
                      : `Stage ${index + 1} of ${STAGES.length}`}
                </p>
              </div>
              {completed && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                  Done
                </span>
              )}
              {active && !completed && (
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
                  Live
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
