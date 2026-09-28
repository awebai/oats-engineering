import assert from "node:assert/strict";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPO = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OATS_URL = "https://github.com/awebai/oats.git";

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { encoding: "utf8", ...options });
  assert.equal(result.status, 0, `${cmd} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return result;
}
function runJson(cmd, args, options = {}) {
  const result = run(cmd, args, options);
  const stdout = result.stdout.trim();
  const start = stdout.lastIndexOf("{\"schemaVersion\"");
  assert.notEqual(start, -1, `no OATS JSON envelope in stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const envelope = JSON.parse(stdout.slice(start));
  assert.equal(envelope.ok, true, envelope.error?.message || result.stderr);
  return envelope.result;
}
function copyRepoToGitSource(t, tmp) {
  const src = join(tmp, "pkg-src");
  cpSync(REPO, src, { recursive: true, filter: (p) => !p.includes(`${REPO}/.git`) && !p.includes(`${REPO}/node_modules`) });
  run("git", ["init", "-q"], { cwd: src });
  run("git", ["config", "user.email", "test@example.com"], { cwd: src });
  run("git", ["config", "user.name", "Test"], { cwd: src });
  run("git", ["add", "."], { cwd: src });
  run("git", ["commit", "-q", "-m", "package"], { cwd: src });
  const head = run("git", ["rev-parse", "HEAD"], { cwd: src }).stdout.trim();
  assert.match(head, /^[0-9a-f]{40}$/);
  const bare = join(tmp, "pkg.git");
  run("git", ["clone", "--bare", src, bare, "-q"]);
  return { bare, head };
}
function makeRepo(dir, message = "commit") {
  run("git", ["init", "-q"], { cwd: dir });
  run("git", ["config", "user.email", "test@example.com"], { cwd: dir });
  run("git", ["config", "user.name", "Test"], { cwd: dir });
  run("git", ["add", "."], { cwd: dir });
  run("git", ["commit", "-q", "-m", message], { cwd: dir });
}
function makeDeployment(t) {
  const tmp = mkdtempSync(join(tmpdir(), "oats-engineering-kernel-"));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const pkg = copyRepoToGitSource(t, tmp);

  const workspaceSrc = join(tmp, "workspace-src");
  mkdirSync(workspaceSrc);
  writeFileSync(join(workspaceSrc, "oats-workspace.yaml"), `schemaVersion: 2
name: engineering-probe
members:
  - file://${tmp}/member.git
packages:
  oats.engineering: git:file://${pkg.bare}@${pkg.head}
defaults:
  knowledge: none
  messaging: none
  tasks: none
`);
  makeRepo(workspaceSrc, "workspace");
  const workspaceBare = join(tmp, "workspace.git");
  run("git", ["clone", "--bare", workspaceSrc, workspaceBare, "-q"]);

  const memberSrc = join(tmp, "member-src");
  mkdirSync(join(memberSrc, "souls", "dev"), { recursive: true });
  mkdirSync(join(memberSrc, "souls", "expert"), { recursive: true });
  writeFileSync(join(memberSrc, "oats-membership.yaml"), `schemaVersion: 2
workspace: file://${workspaceBare}
`);
  writeFileSync(join(memberSrc, "souls", "dev", "soul.yaml"), `schemaVersion: 2
name: dev
description: Probe developer soul.
work: directory
capabilities:
  oats.developer: { from: package }
`);
  writeFileSync(join(memberSrc, "souls", "dev", "AGENTS.md"), "# dev\n");
  writeFileSync(join(memberSrc, "souls", "expert", "soul.yaml"), `schemaVersion: 2
name: expert
description: Probe expert soul.
work: directory
capabilities:
  oats.engineering-expert: { from: package }
`);
  writeFileSync(join(memberSrc, "souls", "expert", "AGENTS.md"), "# expert\n");
  makeRepo(memberSrc, "member");
  run("git", ["clone", "--bare", memberSrc, join(tmp, "member.git"), "-q"]);

  const deploy = join(tmp, "deploy");
  mkdirSync(deploy);
  writeFileSync(join(deploy, "oats-local.yaml"), `schemaVersion: 2
workspace: file://${workspaceBare}
`);
  const bin = join(tmp, "bin");
  mkdirSync(bin);
  const fakePi = join(bin, "pi");
  writeFileSync(fakePi, "#!/usr/bin/env sh\necho fake pi for spawn-preview tests >&2\n");
  chmodSync(fakePi, 0o755);
  return { deploy, env: { ...process.env, PATH: `${bin}:${process.env.PATH || ""}` } };
}
function kernelCli(t, label, ref) {
  if (process.env[`OATS_KERNEL_${label}`]) return process.env[`OATS_KERNEL_${label}`];
  const dir = join(mkdtempSync(join(tmpdir(), `oats-kernel-${label}-`)), "oats");
  t.after(() => rmSync(resolve(dir, ".."), { recursive: true, force: true }));
  run("git", ["clone", "--depth", "1", "--branch", ref, OATS_URL, dir, "-q"], { timeout: 120_000 });
  run("npm", ["install", "--omit=dev", "--silent"], { cwd: dir, timeout: 180_000 });
  return join(dir, "bin", "oats.mjs");
}
async function checkKernel(t, label, ref) {
  const cli = kernelCli(t, label, ref);
  const versionResult = run(process.execPath, [cli, "version", "--json"]);
  const version = JSON.parse(versionResult.stdout);
  assert.match(version.version, /^0\.(?:29|30)\./, `${label} kernel version ${version.version}`);

  const { deploy, env } = makeDeployment(t);
  const sync = runJson(process.execPath, [cli, "sync", "--dir", deploy, "--json"], { timeout: 120_000, env });
  assert.deepEqual(sync.packages[0].capabilities.sort(), ["oats.code-review", "oats.developer", "oats.engineering-expert"]);
  assert.deepEqual(sync.packages[0].souls, ["code-reviewer"]);

  const souls = runJson(process.execPath, [cli, "souls", "--dir", deploy, "--json"], { timeout: 120_000, env });
  assert.ok(souls.souls.some((s) => s.qualifiedName === "oats.engineering/code-reviewer" && s.package === "oats.engineering"));

  const expert = runJson(process.execPath, [cli, "spawn", "expert", "--dir", deploy, "--preview", "--json"], { timeout: 120_000, env });
  assert.deepEqual(expert.modules.map((m) => m.name), ["oats.engineering-expert"]);
  assert.ok(expert.skills.some((s) => s.name === "plan-and-spec"));

  const dev = runJson(process.execPath, [cli, "spawn", "dev", "--dir", deploy, "--preview", "--json"], { timeout: 120_000, env });
  assert.deepEqual(dev.modules.map((m) => m.name), ["oats.developer"]);
  assert.deepEqual(dev.skills.map((s) => s.name).sort(), ["execution-strategy", "run-the-review-loop", "understand-the-spec", "worktrees"]);
  assert.equal(dev.skills.some((s) => s.name === "adversarial-review"), false, "developer must not compose reviewer skills");

  const reviewer = runJson(process.execPath, [cli, "spawn", "oats.engineering/code-reviewer", "--dir", deploy, "--preview", "--json"], { timeout: 120_000, env });
  assert.deepEqual(reviewer.modules.map((m) => m.name), ["oats.code-review"]);
  assert.deepEqual(reviewer.skills.map((s) => s.name).sort(), ["adversarial-review", "security-review", "simplification-review"]);
  assert.equal(reviewer.modules.some((m) => m.name === "oats.developer"), false, "code-reviewer must not compose oats.developer");
}

test("package loads in real OATS kernels (0.29.4 and main)", { timeout: 420_000 }, async (t) => {
  await t.test("OATS 0.29.4", { timeout: 240_000 }, (tt) => checkKernel(tt, "0294", "v0.29.4"));
  await t.test("OATS main", { timeout: 240_000 }, (tt) => checkKernel(tt, "MAIN", "main"));
});
