#!/usr/bin/env node

import { spawnSync } from "child_process";
import path from "path";

// Determine the binary name based on the platform
const binaryName = process.platform === "win32" ? "bunny.exe" : "bunny";

// Resolve the binary path relative to the script's directory
const binaryPath = path.resolve(__dirname, "..", "bin", binaryName);

// Simple logger function

export function runCli(args: string[]): void {
  // Log the binary path and the arguments being passed

  // Spawn the binary process with the given arguments
  const result = spawnSync(binaryPath, args, { stdio: "inherit" });

  // Log the result status

  // Check for errors or non-zero exit status
  if (result.error) {
    console.error(`[ERROR] Error running bunny: ${result.error.message}`);
    process.exit(1);
  } else if (result.status !== 0) {
    console.error(`[ERROR] CLI exited with non-zero status: ${result.status}`);
    process.exit(result.status ?? 1);
  }

  // Exit with the CLI's exit status
  process.exit(result.status ?? 0);
}

// If the script is executed directly, run the CLI with the passed arguments
if (require.main === module) {
  runCli(process.argv.slice(2));
}
