import { execSync } from "child_process";

const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Please provide a version number");
  process.exit(1);
}

try {
  execSync("npm version " + newVersion);
  execSync("git add package.json");
  execSync(`git commit -m "Bump version to ${newVersion}"`);

  execSync(`git tag v${newVersion}`);

  execSync("git push");
  execSync("git push --tags");

  console.log(`Version ${newVersion} has been published successfully.`);
} catch (error) {
  console.error("An error occurred during publishing:", error);
  process.exit(1);
}
