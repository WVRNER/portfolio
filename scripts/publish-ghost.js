const { execSync } = require("child_process");

function run(command) {
  console.log(`\n→ ${command}`);
  execSync(command, { stdio: "inherit" });
}

function output(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

try {
  console.log("======================================");
  console.log("      WVRNER GHOST PUBLISHER");
  console.log("======================================");

  // Safety: only publish from main.
  const branch = output("git branch --show-current");

  if (branch !== "main") {
    throw new Error(
      `You are on '${branch}'. Switch to main before publishing.`
    );
  }

  // Safety: don't mix unrelated local edits into a Ghost publish.
  const existingChanges = output("git status --porcelain");

  if (existingChanges) {
    throw new Error(
      "Your Git working tree already has changes. Commit or stash them before publishing Ghost."
    );
  }

  // Make sure our local main hasn't fallen behind GitHub.
  run("git pull --ff-only origin main");

  // Ghost must be running locally and the Content API must respond.
  console.log("\n→ Checking local Ghost");

  const fs = require("fs");

  if (!fs.existsSync(".ghost.env")) {
    throw new Error(".ghost.env does not exist.");
  }

  const envText = fs.readFileSync(".ghost.env", "utf8");

  const getEnv = (name) => {
    const line = envText
      .split(/\r?\n/)
      .find(line => line.startsWith(`${name}=`));

    return line
      ? line.slice(line.indexOf("=") + 1).trim()
      : "";
  };

  const ghostUrl = getEnv("GHOST_URL").replace(/\/$/, "");
  const ghostKey = getEnv("GHOST_CONTENT_API_KEY");

  if (!ghostUrl || !ghostKey) {
    throw new Error(".ghost.env is missing Ghost configuration.");
  }

  console.log(`✓ Configuration loaded for ${ghostUrl}`);

  try {
    const response = execSync(
      `curl -sf "${ghostUrl}/ghost/api/content/posts/?key=${ghostKey}&limit=1"`,
      { encoding: "utf8", shell: "/bin/bash" }
    );

    JSON.parse(response);
    console.log("✓ Ghost Content API reachable");
  } catch {
    throw new Error(`Ghost Content API is not reachable at ${ghostUrl}.`);
  }

  // Sync Ghost and build Eleventy.
  run("npm run publish:ghost");

  // Never publish localhost references.
  let localhostLeak = false;

  try {
    execSync(
      'grep -R "localhost:2368" posts/ghost images/ghost 2>/dev/null',
      { stdio: "inherit", shell: "/bin/bash" }
    );
    localhostLeak = true;
  } catch {
    localhostLeak = false;
  }

  if (localhostLeak) {
    throw new Error(
      "localhost:2368 was found in generated Ghost content. Nothing was pushed."
    );
  }

  console.log("\n✓ No localhost Ghost URLs found");

  // Stage ONLY files belonging to the Ghost publishing system.
  run(
    "git add posts/ghost scripts/sync-ghost.js package.json .eleventy.js .gitignore"
  );

  if (require("fs").existsSync("images/ghost")) {
    run("git add images/ghost");
  }

  const staged = output("git diff --cached --name-only");

  if (!staged) {
    console.log("\n======================================");
    console.log("✓ Everything is already up to date.");
    console.log("✓ Nothing to commit or push.");
    console.log("======================================");
    process.exitCode = 0;
    return;
  }

  console.log("\n===== CHANGES =====");
  console.log(staged);

  // Commit generated Ghost changes.
  const now = new Date().toISOString().replace("T", " ").slice(0, 16);

  run(`git commit -m "content: sync Ghost posts ${now}"`);

  // Refuse to merge automatically if GitHub changed during the sync.
  run("git pull --ff-only origin main");

  // Push main. GitHub Pages takes over from here.
  run("git push origin main");

  console.log("\n======================================");
  console.log("              SUCCESS ✓");
  console.log("======================================");
  console.log("Ghost content synced.");
  console.log("Eleventy build passed.");
  console.log("Changes committed.");
  console.log("main pushed to GitHub.");
  console.log("GitHub Pages deployment triggered.");
  console.log("======================================");

} catch (error) {
  console.error("\n======================================");
  console.error("          PUBLISH STOPPED");
  console.error("======================================");
  console.error(error.message);
  console.error("Nothing else will be pushed automatically.");
  console.error("======================================");
  process.exitCode = 1;
}
