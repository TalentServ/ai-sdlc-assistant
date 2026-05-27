import type { Reporter } from "vitest/reporters";

type TestResultState = "passed" | "failed" | "skipped" | "pending";

type ReportedTestCase = {
  name: string;
  fullName: string;
  module: { moduleId: string };
  result: () => { state: TestResultState; duration?: number };
};

type ReportedTestModule = {
  moduleId: string;
};
import { lookupScenario } from "../scenario-catalog";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  yellow: "\x1b[33m",
};

function statusIcon(state: string | undefined): string {
  if (state === "passed") return `${colors.green}✓${colors.reset}`;
  if (state === "failed") return `${colors.red}✗${colors.reset}`;
  if (state === "skipped") return `${colors.yellow}○${colors.reset}`;
  return `${colors.gray}?${colors.reset}`;
}

export default class DetailedReporter implements Reporter {
  private currentModule = "";
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onTestRunStart() {
    console.log(`\n${colors.cyan}AI SDLC Assistant — automated test run${colors.reset}`);
    console.log(`${colors.gray}Each line shows scenario ID, name, and expected result.${colors.reset}\n`);
  }

  onTestModuleStart(testModule: ReportedTestModule) {
    if (this.currentModule === testModule.moduleId) return;
    this.currentModule = testModule.moduleId;
    console.log(`${colors.cyan}${"─".repeat(72)}${colors.reset}`);
    console.log(`${colors.cyan}File:${colors.reset} ${testModule.moduleId}`);
  }

  onTestCaseResult(testCase: ReportedTestCase) {
    const result = testCase.result();
    const state = result.state;
    const scenario = lookupScenario(testCase.module.moduleId, testCase.name);
    const duration =
      result.duration !== undefined ? `${colors.gray} (${Math.round(result.duration)}ms)${colors.reset}` : "";

    if (state === "passed") this.passed += 1;
    if (state === "failed") this.failed += 1;
    if (state === "skipped") this.skipped += 1;

    const id = scenario?.id ?? "—";
    const category = scenario?.category ?? "Test";
    const description = scenario?.description ?? testCase.fullName;
    const expected = scenario?.expected ?? "See assertion in test file";

    console.log(
      `${statusIcon(state)} ${colors.yellow}[${id}]${colors.reset} ${colors.cyan}${category}${colors.reset} · ${testCase.name}${duration}`
    );
    console.log(`  ${colors.gray}Description:${colors.reset} ${description}`);
    console.log(`  ${colors.gray}Expected:${colors.reset} ${expected}`);
  }

  onTestRunEnd() {
    const total = this.passed + this.failed + this.skipped;
    console.log(`\n${colors.cyan}${"─".repeat(72)}${colors.reset}`);
    console.log(
      `${colors.green}Passed: ${this.passed}${colors.reset} | ` +
        `${colors.red}Failed: ${this.failed}${colors.reset} | ` +
        `${colors.yellow}Skipped: ${this.skipped}${colors.reset} | ` +
        `Total: ${total}\n`
    );
  }
}
