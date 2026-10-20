# Tracking file changes from the Claude CLI

How to get the rows for the changes card ("N Files Changed") out of a Claude Code turn.

**Verified:** Claude Code **2.1.304**, October 20, 2026. A single `claude -p` run in a throwaway git repo wrote one new file and edited one existing file. A `PostToolUse` hook logged its payloads at the same time. Sanitized copies of both are in [`lib/fixtures/`](lib/fixtures/), and [`lib/check.js`](lib/check.js) asserts that both sources produce the same rows. Anything marked *not exercised* below was not part of that run.

## Pick a source

| Source | Use when | Catches | Misses |
|---|---|---|---|
| [1. Stream JSON](#1-stream-json-you-spawn-the-cli) | Your app spawns `claude -p` | Every built-in file write, with patch hunks | Files changed by `Bash` (codegen, `sed`, formatters) |
| [2. PostToolUse hook](#2-posttooluse-hook-ledger-any-cli-session) | Interactive CLI, or you want a persistent ledger | Same as stream, grouped by `prompt_id` | Same as stream |
| [3. Git baseline](#3-git-baseline-fallback-for-everything-else) | Fallback; net `+/−` numbers | Anything that touched the working tree | Who made the change (your own edits during the turn look the same) |

Recommended: use 1 or 2 to decide **which files** the turn changed, then read `git diff --numstat` for those paths when the turn settles to get **net counts**. UnifiedApp's card does the same thing: the change ledger supplies the names, and a working-tree diff is the fallback.

## Turn boundaries

- **Start:** when you send the prompt. Take the git snapshot (source 3) here, not when the card mounts, because by then it is too late.
- **End:** the stream's `{"type":"result"}` event, with `subtype: "success"`.
- **Show the card** only under the thread's latest assistant turn, only after it has settled, and only if the turn used tools and changed at least one file. When the user sends the next message, the card goes away. No dismiss state is needed.

## 1. Stream JSON (you spawn the CLI)

```bash
claude -p "<prompt>" --output-format stream-json --verbose --permission-mode acceptEdits
```

The output is one JSON object per line. Three event types matter:

**`system/init`** gives you `cwd`. Make paths relative to it.

**`assistant`** includes a `tool_use` block for each file write:

```json
{"type":"assistant","message":{"content":[
  {"type":"tool_use","id":"toolu_01Un…","name":"Write","input":{"file_path":"/repo/notes.md","content":"hello\n"}}]}}
```

**`user`** includes the matching `tool_result`, matched by `tool_use_id`. The structured result is in **`tool_use_result` at the top level of the event**, not inside `message`:

```json
{"type":"user","message":{"content":[{"type":"tool_result","tool_use_id":"toolu_01Un…","content":"File created successfully at: …"}]},
 "tool_use_result":{"type":"create","filePath":"/repo/notes.md","content":"hello\n","structuredPatch":[],"originalFile":null,"userModified":false}}
```

```json
{"type":"user", "…": "…",
 "tool_use_result":{"filePath":"/repo/keep.txt","oldString":"b","newString":"B","originalFile":"a\nb\nc\n",
   "structuredPatch":[{"oldStart":1,"oldLines":3,"newStart":1,"newLines":3,"lines":[" a","-b","+B"," c"]}],
   "userModified":false,"replaceAll":false}}
```

To turn these into rows:

| Field | Row value |
|---|---|
| `tool_use_result.filePath` (or `input.file_path`) | `path`, made relative to `cwd` |
| `type: "create"` | `status: "A"`, which shows the **new** badge |
| `structuredPatch[].lines` starting with `+` or `-` | `insertions` / `deletions` |
| `type: "create"` with an empty `structuredPatch` | `insertions` = line count of `content` |
| `tool_result.is_error: true` | skip it, because nothing was written |

Tools to watch: `Edit`, `Write`, `MultiEdit`, `NotebookEdit`. Only `Write` and `Edit` were exercised. The tracker falls back to `input.file_path` or `input.notebook_path` with zero counts when a result has no `structuredPatch`.

Here is the reducer, ready to use ([`lib/claudeChanges.js`](lib/claudeChanges.js)):

```js
import { spawn } from 'node:child_process'
import readline from 'node:readline'
import { createTurnTracker } from './lib/claudeChanges.js'

const tracker = createTurnTracker()
const proc = spawn('claude', ['-p', prompt, '--output-format', 'stream-json', '--verbose'], { cwd, stdio: ['ignore', 'pipe', 'inherit'] })
for await (const line of readline.createInterface({ input: proc.stdout })) {
  const event = JSON.parse(line)
  tracker.push(event)
  if (event.type === 'result') showCard(tracker.files())   // [{ path, status, insertions, deletions, tool }]
}
```

Use `stdio: 'ignore'` for stdin, or pass `< /dev/null` in a shell. Otherwise the CLI waits about 3 seconds for piped input and prints a warning.

**Subagents** (*not exercised*): events from a subagent carry a non-null `parent_tool_use_id`. Their writes still belong to this turn, so the tracker counts them.

## 2. PostToolUse hook ledger (any CLI session)

Hooks also run in interactive `claude`, so this works when your app does not own the process. Add this to `.claude/settings.json`, or pass it with `--settings <file>`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/log-change.sh" }]
      }
    ]
  }
}
```

`.claude/hooks/log-change.sh` (needs `jq`, and `chmod +x`). The `jq` filter was run against the captured payloads. `$CLAUDE_PROJECT_DIR` is the documented hook environment variable, but the capture used an absolute path, so it was not exercised:

```sh
#!/bin/sh
# One line per successful file write, grouped per turn by prompt_id.
jq -c '{session_id, prompt_id, tool_use_id, tool_name, cwd,
        file: (.tool_response.filePath // .tool_input.file_path),
        type: .tool_response.type,
        patch: .tool_response.structuredPatch}' >> "$CLAUDE_PROJECT_DIR/.claude/changes.jsonl"
