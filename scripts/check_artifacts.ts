import { readFileSync } from "node:fs";

const cobol = readFileSync("cobol/SETTLE01.cbl", "utf8");
const jcl = readFileSync("jcl/SETTLE01.jcl", "utf8");
const missing = [
  ["COBOL", cobol, "PROGRAM-ID. SETTLE01"],
  ["COBOL", cobol, "WS-COPYBOOK-DRIFT-COUNT"],
  ["JCL", jcl, "//SETTLE01 JOB"],
  ["JCL", jcl, "EXEC PGM=SETTLE01"]
].filter(([, body, marker]) => !String(body).includes(String(marker)));

if (missing.length) {
  throw new Error(`Artifact contract missing: ${missing.map(([kind, , marker]) => `${kind}:${marker}`).join(", ")}`);
}

console.log("artifact contract ok");
