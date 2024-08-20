#!/usr/bin/env node

import { spawnSync } from "child_process";
import path from "path";

const binaryName = process.platform === "win32" ? "bunny-cli.exe" : "bunny-cli";
const binaryPath = path.join(__dirname, "..", "bin", binaryName);

export function runCli(args: string[]): void {
  const result = spawnSync(binaryPath, args, { stdio: "inherit" });
  if (result.error) {
    console.error("Error running CLI:", result.error);
    process.exit(1);
  }
  process.exit(result.status ?? 0);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}
