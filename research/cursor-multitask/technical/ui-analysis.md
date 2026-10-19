# Cursor Multitask: executable UI and completion flow

Static read-only inspection of the installed 3.25.9 `workbench.glass.main.js` bundle. No app execution, profile access, or runtime setting observation. All UIxx references identify exact source slices in `../evidence/ui-snippets.json`; those local IDs are **not** REA Evidence IDs. That file records source SHA-256, original lines, exact UTF-8 byte ranges, and individual slice hashes.

## Mode/slash command eligibility and mutation

**Observed code:** `composerPromptMode.js` recognizes plan/debug/chat and accepts multitask unless `multitaskEnabled === false`. `glass-mode-utils.js` builds its available mode list from those values. `mode-slash-commands.react.js` dynamically creates actions with id `glass-mode-${mode.id}`, name from the label, and a handler that selects `undefined` when the chosen mode is already selected. Therefore the absence of a literal `/multitask` string is expected: this surface generates a mode action from the `multitask` ID. (UI01, UI02)

The prompt creates no mode actions when `gt.modes` is false. It computes `modeOptions` through `gOn(gXv(header))`; this disables Multitask for a project root whose header is cloud or draft and has no subagent parent. `zat()` is the absent/empty-parent test. This is the examined eligibility condition, not a statement that every surface or account exposes the mode. (UI03, UI04, UI06, UI07, UI24, UI25)

`use-custom-mode-actions.react.js` resolves the selected built-in mode, toggles it against the existing selection, clears a competing active custom mode, and calls `setComposerUnifiedMode(handle, selectedMode ?? "agent")`. Drafts additionally update pending mode. An explicit override callback takes precedence over direct mutation. Pasting a mode uses `applyMode` directly; ordinary menu selection uses `applyModeSelection` and toggles. The parent callback records the Multitask slash analytics event before applying the selection. (UI05–UI07)

`setComposerUnifiedMode` writes `unifiedMode`. A separate conditional marks `pendingCreateWorktree=true` and `worktreeStartedReadOnly=false` when leaving an existing read-only/no-worktree state for an editable mode; this is **not** an unconditional Multitask worktree creation rule. (UI08)

**Inference:** selecting the Multitask slash action changes how the conversation's next turn is run; this handler does not itself spawn a worker or submit a user message. The separate Start Multitasking control below submits a new simulated action.

## Start Multitasking and queued messages

`startMultitasking.js` chooses `multitask` by default, but chooses `agent` when `isProject === true` and no parent composer exists. `j1w` submits the text `Start multitasking` with `simulatedMsgReason: MULTITASK`, `forceSubmit: true`, and the caller's submission context through `Kgv`. `mf0` snapshots `unifiedMode`, writes the chosen mode, submits, and restores the original mode if submission throws. (UI09, UI10, UI25)

Build in Parallel uses the same path with text `Build`, `BUILD_IN_PARALLEL`, and `isPlanExecution: true`. A lower-level variant calls `submitChatMaybeAbortCurrent` with `ignoreQueuing: true` and restores mode on error. These are distinct action reasons, not interchangeable labels. (UI09)

The queue-tray handler guards missing agent reference and a concurrent start flag; logs entrypoint `queue_tray`; records the first queued item's ID; sets a pending-start state when there is such an item; then invokes `j1w` with click/queue context. Failure clears that state and shows `Failed to start multitasking.` The queue observer clears it once the tracked item appears among conversation bubble IDs or disappears from the queue. The click handler does not directly remove that queued item. (UI11, UI12)

**Unknown:** these slices do not trace every downstream forced-submit queue drain, so they do not establish the exact order in which all queued prompts are consumed.

## Subagent executor: foreground/background boundary

`subagentExecutor.js` maintains session handles, active foreground executions, pending requests to background a tool call, per-agent run ordinals, interrupted-run keys, replay IDs, and a running-local-subagent count. Session creation delegates to the local subagent composer service or cloud runner; it can reuse a previous child found from the same tool-call ID and parent ID for idempotent replay. (UI13)

