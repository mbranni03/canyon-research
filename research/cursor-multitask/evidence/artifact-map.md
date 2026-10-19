# Cursor installed artifact map

Read-only packaged-file inspection, 2026-10-19. No app execution or user-profile/database access. This is a locator map, not proof of execution.

## Artifact identity

Root: `<CURSOR_APP_ROOT>`

- Cursor: **3.25.9**, stable; VS Code base **1.128.0**.
- Commit: `5d4df965746c5d09740842fc0f1331ba1c157830`.
- realCommit: `5d4df965746c5d09740842fc0f1331ba1c15783d`.
- Build date: `2026-10-15T21:52:24.891Z`.

## Candidate source paths

All paths relative to the root above. Sizes and SHA-256 cover exact installed bytes.

### `extensions/cursor-local-agent-runtime/dist/main.js`
- Size: 6,266,536 bytes; SHA-256: `a1e79380a858ba2e01170c81d3e31f39a50c000706584cfb11313a11a117b0f5`.
- Primary compact prompt/runtime target; Multitask Mode Guidelines, Start Multitasking prompt, background completion schema.

### `extensions/cursor-agent-host/dist/main.js`
- Size: 10,657,808 bytes; SHA-256: `b4f73453c153fdf0961782af5cc11905bb8d57ebb90f38fe2b4da084f2b55fe8`.
- Local agent host lifecycle and background completion processing; prompt duplication.

### `out/vs/workbench/workbench.glass.main.js`
- Size: 48,353,574 bytes; SHA-256: `a7fd1d4c60239dbe5527117d94d7181664525c49a7a294508c59a5082e423014`.
- Agents Window UI, startMultitasking.js, subagentExecutor.js, completion action/wakeup dispatch.

### `out/vs/workbench/workbench.desktop.main.js`
- Size: 40,751,572 bytes; SHA-256: `c999d13ea376bb074a6f269abeb4297d302e2ac76aa8b9cdc4af1e5bb199398b`.
- Editor mode registration and shared subagent implementation.

### `extensions/cursor-agent-exec/dist/main.js`
- Size: 9,457,580 bytes; SHA-256: `6d13818167a3619794433ca1e1a9b822a7d23aceab98ef6acab110fa3d50991b`.
- Execution/prompt counterpart; substantial duplication of local-agent-runtime.

### `extensions/cursor-retrieval/dist/main.js`
- Size: 2,180,082 bytes; SHA-256: `52275c7b65dd7c3d07705dc57f454acfd80b27fdbba79f0ea0f906e827dd7924`.
- GitProvider.createWorktree implementation; distinct worktree subsystem.

### `package.json`
- Size: 420 bytes; SHA-256: `acb776eb6d50a96497333c8ed71d5c10e9b0dc01d7c2318a0d0f56cc2e284ee4`.
- App version.

### `product.json`
- Size: 52,169 bytes; SHA-256: `e3b6980395f2f8a579381d3840e21c39330b3e2627b41c9754b7c64568c93aa5`.
- Build/commit identity.

## Focused seeds

Locations are original file line and **zero-based Unicode character offset**, not byte offset. Minified bundles have long lines. Match exact seeds before reading bounded excerpts.

| File | Line | Character offset | Seed |
|---|---:|---:|---|
| `extensions/cursor-local-agent-runtime/dist/main.js` | 8 | 2,234,859 | `function nZ(` |
| `extensions/cursor-local-agent-runtime/dist/main.js` | 8 | 3,484,280 | `Multitask Mode Guidelines` |
| `extensions/cursor-local-agent-runtime/dist/main.js` | 8 | 3,482,862 | `The user has engaged` |
| `extensions/cursor-agent-host/dist/main.js` | 8 | 3,848,070 | `agent.background_task_completion` |
| `extensions/cursor-agent-host/dist/main.js` | 8 | 2,095,927 | `runInBackground:s.runInBackground` |
| `out/vs/workbench/workbench.glass.main.js` | 14698 | 26,810,584 | `startMultitasking.js` |
| `out/vs/workbench/workbench.glass.main.js` | 9625 | 21,019,615 | `subagentExecutor.js` |
| `out/vs/workbench/workbench.glass.main.js` | 23503 | 40,117,797 | `buildBackgroundTaskCompletionAction` |
| `out/vs/workbench/workbench.glass.main.js` | 8020 | 16,323,460 | `id:"multitask"` |
| `out/vs/workbench/workbench.glass.main.js` | 120 | 1,010,471 | `enable_multitask_mode` |
| `extensions/cursor-retrieval/dist/main.js` | 2 | 1,859,206 | `async createWorktree(` |

## Bounded observations

- The packaged Start Multitasking reminder contains the instruction to create exactly one async subagent fork with `run_in_background` true and `resume` set to `self`. This is prompt text, not evidence that the instruction executed.
- The glass bundle has an explicit `multitask` mode entry described as orchestration of multiple subagents; it also has a distinct Build in Parallel action.
- `subagentExecutor.js` has `handles`/`active...` state and `runInBackground` handling. `buildBackgroundTaskCompletionAction` constructs the corresponding action from completion records.
- `cursor-agent-host` includes `agent.background_task_completion` logging and `enableAwaitForSubagents`, `enableBackgroundTaskProgress`, `enableBoundedSubagentAwait` defaults.
- `cursor-retrieval` contains `GitProvider.createWorktree`, HEAD resolution, worktree-root path construction, and stale worktree pruning. Worktree isolation must not be assumed from the existence of this subsystem.

## Search boundaries / negative results

- Searched packaged `out` and `extensions/cursor-*` JavaScript/JSON for multitask, parallel-agent and worktree seeds.
- Literal `/multitask` was absent from `workbench.glass.main.js`; command matching can be indirect, so this does not establish absence of the slash command.
- Most small extension multitask hits are duplicated protocol enum definitions rather than feature logic.
- No runtime, server-side or user setting behavior was observed. REA Evidence IDs must come from the parent investigation.

## Suggested bounded REA source selection

Start with `extensions/cursor-local-agent-runtime/dist/main.js` and `extensions/cursor-agent-host/dist/main.js` for prompts and lifecycle. Add `out/vs/workbench/workbench.glass.main.js` for UI-to-action/subagent wiring. The desktop/exec bundles are secondary corroboration with significant duplication. Add retrieval only for explicitly scoped worktree questions.
