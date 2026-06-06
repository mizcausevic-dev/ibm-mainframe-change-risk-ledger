import { readFileSync } from "node:fs";

const sql = readFileSync("sql/mainframe_change_risk_contract.sql", "utf8");
const required = ["application_group", "compressed_batch_windows", "untested_copybook_changes", "abend_rate_percent", "stale_jcl_jobs", "db2_change_count"];
const missing = required.filter((token) => !sql.includes(token));

if (missing.length) {
  throw new Error(`SQL contract missing: ${missing.join(", ")}`);
}

console.log("sql contract ok");
