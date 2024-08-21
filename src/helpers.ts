import { spawn } from "bun";
import fs from "fs/promises";
import * as readline from "readline";
export async function promptUser(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(
        answer.trim().toLowerCase() === "y" ||
          answer.trim().toLowerCase() === "",
      );
    });
  });
}
export async function runCommand(
  args: string[],
  options?: { cwd?: string },
): Promise<void> {
  return new Promise((resolve, reject) => {
    spawn(args, {
      ...options,
      stdout: "ignore",
      onExit: (_, code) => {
        if (code !== 0) {
          reject(
            new Error(`Command '${args.join(" ")}' exited with code ${code}`),
          );
        } else {
          resolve();
        }
      },
    });
  });
}
export function logSuccess(message: string) {
  console.log(`\x1b[32m✔️ ${message}\x1b[0m`);
}
export async function removeDirectory(dirPath: string) {
  await fs.rm(dirPath, { recursive: true, force: true });
}
export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.mkdir(path, { recursive: true });
    return true;
  } catch {
    return false;
  }
}