For a local `runInBackground` request, `runSession` acquires a local run slot, creates a **new AbortController**, starts `runSubagentWithHandle` or `runWithContinuation`, arranges slot release in `finally`, and immediately hands the resulting promise to `handoffToBackground`. That handoff registers the background promise, removes the temporary handle, and returns `status: "background"`, background reason, transcript path, and tool-call count zero. The count describes the handoff response; it is not the worker's final count. Cloud execution has an analogous handoff path. (UI13)

For foreground runs, the executor links cancellation to the parent signal and races actual completion against a request to background the run. When that request wins, it removes the parent's abort listener and hands off the still-running promise. `forceBackgroundByToolCallId` can act on an active foreground execution or retain a pending request for a tool call not yet registered. (UI13)

The local simultaneous-run cap comes from dynamic config `local_subagent_limits.maxRunning`; the fallback constant in this module is **32**. It is a resource ceiling for this executor instance, not a recommendation or evidence that Multitask launches 32 workers. Interruption of a resumed agent can bypass the cap. (UI13, UI26, UI27)

## Completion registration, parent routing, and follow-ups

`registerBackgroundPromise` starts a lifecycle run; optionally upserts a background work item belonging to the parent; stores promise/abort-controller state; and attaches settle handlers. A suppressed disposition drops completion, cancellation yields an aborted result, and a queued resume defers the completion instead of immediately publishing it. Waiters are resolved and lifecycle state is cleaned up on settlement. (UI14)

`_enqueueSubagentCompletion` requires long-running jobs to be enabled. It maps the result to success/error/aborted, resolves title/transcript path, marks the parent task bubble completed, builds a `task_finished` payload, and enqueues it. Parent destination priority is explicit metadata parent, existing work item's composer, child `subagentInfo.parentComposerId`, then child ID fallback. The payload retains task/subagent/tool-call IDs and final message or error. (UI14)

`enqueueOrMergeResumePrompt` queues follow-up work against the current run ID and merges prompts, context, and tool-call IDs if a resume already exists. It links the originating parent to the same subagent. This supports continued work on one child rather than requiring a fresh child for each message. (UI15)

## Parent wakeup dispatch and delivery guarantees

Completion enqueue and transition away from generating both trigger `_maybeDispatchBackgroundCompletions`. Glass checks that the composer's workspace ID matches the current workspace. It avoids concurrent dispatches for one composer and silences archived conversations. The examined dispatch branch requires `isNAL === true`; it waits while there is a live turn, a blocking user decision, or a questionnaire awaiting input. (UI20–UI23)

The dispatcher pulls completions and filters them by the long-running-jobs flag or interactive-child exception, and by task IDs currently awaited. Filtered-out entries are nacked with requeue. User-cancelled subagent wakeups have a separate drop path. It creates a `backgroundTaskCompletionAction` containing mapped task metadata and a corresponding thread ID where available. (UI16, UI17, UI20)

`_runWakeupAction` registers a new generation described as `Background agent wakeup`, obtains model details and a request context, and invokes the agent loop with empty user text and `conversationActionOverride` set to the completion action. It preserves the composer's current mode and conversation state, creates response bubbles through hooks, records checkpoints, and clears generation/in-flight state when settled. The completion-specific hook recognizes simulated `BACKGROUND_TASK_COMPLETION` messages and updates generating status. (UI18, UI19)

Only a wakeup returning `completed` causes `ack` of the delivered records. Skipped or failed dispatch requeues records, except archive/cancellation-specific suppression. Errors can add a `Resume` button that retries dispatch. This is a code-level retry/ack design, not proof of exactly-once delivery or process-crash persistence. (UI20)

## Evidence limits

- Static source shows intended branches and calls, not observed scheduling, latency, account feature availability, or actual server acceptance.
- `isNAL`, remote/local host routing, persisted background-work storage, slash parser input matching, and every queue-draining path were not fully traced here.
- The default cap and feature configuration may be overridden. No user configuration was read.
- This UI work does not independently prove filesystem sharing, forked prompt content, or all subagent tools; the runtime investigation supplies that evidence.
