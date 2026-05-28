"use client";

import type { SdlcPipeline } from "@/lib/schemas/sdlc-pipeline";
import { ReadinessScore } from "@/components/ReadinessScore";
import { ListSection, StageCard, TextBlock } from "@/components/StageCard";

interface PipelineResultsProps {
  pipeline: SdlcPipeline;
  onExport: () => void;
  onCopy: () => void;
}

export function PipelineResults({ pipeline, onExport, onCopy }: PipelineResultsProps) {
  const { clarifiedRequirement: cr, impactAnalysis: ia } = pipeline;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
        >
          Copy Markdown
        </button>
        <button
          type="button"
          onClick={onExport}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Download .md
        </button>
      </div>

      <ReadinessScore readiness={pipeline.deliveryReadiness} />

      <StageCard title="Clarified requirement">
        <TextBlock label="Summary" text={cr.summary} />
        <TextBlock label="User story" text={cr.userStory} />
        <ListSection label="Assumptions" items={cr.assumptions} />
        <ListSection label="Open questions" items={cr.openQuestions} />
        <ListSection label="Out of scope" items={cr.outOfScope} />
      </StageCard>

      <StageCard title="Impact analysis">
        <ListSection label="Affected modules" items={ia.affectedModules} />
        <ListSection label="UI" items={ia.ui} />
        <ListSection label="API" items={ia.api} />
        <ListSection label="Database" items={ia.database} />
        <ListSection label="Security" items={ia.security} />
        <ListSection label="Integrations" items={ia.integrations} />
        <ListSection label="Testing impact" items={ia.testingImpact} />
      </StageCard>

      <StageCard title="Implementation plan">
        <ol className="space-y-4">
          {pipeline.implementationPlan
            .slice()
            .sort((a, b) => a.sequence - b.sequence)
            .map((task) => (
              <li key={task.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <p className="font-medium text-white">
                  {task.sequence}. {task.title}{" "}
                  <span className="text-xs text-slate-500">({task.id})</span>
                </p>
                <p className="mt-2">{task.description}</p>
                {task.dependencies?.length ? (
                  <p className="mt-2 text-xs text-slate-400">
                    Dependencies: {task.dependencies.join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
        </ol>
      </StageCard>

      <StageCard title="Test plan">
        <ListSection label="Unit" items={pipeline.testPlan.unit} />
        <ListSection label="API" items={pipeline.testPlan.api} />
        <ListSection label="UI" items={pipeline.testPlan.ui} />
        <ListSection label="Regression" items={pipeline.testPlan.regression} />
        <ListSection label="Negative" items={pipeline.testPlan.negative} />
        <ListSection label="Security" items={pipeline.testPlan.security} />
      </StageCard>

      <StageCard title="Risk checklist">
        <ul className="space-y-3">
          {pipeline.riskChecklist.map((risk) => (
            <li
              key={`${risk.category}-${risk.risk}`}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {risk.category} · {risk.severity}
              </p>
              <p className="mt-1 font-medium text-white">{risk.risk}</p>
              <p className="mt-2 text-slate-300">
                <span className="text-slate-500">Mitigation:</span> {risk.mitigation}
              </p>
            </li>
          ))}
        </ul>
      </StageCard>

      <StageCard title="Review checklist">
        <ListSection label="Items" items={pipeline.reviewChecklist} />
      </StageCard>
    </div>
  );
}
