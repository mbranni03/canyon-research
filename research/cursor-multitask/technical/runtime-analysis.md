# Cursor Multitask: runtime bundle findings

**Conclusion:** the shipped runtime implements Multitask as a foreground coordinator policy plus asynchronous child-agent execution and completion events. The “Start Multitasking” transition asks the model to make a single self-fork; it does not directly clone an operating-system process in the inspected code. The executable Task path supplies conversation-state inheritance or a `forkAgentId`, tracks agent identity, and processes completion notifications. The prompt policy is part of the mechanism, so successful model compliance cannot be concluded from static code alone.

## Scope and evidence

Read-only inspection of `<CURSOR_APP_ROOT>/extensions/cursor-local-agent-runtime/dist/main.js`; no execution, traffic, user conversations, account configuration, or runtime flags inspected. SHA-256: `a1e79380a858ba2e01170c81d3e31f39a50c000706584cfb11313a11a117b0f5`; size: 6,266,536 bytes.

`R01`–`R33` refer to exact excerpts in [runtime-snippets.json](../evidence/runtime-snippets.json), with UTF-8 byte offsets, line numbers, source digest and per-snippet digest. They are **local static-source evidence identifiers**, not REA Evidence IDs. Parent-session REA analysis is separate; its graph was capped at 12,000 nodes, and did not resolve the prompt seed. These source excerpts support feature claims without treating a capped graph as complete.

## Entering, persisting, and leaving Multitask

1. `nZ` detects the simulated-message reason `MULTITASK` and emits a system reminder saying that the user clicked Start Multitasking. It instructs exactly one asynchronous subagent with `run_in_background: true`, `resume: "self"`, and the prompt `You are the forked subagent; continue executing your task.` The exact continuation prompt is an explicit recursion guard: its recipient should continue rather than fork again. The original foreground agent should stop immediately after the fork, with no further foreground work or user-visible response. **Observed prompt construction, not a hard executable guarantee of one child.** [R01]
2. `N_e` emits the full Multitask reminder on entry, a shorter reminder on later user turns already in Multitask, and an exit reminder when the previous mode was Multitask and the new mode differs. The Multitask branch skips its ordinary mode reminder when `isUserTurn` is false. Policy says it persists until the user exits; exiting permits ordinary synchronous or asynchronous agents. This inspection does not establish the UI persistence storage. [R05–R06]
3. The mode's default is one coherent worker for most nontrivial requests. Several siblings are justified by independent top-level deliverables or independent exploration that materially improves accuracy/latency. Ordinary investigation/fix/test work should usually stay together; internal decomposition can be delegated to the worker. The parent should not duplicate delegated work, poll, await, or sleep waiting for completion. [R03–R04]
4. Model-specific prompt selection matters. `Wve` returns true for Composer 2 or Composer Matterhorn excluding raw training slugs. These models receive stricter wording requiring asynchronous delegation for any tool use; the other branch permits trivial zero/one-tool requests in foreground. This is wording generation, not a measured enforcement rule. [R03–R05]
5. “Build in Parallel” has separate prompt instructions: derive dependency-based phases from plan todos, run independent phases as asynchronous top-level agents, reference the plan file rather than repeating it, and use later full-implementation testing workers if several implementation workers are parallelized. These instructions explicitly override normal reluctance to create siblings during that plan execution. The code only says the user entered Multitask when resolved mode is absent or Multitask, so Build in Parallel is not invariably identical to mode entry. [R02]

## Fresh child, resumed child, and self-fork are different

| Invocation | Prompt contract | Executable evidence |
|---|---|---|
| Fresh Task without `resume` | Supply all task context; ordinary fresh children do not see the parent user message/prior assistant steps. | `xDe` uses a configured conversation-state mapper if present, otherwise an empty `X.Y9z` conversation state. This is a default, not proof every configured child lacks all inherited system/environment context. [R07, R32–R33] |
| `resume: childId` | Follow up after completion, retaining the existing child's context. | Resolve stored aliases, restore stored child conversation when available, retain saved child type/model, and reject incompatible type/model availability. Missing state can fall back to fresh/mapped state on the server preparation path, so the prompt promise has a recovery-path qualification. [R07–R09, R23] |
| `resume: "self"` | Fork the current parent's conversation into a new child. | `eNe` trims and lowercases the value and compares it with sentinel `"self"`. `kDe` skips normal child-ID lookup and selects the parent requested/current model. Server preparation gets parent state; client execution sends current conversation ID as `forkAgentId` and no `resumeAgentId`. [R07–R08, R12–R13, R17, R31] |

