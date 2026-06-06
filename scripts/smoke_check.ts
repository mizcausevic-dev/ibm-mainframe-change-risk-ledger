import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const markers = [
  "IBM Mainframe Change Risk Ledger",
  "Mainframe change pressure becomes visible",
  "claims-core-settlement",
  "deposit-ledger-close"
];
const missing = markers.filter((marker) => !html.includes(marker));

if (missing.length) {
  throw new Error(`Rendered site missing markers: ${missing.join(", ")}`);
}

console.log("smoke ok");
