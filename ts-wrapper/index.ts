#!/usr/bin/env node

import { createRequire } from "module";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binaryName = process.platform === "win32" ? "bunny.exe" : "bunny";
const binaryPath = path.join(__dirname, "..", "bin", binaryName);

function runCli(args) {
  const result = spawnSync(binaryPath, args, { stdio: "inherit" });
  if (result.error) {
    console.error("Error running CLI:", result.error);
    process.exit(1);
  }
  process.exit(result.status ?? 0);
}

runCli(process.argv.slice(2));
