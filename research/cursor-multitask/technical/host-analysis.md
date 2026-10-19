# Agent-host lifecycle: bounded static findings

Inspected `<CURSOR_APP_ROOT>/extensions/cursor-agent-host/dist/main.js` on 2026-10-19. No application execution or user-profile inspection. Source identity and bounded UTF-8 byte-addressed excerpts are in [`host-snippets.json`](../evidence/host-snippets.json). H01–H16 below are local excerpt IDs, not REA Evidence IDs. The file is minified; byte ranges are the useful locations, while line numbers are retained for reproducibility.

## Dispatch and local capacity

- **Observed code:** `tryAcquireLocalRunSlot()` uses an injected slot manager if present, otherwise a local fallback. Its limit is `gr(options.localSubagentLimits?.maxRunning, 32)`. Session options override host options when supplied. **32 is a configurable local fallback, not a universal Cursor or multitask concurrency limit.** Acquisition failure returns an error rather than establishing an unlimited queue. H01, H16; supporting failure branch at character 2206795.
- **Observed code:** `runInBackground` creates a detached, cancelable context, starts execution, registers the background promise, ensures a transcript path, and returns a `background` outcome with `AGENT_REQUEST`. The durable invocation is marked completed with that outcome: dispatch completion is therefore distinct from completion of the child's work. H02.
- **Observed code:** foreground execution races its execution promise against a force-background signal. On handoff, it detaches the foreground abort listener and registers the still-running promise, returning `USER_REQUEST`. It cancels any pending interaction that was bubbling to the parent. H02.

## Completion routing

- **Observed code:** `registerBackgroundRun` tracks a run ID and promise. For local runs it links parent/child IDs and adds running work to the background registry. Settlement finishes the lifecycle record. If this remains the current run and was not marked interrupted, completion goes first to the child collector; otherwise it enters `backgroundWorkRegistry.enqueue` with `reason: task_finished`. Work tracking is then cleared. Cloud runs skip this local notification branch; their completion route is outside this excerpt. H03.
- **Observed code:** `BackgroundTaskCompletionActionHandler` records subagent completion before deciding whether to run a follow-up. It can skip when follow-ups are disabled (except the meta-parent case), record without a turn when all events are `recordOnly`, and filter progress notifications when progress is disabled. An empty filtered batch is skipped. H04.
- **Observed code:** eligible notifications become simulated user messages with reason `BACKGROUND_TASK_COMPLETION`. The handler appends the messages, creates background-completion turns, and its normal `handle` path runs the turn loop. Thus a completion can restart parent model work; it is not merely a displayed status update. H05. This does not prove every completion produces a follow-up: H04 supplies explicit exceptions.

## Await behavior and limits

- **Observed code:** Await availability depends on configuration. With subagent awaiting disabled, passing a nonnumeric task ID throws a no-op error telling the model to finish its turn or do parallel work. Regex matching is rejected for subagent waits. The text is model guidance, while the throwing branches are enforcement. H06, H09.
- **Observed code:** default block duration is 30,000 ms. The schema cap is `min(perCallLimitMs ?? Kt, Kt)`, where `Kt = 714e4` = **7,140,000 ms (119 minutes)**. Runtime further clamps against `maxBlockUntilMs` if set. These are implementation ceilings/defaults, not a recommendation or proof of the active configuration. H06–H09.
- **Observed code:** the bounded path passes `agentId` and `timeoutMs` to a subagent-await resource. The legacy fallback resumes with an empty prompt, read-only mode, foreground execution, and a timeout (1 ms when the requested block is zero). A race with newly admitted user input cancels the wait context and reports `stillRunning`; it does not thereby declare the child canceled. H10.

## Parent completion, child collection, and cancellation

- **Observed code:** ending a foreground dispatch and canceling are separate paths. Detached background execution can remain tracked and later enqueue completion. This supports continuation after the initiating tool returns, not unlimited survival after all possible session teardown events. H02–H03.
- **Observed code:** a coordinator continuation configuration can collect background children after its own completed iteration. It waits while linked children remain, feeds returned child results into a resumed run, and repeats for at most 500 collection rounds. `maxLoops > 0` bounds each continuation run; otherwise that loop uses infinity. This is a conditional coordinator mechanism, not every parent's universal completion behavior. H14–H15.
- **Observed code:** `cancelAction` clears buffered messages/injections, calls `subagentCanceler.cancelAll`, and cancels the parent. It supplies exclusions derived from pending tool-call resolutions of type `taskResult`. The registry maps excluded tool IDs to child IDs, removes other children, and invokes their cancel callbacks. A separate `cancelSubagentAction` targets one child. **The implementation has exclusions; “cancel always kills every child” is too strong.** H11–H12.
- **Observed code:** local turn abort normally requests a conversation abort, with an **8-second hard-cancel backstop**; immediate abort cancels directly. Dispatch abort is also forwarded to this turn context until disposal. H13.

## Boundaries

Static findings establish code branches present in this artifact. They do not establish active feature flags, actual event ordering, backend behavior, real latency, or successful execution. Distinct implementations coexist (local agent-host execution, client-executed Task tools, other server-side paths); the observations above should not be flattened into one universal state machine. No comprehensive cancellation-race or process-restart analysis was performed. No product-wide concurrency cap was established.
