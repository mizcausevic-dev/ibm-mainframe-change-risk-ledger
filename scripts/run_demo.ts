import fixture from "../fixtures/mainframe-change-risk.json" with { type: "json" };
import { buildMainframeChangeSummary, type MainframeChangeInput } from "../src/index.js";

const summary = buildMainframeChangeSummary(fixture as MainframeChangeInput);
console.log(`estate=${summary.estate}`);
console.log(`risk=${summary.aggregateChangeRisk}`);
console.log(`escalation=${summary.escalationLanes}`);
console.log(`impacted=${summary.impactedApplicationEstimate}`);
console.log(`recommendation=${summary.primaryRecommendation}`);