```

The hook receives this JSON on stdin (observed keys): `session_id`, `transcript_path`, `cwd`, `prompt_id`, `permission_mode`, `hook_event_name`, `tool_name`, `tool_input`, **`tool_response`**, `tool_use_id`, `duration_ms`. `tool_response` has the same shape as the stream's `tool_use_result`.

- **`prompt_id`** is the same for every write in one turn, so the card can group by it with no turn tracking of its own.
- In JavaScript, `tracker.pushHook(payload)` accepts the raw payload.
- When hooks are configured, the stream also emits `system/hook_started` and `system/hook_response` events. Ignore them.
- Add `.claude/changes.jsonl` to `.gitignore`.

## 3. Git baseline (fallback for everything else)

This catches what tool events cannot, such as files written by `Bash`, formatters, or `npm install`. It runs the same baseline-and-compare as UnifiedApp's `turnBaseline.ts` and `changedSince()`.

```bash
git status --porcelain=v1 -z --untracked-files=all   # paths and status letters (?? = untracked)
git diff --numstat HEAD -z                          # +/- per tracked path ("-  -" = binary)
```

1. **At turn start**, build `path → "status:insertions:deletions"`. Get untracked line counts with `wc -l`, or with `git diff --no-index --numstat /dev/null <file>`.
2. **At turn end**, read the tree again and keep only the paths whose value changed.
3. **If there is no baseline** (the app opened mid-turn, or the user switched chats), show an empty list, not the whole tree.

The known limit: a file *you* edit while the agent works looks like the agent's change. This approach shows a file rather than hiding one.

## Undo

Each first-touch result already contains what Undo needs. Keep the **first** `originalFile` you see for each path in the turn:

- `originalFile: null` (from a `create`): undo deletes the file.
- Otherwise: undo writes `originalFile` back.

Before writing, re-read the file and refuse if it changed after the turn ended. UnifiedApp's discard does the same re-read on the Rust side, so a stale row returns an error instead of overwriting newer work. `userModified: true` means the user edited the proposed change before accepting it. The result still describes what landed.

## Caveat on counts

The tracker adds up each edit's own hunks. If the agent edits the same line twice, the row shows `+2 −2`, while git shows `+1 −1`. Use the git read at the end of the turn when the counts need to be exact.
