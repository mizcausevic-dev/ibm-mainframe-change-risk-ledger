import { buildMainframeChangeSummary, type MainframeChangeInput } from "./index.js";

export function renderApp(input: MainframeChangeInput): string {
  const summary = buildMainframeChangeSummary(input);
  const cards = summary.findings
    .map(
      (lane) => `
        <article class="lane ${lane.posture}">
          <p class="eyebrow">${lane.posture}</p>
          <h3>${lane.system}</h3>
          <dl>
            <div><dt>Change risk</dt><dd>${lane.changeRiskScore}</dd></div>
            <div><dt>Impacted apps</dt><dd>${lane.impactedApplicationEstimate}</dd></div>
            <div><dt>Owner</dt><dd>${lane.owner}</dd></div>
          </dl>
          <p>${lane.nextAction}</p>
          <code>${lane.laneId}</code>
        </article>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>IBM Mainframe Change Risk Ledger</title>
  <meta name="description" content="IBM mainframe change-risk ledger for batch-window pressure, COBOL copybook drift, stale JCL, DB2 change volume, and rollback readiness." />
  <style>
    :root { color-scheme: dark; --bg:#050812; --panel:#0d1727; --line:#263348; --text:#f4f1ea; --muted:#a8b3c7; --cyan:#25d7ef; --green:#58f0b3; --pink:#ff72b6; --violet:#9d8cff; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", sans-serif; background: radial-gradient(circle at 82% 0%, #142032, var(--bg) 42%); color: var(--text); }
    main { width: min(1160px, calc(100vw - 40px)); margin: 0 auto; padding: 56px 0 70px; }
    .hero, .lane, .brief, .proof-card { border: 1px solid var(--line); background: rgba(13,23,39,.92); border-radius: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.28); }
    .hero { padding: 56px; border-color: rgba(37,215,239,.42); }
    .eyebrow { color: var(--green); font: 700 12px/1.2 Consolas, monospace; letter-spacing: .16em; text-transform: uppercase; }
    h1 { max-width: 900px; margin: 20px 0; font: 800 clamp(44px, 7vw, 86px)/.95 Georgia, serif; letter-spacing: -.05em; }
    h2 { margin: 48px 0 20px; font: 800 clamp(34px, 4vw, 54px)/1 Georgia, serif; }
    h3 { margin: 0 0 20px; font-size: 24px; line-height: 1.05; }
    p { color: var(--muted); font-size: 18px; line-height: 1.65; }
    .metrics, .lanes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 34px; }
    .metric { padding: 24px; border: 1px solid var(--line); border-radius: 18px; background: #101b2f; }
    .metric strong { display: block; font-size: 44px; margin-top: 8px; }
    .lane { padding: 28px; }
    .lane.escalate { border-color: var(--pink); }
    .lane.watch { border-color: var(--violet); }
    .lane.contained { border-color: var(--green); }
    dl { display: grid; gap: 12px; margin: 0 0 20px; }
    dt { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .12em; }
    dd { margin: 4px 0 0; font-size: 22px; font-weight: 800; }
    code { color: var(--cyan); }
    .brief { margin-top: 28px; padding: 30px; }
    .proof-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
    .proof-card { padding: 28px; }
    .proof-card h3 { margin-top: 8px; }
    .proof-card a { color: var(--cyan); text-decoration: none; }
    @media (max-width: 780px) { .hero { padding: 32px; } .metrics, .lanes, .proof-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <p class="eyebrow">IBM / z/OS / COBOL / JCL / DB2</p>
      <h1>Mainframe change pressure becomes visible before the release window breaks.</h1>
      <p>${summary.estate} resolve into one executive-readable change-risk posture.</p>
      <div class="metrics">
        <div class="metric"><span>Aggregate risk</span><strong>${summary.aggregateChangeRisk}</strong></div>
        <div class="metric"><span>Escalation lanes</span><strong>${summary.escalationLanes}</strong></div>
        <div class="metric"><span>Impacted apps</span><strong>${summary.impactedApplicationEstimate}</strong></div>
      </div>
    </section>
    <h2>Change-risk ledger</h2>
    <section class="lanes">${cards}</section>
    <section class="brief">
      <p class="eyebrow">Primary recommendation</p>
      <p>${summary.primaryRecommendation}</p>
    </section>
    <section class="proof-grid" aria-label="Product depth and shared pattern">
      <article class="proof-card">
        <p class="eyebrow">Product purpose</p>
        <h3>What this product does</h3>
        <p>Turns z/OS, COBOL, JCL, DB2, batch-window, and rollback pressure into a shared release-risk ledger that business, platform, and compliance leaders can read without mainframe tribal knowledge.</p>
      </article>
      <article class="proof-card">
        <p class="eyebrow">Buyer lens</p>
        <h3>Why executives care</h3>
        <p>Mainframe modernization fails when leaders cannot see which change windows, application owners, and dependent systems carry the highest operational risk before a cutover.</p>
      </article>
      <article class="proof-card">
        <p class="eyebrow">Value architecture</p>
        <h3>How it turns into action</h3>
        <p>The page converts technical findings into one sequence: contain the release lane, assign the owner, protect the batch window, and decide what can move now versus what needs more evidence.</p>
      </article>
      <article class="proof-card">
        <p class="eyebrow">Technical proof</p>
        <h3>What reviewers can inspect</h3>
        <p>The repo keeps typed scoring, synthetic mainframe fixtures, deterministic rendering, CI checks, and public-safe static output together so the artifact is reviewable without exposing production systems.</p>
      </article>
      <article class="proof-card">
        <p class="eyebrow">What these repos have in common</p>
        <h3>Platform complexity becomes board-ready operating proof.</h3>
        <p>Each repo names a buyer pain, exposes an evidence model, produces a reusable decision surface, and keeps the public demo boundary safe with synthetic data instead of credentials or customer exports.</p>
      </article>
      <article class="proof-card">
        <p class="eyebrow">Interlinks</p>
        <h3>Where this fits</h3>
        <p><a href="https://portfolio.kineticgain.com/">Portfolio</a> · <a href="https://kineticgain.com/">Kinetic Gain</a> · <a href="https://github.com/mizcausevic-dev/ibm-mainframe-change-risk-ledger">GitHub</a></p>
      </article>
    </section>
  </main>
</body>
</html>`;
}
