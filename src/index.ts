import { Command } from "commander";
import { mkdir } from "fs/promises";
import { join } from "path";
import {
  logSuccess,
  pathExists,
  promptUser,
  removeDirectory,
  runCommand,
} from "./helpers";

const program = new Command()
  .name("bunny")
  .description("CLI tool for Bunny projects")
  .version("0.0.1");

program
  .command("new <name>")
  .description("Create a new Bunny project")
  .action(async (name: string) => {
    await handleNewCommand(name);
  });

program.parse(process.argv);

async function handleNewCommand(name?: string): Promise<void> {
  const path = name || ".";
  logSuccess(`Creating new Bunny project in ${path}`);
  const dirExists = await pathExists(path);
  if (!dirExists) {
    await mkdir(path, { recursive: true });
  }

  const url = "https://github.com/bunny-ts/starter.git";

  logSuccess(`Cloning starter project`);
  await runCommand(["git", "init"], { cwd: path });

  await runCommand(["git", "remote", "add", "origin", url], { cwd: path });

  await runCommand(["git", "fetch"], { cwd: path });

  await runCommand(["git", "checkout", "-t", "origin/master"], { cwd: path });

  await removeDirectory(join(path, ".git"));

  logSuccess("Done!");

  const install = await promptUser(
    "Do you want to install dependencies using 'bun'? (Y/n): ",
  );
  if (install) {
    logSuccess("Installing dependencies...");
    await runCommand(["bun", "install"], { cwd: path });
    logSuccess("Dependencies installed successfully.");
  } else {
    console.log(
      "Dependencies were not installed. You can install them later by running 'bun install' in the project directory.",
    );
  }
}
