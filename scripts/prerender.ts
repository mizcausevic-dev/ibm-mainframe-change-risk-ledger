import { mkdir, writeFile } from "node:fs/promises";
import fixture from "../fixtures/mainframe-change-risk.json" with { type: "json" };
import { renderApp } from "../src/app.js";
import type { MainframeChangeInput } from "../src/index.js";

await mkdir("site", { recursive: true });
await writeFile("site/index.html", renderApp(fixture as MainframeChangeInput));
