#!/usr/bin/env node
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const payloadRoot = join(repoRoot, "oats-package");
const errors = [];
const report = (at, message) => errors.push(`${at}: ${message}`);

const pointerKey = (key) => key.replace(/~/g, "~0").replace(/\//g, "~1");
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const typeOf = (value) => value === null ? "null" : Array.isArray(value) ? "array" : Number.isInteger(value) ? "integer" : typeof value;
const show = (value) => value === undefined ? "undefined" : JSON.stringify(value);
const regexCache = new Map();
const regexOf = (pattern) => regexCache.get(pattern) ?? regexCache.set(pattern, new RegExp(pattern, "u")).get(pattern);

function readJson(path, label = relative(repoRoot, path)) {
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { report(label, `invalid JSON (${error.message})`); return undefined; }
}

function deref(root, ref) {
  if (!ref.startsWith("#/")) throw new TypeError(`only local $ref is supported: ${ref}`);
  let node = root;
  for (const part of ref.slice(2).split("/")) node = node?.[part.replace(/~1/g, "/").replace(/~0/g, "~")];
  if (node === undefined) throw new TypeError(`unresolvable $ref ${ref}`);
  return node;
}
function typeMatches(value, type) {
  const actual = typeOf(value);
  if (type === "number") return actual === "number" || actual === "integer";
  return actual === type;
}
function validateAgainst(schema, value, { root = schema, path = "" } = {}) {
  const problems = [];
  const push = (p, message) => problems.push({ path: p, message });
  const check = (s, v, p) => {
    if (!s || typeof s !== "object") return;
    if (s.$ref) s = { ...deref(root, s.$ref), ...Object.fromEntries(Object.entries(s).filter(([k]) => k !== "$ref" && k !== "description")) };
    if (s.type !== undefined) {
      const types = Array.isArray(s.type) ? s.type : [s.type];
      if (!types.some((t) => typeMatches(v, t))) { push(p, `expected ${types.join(" | ")}, got ${typeOf(v)}`); return; }
    }
    if (s.const !== undefined && JSON.stringify(v) !== JSON.stringify(s.const)) { push(p, `expected ${show(s.const)}, got ${show(v)}`); return; }
    if (s.enum && !s.enum.some((e) => JSON.stringify(e) === JSON.stringify(v))) { push(p, `expected one of ${s.enum.map(show).join(", ")}, got ${show(v)}`); return; }
    if (s.anyOf || s.oneOf) {
      const branches = s.anyOf || s.oneOf;
      const results = branches.map((b) => validateAgainst(b, v, { root, path: p }));
      const passing = results.filter((r) => r.length === 0).length;
      if (passing === 0) { problems.push(...(results.find((r) => r.length) || [{ path: p, message: `matched no alternative` }])); return; }
      if (s.oneOf && passing > 1) { push(p, `matches ${passing} alternatives, expected exactly one`); return; }
    }
    if (s.not && validateAgainst(s.not, v, { root, path: p }).length === 0) { push(p, `must not match forbidden schema`); return; }
    if (typeof v === "string") {
      if (s.minLength !== undefined && v.length < s.minLength) push(p, `must be at least ${s.minLength} character(s)`);
      if (s.maxLength !== undefined && v.length > s.maxLength) push(p, `must be at most ${s.maxLength} character(s)`);
      if (s.pattern && !regexOf(s.pattern).test(v)) push(p, `${show(v)} does not match ${s.pattern}`);
    } else if (Array.isArray(v)) {
      if (s.minItems !== undefined && v.length < s.minItems) push(p, `must have at least ${s.minItems} item(s)`);
      if (s.maxItems !== undefined && v.length > s.maxItems) push(p, `must have at most ${s.maxItems} item(s)`);
      if (s.uniqueItems) {
        const seen = new Map();
        v.forEach((item, i) => { const k = JSON.stringify(item); if (seen.has(k)) push(`${p}/${i}`, `duplicates item ${seen.get(k)}`); else seen.set(k, i); });
      }
      if (s.items) v.forEach((item, i) => check(s.items, item, `${p}/${i}`));
    } else if (isObject(v)) {
      const keys = Object.keys(v);
      for (const req of s.required || []) if (!Object.hasOwn(v, req)) push(p, `missing required property ${show(req)}`);
      for (const key of keys) {
        const kp = `${p}/${pointerKey(key)}`;
        if (s.propertyNames) for (const pr of validateAgainst(s.propertyNames, key, { root, path: kp })) push(kp, `invalid key ${show(key)}: ${pr.message}`);
        let matched = false;
        if (s.properties && Object.hasOwn(s.properties, key)) { matched = true; check(s.properties[key], v[key], kp); }
        if (s.patternProperties) for (const [pat, sub] of Object.entries(s.patternProperties)) if (regexOf(pat).test(key)) { matched = true; check(sub, v[key], kp); }
        if (!matched) {
          if (s.additionalProperties === false) push(kp, `unknown property ${show(key)}`);
          else if (isObject(s.additionalProperties)) check(s.additionalProperties, v[key], kp);
        }
      }
    }
  };
  check(schema, value, path);
  return problems;
}

function safeResource(root, base, candidate, at, kind = "path") {
  if (typeof candidate !== "string" || !candidate.trim()) { report(at, `${kind} must be a non-empty string`); return null; }
  if (isAbsolute(candidate) || candidate.split(/[\\/]+/).includes("..")) { report(at, `${kind} must be relative and may not contain '..'`); return null; }
  const target = resolve(base, candidate);
  if (!existsSync(target)) { report(at, `${kind} does not exist: ${candidate}`); return null; }
  const realRoot = realpathSync(root);
  const realTarget = realpathSync(target);
  if (realTarget !== realRoot && !realTarget.startsWith(realRoot + sep)) report(at, `${kind} escapes ${relative(repoRoot, root) || "."} after symlink resolution`);
  return target;
}

function commandEntrypoint(spec) {
  const command = typeof spec === "string" ? spec : (spec && typeof spec === "object" ? spec.command : undefined);
  return typeof command === "string" ? command.trim().split(/\s+/)[0] : command;
}

function parseInlineValue(raw) {
  const s = raw.trim();
  if (s === "") return {};
  if (s === "none") return "none";
  if (s === "true") return true;
  if (s === "false") return false;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  if (s.startsWith("{") && s.endsWith("}")) {
    const obj = {};
    const inner = s.slice(1, -1).trim();
    if (!inner) return obj;
    for (const part of inner.split(/\s*,\s*/)) {
      const idx = part.indexOf(":");
      if (idx < 0) return s;
      obj[part.slice(0, idx).trim()] = parseInlineValue(part.slice(idx + 1));
    }
    return obj;
  }
  if (/^-?(?:0|[1-9][0-9]*)$/.test(s)) return Number(s);
  return s;
}
function parseYamlSubset(text, label) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    const colon = line.indexOf(":");
    if (colon < 0) { report(`${label}:${index + 1}`, "unsupported YAML line"); continue; }
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).replace(/\s+#.*$/, "").trim();
    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1]?.obj;
    if (!parent || !isObject(parent)) { report(`${label}:${index + 1}`, "invalid indentation"); continue; }
    parent[key] = value === "" ? {} : parseInlineValue(value);
    if (value === "") stack.push({ indent, obj: parent[key] });
  }
  return root;
}

