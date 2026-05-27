"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

const stages = [
  "Clarification",
  "Impact Analysis",
  "Implementation Plan",
  "Test Plan",
  "Risk Checklist",
  "Delivery Readiness",
];

export function HomeContent() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-100">
            Challenge 3 · Agentic SDLC
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Turn requirements into a developer-ready delivery pipeline
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            An AI-powered assistant that runs a controlled SDLC flow — clarification,
            impact analysis, implementation planning, test planning, risk review, and
            delivery readiness — before your team writes code.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Open workspace
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                <button className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
                <button className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <a
              href="/samples/document-approval-workflow.md"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              View sample requirement
            </a>
          </div>
        </div>

        <div className="glass-panel p-8">
          <h2 className="text-lg font-semibold text-white">Agentic workflow</h2>
          <p className="mt-2 text-sm text-slate-400">
            Five specialized agents run in sequence — not a single generic prompt.
          </p>
          <ol className="mt-6 space-y-3">
            {[
              "Requirement Analyzer",
              "Impact Analyzer",
              "Implementation Planner",
              "Test Planner",
              "Readiness Reviewer",
            ].map((agent, index) => (
              <li
                key={agent}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600/20 text-xs font-bold text-brand-100">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-200">{agent}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-white">Pipeline outputs</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => (
            <div key={stage} className="glass-panel p-5">
              <p className="font-medium text-white">{stage}</p>
              <p className="mt-2 text-sm text-slate-400">
                Structured, exportable sections validated against a canonical schema.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
