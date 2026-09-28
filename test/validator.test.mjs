import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPO = resolve(fileURLToPath(new URL("..", import.meta.url)));
const VALIDATOR = join(REPO, "scripts", "validate-package.mjs");

function runValidator(cwd = REPO) {
  return spawnSync(process.execPath, [join(cwd, "scripts", "validate-package.mjs")], { cwd, encoding: "utf8" });
}

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "oats-engineering-validator-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(REPO, dir, {
    recursive: true,
    filter: (src) => !src.includes(`${REPO}/.git`) && !src.includes(`${REPO}/node_modules`),
  });
  return dir;
}

function mutate(t, relativePath, fn) {
  const dir = fixture(t);
  const path = join(dir, relativePath);
  writeFileSync(path, fn(readFileSync(path, "utf8")));
  return runValidator(dir);
}

test("validator accepts the real package", () => {
  const result = runValidator();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /3 capabilities, 14 skills, 1 package soul/);
});

test("validator rejects capability manifest schema violations", (t) => {
  const result = mutate(t, "oats-package/capabilities/developer/oats.json", (text) => text.replace('"oats.developer"', '"Developer"'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /capabilities\/developer\/oats\.json\/capability/);
});

test("validator rejects helperInjection and team targeting in capability manifests", (t) => {
  const result = mutate(t, "oats-package/capabilities/developer/oats.json", (text) => text.replace('"requires": []', '"team": "engineering",\n  "helperInjection": { "version": 1, "mode": "omit" },\n  "requires": []'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /helperInjection/);
  assert.match(result.stderr, /\.team/);
});

test("validator rejects skill frontmatter name mismatch and missing descriptions", (t) => {
  const result = mutate(t, "oats-package/capabilities/developer/skills/worktrees/SKILL.md", (text) => text.replace("name: worktrees", "name: other-name").replace(/description: .+\n/, ""));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /frontmatter name must equal directory/);
  assert.match(result.stderr, /frontmatter must include a description/);
});

test("validator rejects duplicate skill names", (t) => {
  const dir = fixture(t);
  const target = join(dir, "oats-package/capabilities/code-review/skills/worktrees");
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, "SKILL.md"), readFileSync(join(dir, "oats-package/capabilities/developer/skills/worktrees/SKILL.md")));
  const manifest = join(dir, "oats-package/capabilities/code-review/oats.json");
  writeFileSync(manifest, readFileSync(manifest, "utf8").replace('"skills/simplification-review"', '"skills/simplification-review",\n    "skills/worktrees"'));
  const result = runValidator(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate skill name worktrees/);
});

test("validator rejects unknown slash skill references", (t) => {
  const result = mutate(t, "oats-package/capabilities/developer/injects/developer.md", (text) => text.replace("/understand-the-spec", "/missing-skill"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /\/missing-skill names no package skill/);
});

test("validator rejects bare skill names in code spans", (t) => {
  const result = mutate(t, "oats-package/capabilities/developer/injects/developer.md", (text) => text.replace("/understand-the-spec", "understand-the-spec"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must be written as \/understand-the-spec/);
});

test("validator rejects invalid package souls", (t) => {
  const result = mutate(t, "oats-package/souls/code-reviewer/soul.yaml", (text) => text.replace("schemaVersion: 2", "schemaVersion: 1"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /soul\.yaml\/schemaVersion/);
});

test("validator rejects broken docs links", (t) => {
  const result = mutate(t, "README.md", (text) => text.replace("docs/how-the-work-flows.md", "docs/missing.md"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /broken internal link docs\/missing\.md/);
});

test("validator rejects package-local ids in docs that are not exported", (t) => {
  const result = mutate(t, "README.md", (text) => text.replaceAll("oats.developer", "oats.developr"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /package-local id oats\.developr is named in docs but not exported/);
});
