// node research/changes-card/lib/check.js — fixtures are a real Claude Code 2.1.304 turn.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createTurnTracker, countPatch } from "./claudeChanges.js";
import { iconFor } from "./fileIcons.js";
import { labelPaths, splitRows } from "./changeList.js";

const lines = (name) =>
  readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8").trim().split("\n").map((l) => JSON.parse(l));

const expected = [
  { path: "notes.md", status: "A", insertions: 1, deletions: 0, tool: "Write" },
  { path: "keep.txt", status: "M", insertions: 1, deletions: 1, tool: "Edit" },
];

const fromStream = createTurnTracker();
lines("claude-turn.stream.jsonl").forEach(fromStream.push);
assert.deepEqual(fromStream.files(), expected);

const fromHooks = createTurnTracker();
lines("claude-turn.hooks.jsonl").forEach(fromHooks.pushHook);
assert.deepEqual(fromHooks.files(), expected);

// A failed write is not a change.
const failed = createTurnTracker({ cwd: "/repo" });
failed.push({ type: "assistant", message: { content: [{ type: "tool_use", id: "x", name: "Edit", input: { file_path: "/repo/a.ts" } }] } });
failed.push({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "x", is_error: true }] } });
assert.deepEqual(failed.files(), []);

assert.deepEqual(countPatch([{ lines: [" a", "-b", "+B", "+C"] }]), { insertions: 2, deletions: 1 });
assert.equal(iconFor("src/App.vue").file, "devicon/vuejs-original.svg");
assert.equal(iconFor("Dockerfile").file, "devicon/docker-original.svg");
assert.equal(iconFor("README.md").mono, true);
assert.equal(iconFor("logo.SVG").tone, "image");
assert.equal(iconFor("tsconfig.json").tone, "json");
assert.equal(iconFor(".eslintrc").file, "glyphs/file.svg");
assert.deepEqual(labelPaths(["a/index.ts", "b/index.ts", "c/App.vue"]), ["a/index.ts", "b/index.ts", "App.vue"]);
assert.equal(splitRows([1, 2, 3, 4, 5, 6, 7, 8, 9], 8).hidden, 0);
assert.equal(splitRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 8).hidden, 2);
console.log("ok");
