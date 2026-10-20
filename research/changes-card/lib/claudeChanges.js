/**
 * Build the changes card's rows from a Claude CLI turn.
 *
 * Feed it every parsed line of `claude -p --output-format stream-json --verbose`
 * (or every PostToolUse hook payload) for ONE turn, then read `files()`.
 * Shapes verified against Claude Code 2.1.304 — see ../claude-cli-change-tracking.md.
 */

/** Built-in tools that write files. Bash can too; the git fallback covers it. */
export const EDIT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

/** Count +/− lines in a `structuredPatch` (unified-diff hunks). */
export function countPatch(hunks = []) {
  let insertions = 0;
  let deletions = 0;
  for (const hunk of hunks) {
    for (const line of hunk.lines ?? []) {
      if (line.startsWith("+")) insertions++;
      else if (line.startsWith("-")) deletions++;
    }
  }
  return { insertions, deletions };
}

function lineCount(text) {
  if (!text) return 0;
  return text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
}

function relative(path, cwd) {
  if (cwd && path.startsWith(cwd.replace(/\/?$/, "/"))) return path.slice(cwd.replace(/\/?$/, "/").length);
  return path;
}

export function createTurnTracker({ cwd = "" } = {}) {
  /** tool_use_id → tool name, from assistant `tool_use` blocks. */
  const pending = new Map();
  /** path → ChangedFile, in first-touched order. */
  const byPath = new Map();

  function record(toolName, result, inputPath) {
    const path = relative(result?.filePath ?? inputPath ?? "", cwd);
    if (!path) return;
    // ponytail: sums each edit's own hunks, so editing one line twice reads +2/−2.
    // For net numbers, re-read `git diff --numstat` for these paths when the turn ends.
    const created = result?.type === "create";
    const counts = created && !result.structuredPatch?.length
      ? { insertions: lineCount(result.content), deletions: 0 }
      : countPatch(result?.structuredPatch);
    const prev = byPath.get(path);
    byPath.set(path, {
      path,
      status: prev?.status === "A" || created ? "A" : "M",
      insertions: (prev?.insertions ?? 0) + counts.insertions,
      deletions: (prev?.deletions ?? 0) + counts.deletions,
      tool: toolName,
    });
  }

  return {
    /** One parsed stream-json event. */
    push(event) {
      if (event.type === "system" && event.subtype === "init" && !cwd) cwd = event.cwd ?? "";
      if (event.type === "assistant") {
        for (const block of event.message?.content ?? []) {
          if (block.type === "tool_use" && EDIT_TOOLS.has(block.name)) {
            pending.set(block.id, { name: block.name, path: block.input?.file_path ?? block.input?.notebook_path });
          }
        }
      }
      if (event.type === "user") {
        for (const block of event.message?.content ?? []) {
          if (block.type !== "tool_result" || !pending.has(block.tool_use_id)) continue;
          const call = pending.get(block.tool_use_id);
          pending.delete(block.tool_use_id);
          // A denied or failed write changed nothing.
          if (block.is_error) continue;
          record(call.name, event.tool_use_result, call.path);
        }
      }
    },
    /** One PostToolUse hook payload (stdin JSON). Hooks only fire on success. */
    pushHook(payload) {
      if (!EDIT_TOOLS.has(payload.tool_name)) return;
      if (!cwd) cwd = payload.cwd ?? "";
      record(payload.tool_name, payload.tool_response, payload.tool_input?.file_path ?? payload.tool_input?.notebook_path);
    },
    /** @returns {import('./changeList.js').ChangedFile[]} */
    files() {
      return [...byPath.values()];
    },
  };
}
