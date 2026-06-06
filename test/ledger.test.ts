import { describe, expect, it } from "vitest";
import fixture from "../fixtures/mainframe-change-risk.json" with { type: "json" };
import { buildMainframeChangeSummary, scoreLane, type MainframeChangeInput, type MainframeChangeLane } from "../src/index.js";

describe("ibm mainframe change risk ledger", () => {
  it("prioritizes the highest-risk change lane", () => {
    const summary = buildMainframeChangeSummary(fixture as MainframeChangeInput);
    expect(summary.escalationLanes).toBe(1);
    expect(summary.findings[0].laneId).toBe("claims-core-settlement");
    expect(summary.primaryRecommendation).toContain("Freeze nonessential copybook drift");
  });

  it("marks deposit ledger close as watch", () => {
    const finding = scoreLane((fixture as MainframeChangeInput).lanes[1]);
    expect(finding.posture).toBe("watch");
    expect(finding.changeRiskScore).toBe(54);
  });

  it("keeps card dispute batch contained", () => {
    const finding = scoreLane((fixture as MainframeChangeInput).lanes[2]);
    expect(finding.posture).toBe("contained");
    expect(finding.changeRiskScore).toBe(20.5);
  });

  it("requires at least one change lane", () => {
    expect(() => buildMainframeChangeSummary({ asOf: "2026-06-06T13:30:00Z", estate: "empty", lanes: [] })).toThrow(
      "At least one IBM mainframe change lane is required."
    );
  });

  it("keeps a clean batch lane contained", () => {
    const lane: MainframeChangeLane = {
      laneId: "reference-data-load",
      system: "Reference data load",
      criticalApplications: 3,
      compressedBatchWindows: 0,
      untestedCopybookChanges: 0,
      abendRatePercent: 0,
      staleJclJobs: 0,
      db2ChangeCount: 1,
      rollbackDrillAgeDays: 7,
      owner: "Data operations",
      nextAction: "Keep evidence attached."
    };
    expect(scoreLane(lane).posture).toBe("contained");
  });
});