function parseSkillFrontmatter(file) {
  const text = readFileSync(file, "utf8");
  if (!text.startsWith("---\n")) return { text, frontmatter: null };
  const end = text.indexOf("\n---", 4);
  if (end < 0) return { text, frontmatter: null };
  const fm = {};
  for (const raw of text.slice(4, end).split(/\r?\n/)) {
    if (!raw.trim()) continue;
    const idx = raw.indexOf(":");
    if (idx < 0) continue;
    fm[raw.slice(0, idx).trim()] = raw.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return { text, frontmatter: fm };
}
function walk(dir, predicate = () => true) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = lstatSync(path);
    if (st.isDirectory()) out.push(...walk(path, predicate));
    else if (predicate(path)) out.push(path);
  }
  return out;
}

const packageSchema = readJson(join(repoRoot, "schemas", "oats-package.schema.json"));
const capabilitySchema = readJson(join(repoRoot, "schemas", "capability-manifest.schema.json"));
const soulSchema = readJson(join(repoRoot, "schemas", "soul.schema.json"));
const packageManifest = readJson(join(payloadRoot, "oats-package.json"));

if (!existsSync(payloadRoot)) report("oats-package", "missing payload root");
if (packageManifest && packageSchema) {
  for (const problem of validateAgainst(packageSchema, packageManifest)) report(`oats-package.json${problem.path}`, problem.message);
  if (packageManifest.package !== "oats.engineering") report("oats-package.json.package", "must be oats.engineering");
  if (packageManifest.version !== "1.2.0") report("oats-package.json.version", "must be 1.2.0");
}