`selfForkTurns` defaults to `"all"` in server preparation. A positive integer can select recent turns while retaining the initial root prompt prefix; invalid values reject, and misaligned root-prompt state falls back to the whole conversation. The client-executor fork route instead forwards `forkAgentId`; its downstream copy implementation is outside this bundle trace. [R07, R10–R11, R17]

Self-fork is capability-gated. Async schema availability requires client-side execution or enabled cloud async subagents; self-fork additionally requires `allowResumeSelfFork`, and unsupported `resume: self` is explicitly rejected. Application plumbing ties that flag to IDE/BACKGROUND agent types. Presence of code cannot establish whether the installed user's rollout enables it. [R12, R15, R30]

## Task arguments, identity, and asynchronous lifecycle

- `run_in_background` is an optional boolean in the advertised Task schema only when async capability is enabled. Its help says false blocks, true runs in background, and Multitask should always set true. If `defaultSubagentsRunInBackground` is enabled and the argument is missing, actual preprocessing inserts true; a client run otherwise uses the argument or the chosen subagent configuration's `isBackground`. The inspected schema does not mechanically force true merely because mode is Multitask. [R14–R18]
- The new subagent ID is constructed through `_Y` from `subagent-${type}-${toolCallId}`; the request ID separately uses `subagent-request-${toolCallId}`. A resume reuses the resolved child ID. Do not assume `_Y` is a plain concatenation: this trace records its input, not an unverified ID encoding. [R08–R09]
- The client-executed branch sends tool-call ID, subagent type/model, prompt, readonly/mode information, parent/root conversation IDs, resume/fork identity, background argument, interrupt argument, continuation configuration and selected attachments through the subagent executor. Returned agent IDs and state metadata are persisted. [R17–R18]
- `backgroundReason` differentiates ordinary completion (`UNSPECIFIED`) from background handoff, including `AGENT_REQUEST`, `USER_REQUEST`, and `QUEUED_FOLLOW_UP`. Foreground completion includes the final assistant response; background handoff suppresses that immediate final-message construction and renders running/background information with the agent ID. Completion wording optionally mentions automatic delivery after the parent ends its turn; transcript-monitoring wording also varies with flags. Therefore do not turn a particular prompt's “cannot poll” statement into a universal claim that transcript access is impossible. [R18–R19]
- A client-side synchronous Task has a steering hook: a newly admitted user injection requests background handoff, retries when appropriate after 500 ms, and stops after acceptance/disposal. This is evidence that foreground blocking work can be handed off when the user steers; it is separate from the Start Multitasking self-fork prompt. [R17]

## Follow-ups and queue semantics

The Task schema says resuming a running async child fails unless `interrupt: true` is enabled and supplied. Its interrupt description reserves immediate interruption for an explicit user request to change the running work. Completed children can be resumed without interrupt. [R13, R32]

Crucially, although the protocol contains the name `QUEUED_FOLLOW_UP`, this Task path **converts that returned reason into a tool error**, with the message “Sub-agent is currently running. You may send the follow-up message when it has completed.” It optionally adds retry guidance for `interrupt: true`. This does not prove a user follow-up was durably queued; do not document successful queueing based on the enum name alone. The actual admission, buffering and interrupt execution occur in the executor outside this inspected call path. [R18, R28]

## Completion, status and cancellation observations

The host-focused investigation owns end-to-end lifecycle details. This bundle supplies supporting boundaries:

