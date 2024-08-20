import { execSync } from "child_process";

const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Please provide a version number");
  process.exit(1);
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    throw error;
  }
}

try {
  // Check if git is initialized and we're in a git repository
  runCommand("git rev-parse --is-inside-work-tree");

  // Check if there are any uncommitted changes
  const status = runCommand("git status --porcelain");
  if (status) {
    console.error(
      "There are uncommitted changes. Please commit or stash them before publishing.",
    );
    process.exit(1);
  }

  // Update version in package.json
  console.log(`Updating version to ${newVersion}`);
  runCommand(`npm version ${newVersion} --no-git-tag-version`);

  // Stage the changed package.json
  console.log("Staging changes");
  runCommand("git add package.json");

  // Commit the version change
  console.log("Committing changes");
  runCommand(`git commit -m "Bump version to ${newVersion}"`);

  // Create a new git tag
  console.log("Creating git tag");
  runCommand(`git tag v${newVersion}`);

  // Push changes and tags to remote
  console.log("Pushing to remote");
  runCommand("git push");
  runCommand("git push --tags");

  console.log(`Version ${newVersion} has been published successfully.`);
} catch (error) {
  console.error("An error occurred during publishing:", error);
  process.exit(1);
}