const rawFiles = walk(repoRoot, (p) => !p.includes(`${sep}.git${sep}`) && !p.includes(`${sep}node_modules${sep}`));
for (const file of rawFiles) {
  const rel = relative(repoRoot, file);
  const text = readFileSync(file, "utf8");
  if (/^\s*team\s*:/m.test(text)) report(rel, "team: is not allowed in this package (team model v2)");
}

const capabilities = [];
const skillNames = new Map();
const capabilityIds = new Set();
for (const [index, capabilityDir] of (Array.isArray(packageManifest?.capabilities) ? packageManifest.capabilities : []).entries()) {
  const capabilityRoot = safeResource(payloadRoot, payloadRoot, capabilityDir, `oats-package.json.capabilities[${index}]`, "capability directory");
  if (!capabilityRoot) continue;
  const manifestPath = join(capabilityRoot, "oats.json");
  if (!existsSync(manifestPath)) { report(relative(repoRoot, capabilityRoot), "capability directory has no oats.json"); continue; }
  const manifest = readJson(manifestPath);
  if (!manifest) continue;
  capabilities.push({ manifest, root: capabilityRoot, rel: relative(payloadRoot, capabilityRoot) });
  if (manifest.capability) capabilityIds.add(manifest.capability);
  if (capabilitySchema) for (const problem of validateAgainst(capabilitySchema, manifest)) report(`${relative(payloadRoot, manifestPath)}${problem.path}`, problem.message);
  for (const forbidden of ["team", "helperInjection", "global", "agent-types", "souls"]) if (Object.hasOwn(manifest, forbidden)) report(`${relative(payloadRoot, manifestPath)}.${forbidden}`, "not allowed in a capability manifest");
  if (manifest.version !== packageManifest?.version) report(`${relative(payloadRoot, manifestPath)}.version`, "must match package version");
  if (manifest.compatibility?.oats !== packageManifest?.compatibility?.oats) report(`${relative(payloadRoot, manifestPath)}.compatibility.oats`, "must match package compatibility");
  for (const [resourceIndex, resource] of (manifest.skills || []).entries()) {
    const resourcePath = safeResource(capabilityRoot, capabilityRoot, resource, `${relative(payloadRoot, manifestPath)}.skills[${resourceIndex}]`, "skill path");
    if (!resourcePath) continue;
    const skillFile = statSync(resourcePath).isDirectory() ? join(resourcePath, "SKILL.md") : resourcePath;
    if (!existsSync(skillFile)) { report(relative(repoRoot, resourcePath), "skill path has no SKILL.md"); continue; }
    const dirName = basename(dirname(skillFile));
    const { frontmatter } = parseSkillFrontmatter(skillFile);
    if (!frontmatter) { report(relative(repoRoot, skillFile), "missing YAML frontmatter"); continue; }
    if (frontmatter.name !== dirName) report(relative(repoRoot, skillFile), `frontmatter name must equal directory (${dirName})`);
    if (!frontmatter.description) report(relative(repoRoot, skillFile), "frontmatter must include a description");
    if (skillNames.has(dirName)) report(relative(repoRoot, skillFile), `duplicate skill name ${dirName} (also ${skillNames.get(dirName)})`);
    else skillNames.set(dirName, relative(repoRoot, skillFile));
  }
  if (manifest.inject) safeResource(capabilityRoot, capabilityRoot, manifest.inject, `${relative(payloadRoot, manifestPath)}.inject`, "injection path");
  for (const [name, command] of Object.entries(manifest.commands || {})) safeResource(capabilityRoot, capabilityRoot, commandEntrypoint(command), `${relative(payloadRoot, manifestPath)}.commands.${name}`, "command entrypoint");
  for (const [event, hook] of Object.entries(manifest.hooks || {})) safeResource(capabilityRoot, capabilityRoot, commandEntrypoint(hook), `${relative(payloadRoot, manifestPath)}.hooks.${event}`, "hook entrypoint");
}

