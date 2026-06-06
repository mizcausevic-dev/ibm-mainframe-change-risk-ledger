export type MainframeChangeLane = {
  laneId: string;
  system: string;
  criticalApplications: number;
  compressedBatchWindows: number;
  untestedCopybookChanges: number;
  abendRatePercent: number;
  staleJclJobs: number;
  db2ChangeCount: number;
  rollbackDrillAgeDays: number;
  owner: string;
  nextAction: string;
};

export type MainframeChangeInput = {
  asOf: string;
  estate: string;
  lanes: MainframeChangeLane[];
};

export type MainframeChangeFinding = MainframeChangeLane & {
  changeRiskScore: number;
  impactedApplicationEstimate: number;
  posture: "escalate" | "watch" | "contained";
};

export type MainframeChangeSummary = {
  asOf: string;
  estate: string;
  aggregateChangeRisk: number;
  escalationLanes: number;
  impactedApplicationEstimate: number;
  primaryRecommendation: string;
  findings: MainframeChangeFinding[];
};

const round = (value: number, digits = 2): number => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function scoreLane(lane: MainframeChangeLane): MainframeChangeFinding {
  const changeRiskScore = clamp(
    lane.compressedBatchWindows * 5 +
      lane.untestedCopybookChanges * 4 +
      lane.abendRatePercent * 3 +
      lane.staleJclJobs * 4 +
      lane.db2ChangeCount * 2.5 +
      lane.rollbackDrillAgeDays * 0.25,
    0,
    100
  );

  const impactedApplicationEstimate =
    Math.round(lane.criticalApplications * (changeRiskScore / 100)) + lane.staleJclJobs + lane.untestedCopybookChanges;

  return {
    ...lane,
    changeRiskScore: round(changeRiskScore),
    impactedApplicationEstimate,
    posture: changeRiskScore >= 70 ? "escalate" : changeRiskScore >= 40 ? "watch" : "contained"
  };
}

export function buildMainframeChangeSummary(input: MainframeChangeInput): MainframeChangeSummary {
  if (!input.lanes.length) {
    throw new Error("At least one IBM mainframe change lane is required.");
  }

  const findings = input.lanes.map(scoreLane).sort((a, b) => b.changeRiskScore - a.changeRiskScore);
  const aggregateChangeRisk = round(findings.reduce((sum, lane) => sum + lane.changeRiskScore, 0) / findings.length);
  const escalationLanes = findings.filter((lane) => lane.posture === "escalate").length;
  const impactedApplicationEstimate = findings.reduce((sum, lane) => sum + lane.impactedApplicationEstimate, 0);
  const top = findings[0];

  return {
    asOf: input.asOf,
    estate: input.estate,
    aggregateChangeRisk,
    escalationLanes,
    impactedApplicationEstimate,
    primaryRecommendation: `${top.laneId}: ${top.nextAction}`,
    findings
  };
}