- `BackgroundTaskCompletionActionHandler` first records every supplied completion, then may skip follow-up generation because follow-ups are disabled, all entries are `recordOnly`, or progress notifications are filtered. For accepted entries it creates simulated user messages with reason `BACKGROUND_TASK_COMPLETION`, appends them to the parent prompt, builds a completion turn, and can run the parent turn loop. This is executable completion-to-wakeup plumbing, not merely prompt wording. [R20–R21]
- Run-state tracking indexes by parent tool-call ID; progress and worker-message events do not count as terminal run completions in `GSe`. `YSe` maps success/error/aborted statuses and ignores an older timestamp when an existing status is terminal. Child ID can resolve through a stored cloud-agent ID alias. [R22–R23]
- The local server execution branch has an in-memory cancellation registry keyed by subagent ID with tool-call aliases. It supports cancel, cleanup, cancel-all with exclusions, and cancellation of an older registration on replacement. Child execution uses a detached cancellable context and optional timeout. Completion persists conversation state; a SubagentStop hook can return a follow-up and cause another run loop before final cleanup. Do not project these mechanics onto the client branch's external executor. [R24–R27]
- Separate notification prompt policies distinguish successful completion, errors, deliberate stops, user-driven child turns, worker messages, reparenting and needs-attention. A stopped worker should not be restarted unless the user asks; needs-attention means paused for user input, not finished. These are model instructions and do not independently prove host behavior. [R29]

## Confidence and remaining unknowns

**High confidence** in the static contracts, branching, IDs passed across the interface, and completion-handler construction above. **Moderate confidence** that these are the active feature paths for a particular installation until flags and host call sites are corroborated. No app execution was observed.

Still outside this scope: slash-command recognition and UI button handler; whether the user's actual rollout enables each branch; downstream client fork snapshot details; host process topology; scheduling/concurrency/resource limits; message queue ordering/deduplication; durable task storage schema; worktree isolation for the active local route; automatic notification delivery timing across windows/restarts; and end-to-end cancellation races. A dedicated host analysis can answer some of these. A UI label, function name, or prompt sentence alone does not settle them.

## Exact source anchors

Byte ranges are zero-based, end-exclusive UTF-8 ranges. Line numbers are one-based; the minified source has very long lines, so byte offsets are the useful locator.

| Evidence | Source line | UTF-8 byte range | Subject |
|---|---:|---:|---|
| R01 | 8 | 2249285–2250215 | Start Multitasking injected reminder |
| R02 | 8 | 2250215–2252413 | Build in Parallel prompt policy |
| R03 | 8 | 3496822–3499464 | Multitask core delegation policy |
| R04 | 8 | 3500424–3504534 | Selective parallelism and one worker policy |
| R05 | 8 | 3508050–3509364 | Persistent and exit reminders |
| R06 | 8 | 3584134–3585071 | Mode transition reminder dispatch |
| R07 | 8 | 4069403–4070185 | Self-fork and resume state selection |
| R08 | 8 | 4070185–4072635 | Resume type identity and model retention |
| R09 | 8 | 4079135–4080088 | Task and request IDs plus resolved metadata |
| R10 | 8 | 4080088–4080580 | Self-fork window defaults to all |
| R11 | 8 | 4053233–4053923 | Fork window validation and state slice |
| R12 | 8 | 4103541–4103762 | Self-fork validation |
| R13 | 8 | 4107855–4108949 | Resume and interrupt tool schema |
| R14 | 8 | 4113521–4114536 | Background tool schema |
| R15 | 8 | 4125843–4126873 | Feature gates for async capabilities |
| R16 | 8 | 4130303–4130453 | Default background argument |
| R17 | 8 | 4138053–4139633 | Steer-driven background handoff |
| R18 | 8 | 4139633–4141855 | Client executor result handling |
| R19 | 8 | 4093931–4096822 | Background and foreground result rendering |
| R20 | 8 | 3963761–3964987 | Completion ingestion and filtering |
| R21 | 8 | 3967397–3969187 | Completion simulated turn and wakeup |
| R22 | 8 | 3607941–3609531 | Completion status persistence |
| R23 | 8 | 3662727–3663623 | Subagent identity lookup and resume modes |
| R24 | 8 | 4055133–4056973 | Cancellation registry |
| R25 | 8 | 4143535–4145315 | Server execution detached context timeout |
| R26 | 8 | 4057043–4060313 | Server execution completion and hook continuation |
| R27 | 8 | 4060313–4061420 | Server completion registry cleanup |
| R28 | 8 | 1378714–1378987 | Running-followup diagnostic strings |
| R29 | 8 | 3952087–3957217 | Notification categories and intentional stop policy |
| R30 | 8 | 4796132–4796982 | Feature flag plumbing to Task configuration |
| R31 | 8 | 4086235–4086311 | Self sentinel constant |
| R32 | 8 | 4118051–4119106 | Fresh versus resume Task description |
| R33 | 8 | 4121186–4121886 | Ordinary child context declaration |