const soulNames = new Set();
for (const [index, soulDir] of (Array.isArray(packageManifest?.souls) ? packageManifest.souls : []).entries()) {
  const soulRoot = safeResource(payloadRoot, payloadRoot, soulDir, `oats-package.json.souls[${index}]`, "soul directory");
  if (!soulRoot) continue;
  const rel = relative(repoRoot, soulRoot);
  const soulYaml = join(soulRoot, "soul.yaml");
  const agents = join(soulRoot, "AGENTS.md");
  if (!existsSync(soulYaml)) { report(rel, "missing soul.yaml"); continue; }
  if (!existsSync(agents)) report(rel, "missing AGENTS.md");
  const parsed = parseYamlSubset(readFileSync(soulYaml, "utf8"), relative(repoRoot, soulYaml));
  if (soulSchema) for (const problem of validateAgainst(soulSchema, parsed)) report(`${relative(repoRoot, soulYaml)}${problem.path}`, problem.message);
  if (parsed.name !== basename(soulRoot)) report(relative(repoRoot, soulYaml), "soul name must equal its directory name");
  soulNames.add(parsed.name);
  for (const [capability, choice] of Object.entries(parsed.capabilities || {})) {
    if (choice !== "off" && choice?.from === "here" && !capabilityIds.has(capability)) report(relative(repoRoot, soulYaml), `from: here names unknown package capability ${capability}`);
  }
}

const knownSkills = new Set(skillNames.keys());
for (const { manifest, root } of capabilities) {
  const markdown = [];
  if (manifest.inject) markdown.push(join(root, manifest.inject));
  for (const resource of manifest.skills || []) {
    const path = join(root, resource);
    markdown.push(statSync(path).isDirectory() ? join(path, "SKILL.md") : path);
  }
  for (const file of markdown) {
    if (!existsSync(file)) continue;
    const rel = relative(repoRoot, file);
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/(?<!`)`([^`\n]+)`(?!`)/g)) {
      const code = match[1].trim();
      if (code.startsWith("/")) {
        if (!/^\/[a-z0-9][a-z0-9-]*$/.test(code)) report(rel, `skill reference ${show(code)} must be /<skill-name>`);
        else if (!knownSkills.has(code.slice(1))) report(rel, `skill reference ${code} names no package skill`);
      } else if (knownSkills.has(code)) {
        report(rel, `skill reference ${show(code)} must be written as /${code}`);
      }
    }
  }
}

const docs = [join(repoRoot, "README.md"), ...walk(join(repoRoot, "docs"), (p) => extname(p) === ".md")];
const localIds = new Set([packageManifest?.package, ...capabilityIds, ...soulNames].filter(Boolean));
for (const file of docs) {
  const rel = relative(repoRoot, file);
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const pathPart = target.split("#")[0];
    if (!pathPart) continue;
    const resolved = resolve(dirname(file), pathPart);
    if (!existsSync(resolved)) report(rel, `broken internal link ${target}`);
  }
  for (const match of text.matchAll(/(?<!`)`([^`\n]+)`(?!`)/g)) {
    const code = match[1].trim();
    const candidates = [code, code.split(/\s*:\s*/)[0]];
    for (const id of candidates) {
      if (/^oats\.(?:engineering(?:-[a-z]+)?|develop[a-z-]*|code-review)$/.test(id) || id === "code-reviewer") {
        if (!localIds.has(id)) report(rel, `package-local id ${id} is named in docs but not exported`);
      }
    }
  }
}

if (errors.length) {
  process.stderr.write(`Package validation failed:\n- ${errors.join("\n- ")}\n`);
  process.exit(1);
}
process.stdout.write(`Validated oats.engineering ${packageManifest?.version}: ${capabilities.length} capabilities, ${skillNames.size} skills, ${soulNames.size} package soul(s).\n`);
