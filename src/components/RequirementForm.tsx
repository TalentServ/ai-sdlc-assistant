"use client";

import { useRef } from "react";

interface RequirementFormProps {
  requirement: string;
  context: string;
  architectureRules: string;
  onRequirementChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onArchitectureRulesChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function RequirementForm({
  requirement,
  context,
  architectureRules,
  onRequirementChange,
  onContextChange,
  onArchitectureRulesChange,
  onSubmit,
  isLoading,
}: RequirementFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onRequirementChange(text);
  };

  const loadSample = async () => {
    const response = await fetch("/samples/document-approval-workflow.md");
    const text = await response.text();
    onRequirementChange(text);
  };

  return (
    <div className="glass-panel space-y-5 p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="requirement" className="font-semibold text-white">
            Business requirement
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5"
            >
              Upload .md / .txt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.markdown"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        <textarea
          id="requirement"
          rows={8}
          value={requirement}
          onChange={(e) => onRequirementChange(e.target.value)}
          placeholder="Paste a user story, feature request, or requirement document…"
          className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="context" className="font-medium text-slate-200">
          Module / context summary <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="context"
          rows={3}
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          placeholder="Existing frontend/backend/database context…"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="architectureRules" className="font-medium text-slate-200">
          Architecture rules <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="architectureRules"
          rows={3}
          value={architectureRules}
          onChange={(e) => onArchitectureRulesChange(e.target.value)}
          placeholder="Layering, security, API, and testing standards…"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || requirement.trim().length < 10}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Generating SDLC pipeline…" : "Generate SDLC pipeline"}
      </button>
    </div>
  );
}
