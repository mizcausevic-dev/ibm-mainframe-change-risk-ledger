#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { buildMainframeChangeSummary, type MainframeChangeInput } from "./index.js";

const file = process.argv[2];
const format = process.argv.includes("--format=json") ? "json" : "text";

if (!file) {
  console.error("Usage: ibm-mainframe-change-risk-ledger <fixture.json> [--format=json]");
  process.exit(1);
}

const input = JSON.parse(await readFile(file, "utf8")) as MainframeChangeInput;
const summary = buildMainframeChangeSummary(input);

if (format === "json") {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`estate=${summary.estate}`);
  console.log(`risk=${summary.aggregateChangeRisk}`);
  console.log(`escalation=${summary.escalationLanes}`);
  console.log(`impacted=${summary.impactedApplicationEstimate}`);
  console.log(`recommendation=${summary.primaryRecommendation}`);
}
