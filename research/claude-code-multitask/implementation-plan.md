# Implementation and adoption plan

The first deliverable is a reusable coordination policy using Claude's existing execution machinery. The examples below are proposed, untested instructions. They do not install a plugin, start agents, change permissions, or implement a supervisor.

## 1. Establish the target and baseline

Choose a repository, an integration checkout, and an exact intended starting commit. Record its current branch, dirty files, existing Claude instructions, and relevant checks. Start with two independent, small tasks whose acceptance criteria are easy to inspect. Use at most two concurrent workers for the first trial; that is a proposed operating limit, not a Claude limit.

Inspect `claude --version` and `claude --help` locally. This research checked **2.1.303**. Decide who may commit, merge, or publish before dispatch; the proposed default is to leave publication to the coordinator after review. Preserve existing permission policy.

## 2. Review and adopt the optional templates

Compare [the skill](examples/.claude/skills/multitask/SKILL.md) and [worker](examples/.claude/agents/task-worker.md) with existing target-repository configuration. Copy only approved content into the corresponding `.claude` paths there; merge collisions deliberately instead of overwriting existing files. Nothing under this investigation's `examples/` is active installation.

Project skills use `.claude/skills/<name>/SKILL.md`. `disable-model-invocation: true` reserves invocation for the user. Omit `context: fork` so this coordinator policy stays in the main conversation. [Skills](https://code.claude.com/docs/en/skills)

The worker definition uses documented `background: true` and `isolation: worktree`. It omits model, tool, and permission overrides. A read-only investigation can use an ordinary background subagent without this change-oriented template. [Subagents](https://code.claude.com/docs/en/sub-agents)

Test changed templates in a fresh session. Local help describes system-prompt snapshots that may preserve old system text across resumes until compaction; editing a prompt file is not evidence that a resumed session loaded the change. Reissue revised coordination policy explicitly when continuing existing work. [Local help evidence](evidence/local-cli-help.txt)

## 3. Give the coordinator a concrete handoff

Start the interactive CLI in the target checkout:

```sh
claude
```

After adopting the skill, enter this in that conversation:

```text
/multitask Investigate the parser timeout. Delegate one bounded task,
keep integration ownership here, and report the evidence and targeted checks.
```

`/multitask` here is the proposed custom skill, not a built-in Claude mode. Its text requests native delegation; it cannot guarantee that a particular tool is called.

For every dispatch, prepare a short packet: task ID, outcome, relevant context, allowed files, starting commit, acceptance checks, and result format. State whether mutation is allowed. Assign one worker the investigation, implementation, and targeted verification when those form one coherent outcome. Extra agents are justified by independent work, not by dividing every development phase.

Fresh tasks receive a complete summary. For work whose existing dialogue matters, the user can invoke the documented `/subtask` handoff. Ordinary explicit subagents start with fresh context; inherited-history behavior depends on the selected route and configuration. Completed custom workers can receive follow-up through `SendMessage`; Explore and Plan are one-shot. [Subagents](https://code.claude.com/docs/en/sub-agents)

The proposed handoff guard is: “This assignment completes delegation. Continue the assigned task; do not delegate again merely because inherited instructions describe the coordinator.” Treat that as prompt policy, not guaranteed recursion prevention. Keep a small task ledger in the conversation and refresh it when requirements change.

## 4. Verify isolation before edits

Require each worker to report its checkout and actual `HEAD` before mutation. Compare that identity with the assignment. Worktree defaults may start from the remote default branch rather than the current feature branch. `worktree.baseRef: head` uses committed local HEAD; neither it nor a conversation fork copies dirty changes. An exact arbitrary base requires explicitly creating a Git worktree at that commit. [Worktrees](https://code.claude.com/docs/en/worktrees)

If a worker reports the wrong base, pause that assignment and correct the checkout before proceeding. If the desired baseline includes uncommitted work, explicitly decide how to preserve and transfer it; do not let the worker assume it already exists. If reliable isolation is unavailable, serialize mutating tasks. Worktrees also do not separate shared external databases, ports, or services: assign those resources explicitly when relevant.

Ask workers to return: task ID; outcome; concise findings; changed files/artifacts; branch/worktree; checks and results; unresolved issues; decisions needed. This is a requested report contract, not a native event schema. Require exact evidence for success. Integrate completed changes serially, inspect the combined diff, and run the checks that exercise interactions between tasks.

## 5. Keep the three CLI workflows distinct

The interactive recipe above is the recommended coordinator/child workflow. An independent whole-session job instead uses:

```sh
claude --bg "Inspect parser timeout handling. Report findings; do not commit or push."
claude agents --json --all
```

Record the returned ID, then supply it explicitly to management commands:

```sh
claude attach "$BACKGROUND_ID"
claude stop "$BACKGROUND_ID"
```

These are alternative lifecycle actions, not a script to run consecutively. Set `BACKGROUND_ID` to the observed ID first. Managed sessions have separate status and isolation behavior, and may encounter workspace trust checks. Do not presume an independent session is a child that will notify the interactive coordinator. [Agent view](https://code.claude.com/docs/en/agent-view)

The inventory's `done` state describes the session lifecycle; validate its report and artifacts before declaring the user's task successful.

A separate automation host can use print mode for a bounded request:

```sh
claude -p \
  --output-format json \
  --json-schema '{"type":"object","properties":{"summary":{"type":"string"}},"required":["summary"]}' \
  --permission-mode plan \
  --permission-prompts none \
  --max-budget-usd 1 \
  "Inspect parser timeout handling. Return a summary; do not change files."
```

This inspection example uses plan mode. `--permission-prompts none` denies would-prompt operations; it does not broaden permissions. The $1 budget is an example, not an aggregate cap across independent processes; estimated cost limits may overshoot. `--bg` and `-p` cannot be combined. `--max-turns` is documented but absent from the inspected help, so it is omitted from this locally corroborated recipe. [CLI reference](https://code.claude.com/docs/en/cli-reference)

For a subsequent print turn, use `--resume "$SESSION_ID"` with the actual full session ID from structured output. Never use ambiguous “latest session” selection for concurrent jobs, and never resume a session another process owns. A new independent context branch can add `--fork-session`; do not confuse that identity change with file isolation.

Parse the final result envelope and validate the requested payload separately. Print processes may remain alive for background work after stdin closes; EOF is not task completion. Stream-json can expose progress, but it does not remove lifecycle accounting. [Programmatic guide](https://code.claude.com/docs/en/headless)

Do not add `--bare` to a coordinator that expects background subagents: current documented releases disable background tasks in that mode. [Programmatic guide](https://code.claude.com/docs/en/headless)

## 6. Evaluate before relying on it

Run a read-only background assignment and immediately add a second request to the coordinator. Observe whether results return without manual polling. Test inherited-context handoff with a harmless marker. Then run disjoint changes, verify each starting commit, integrate both, and exercise the combined result.

Test follow-up, an explicit user cancellation, and a permission denial. Cancellation must not become an automatic retry. Finally, close and reopen a session and record what actually survives. Mark crash recovery unverified until separately exercised. Do not infer success from a launch message, clean process exit, or worker assertion alone.

Agent teams are experimental and interactive-only; they add a different coordination arrangement and are unnecessary for this trial. Ordinary peer messaging already exists. [Agent teams](https://code.claude.com/docs/en/agent-teams)

## Conditional extension: an external CLI supervisor

Build this only if an application needs its own durable queue, user interface, or cross-session recovery. Everything here is proposed application behavior, not Claude internals. Begin with one process, SQLite, and a small CLI adapter; keep native delegation as the default outside this host.

The host must exclusively own its coordinator session, including idle periods. Serialize user input and completion turns through one queue. Never inject a resume into an unrelated running interactive session. Track tasks, attempts, session IDs, checkout identity, cancellation intent, and completion events before subprocess launch. Use argv arrays and stdin, not shell interpolation.

For host-managed jobs, route every launch through this ledger. Do not let native delegation or an independent `--bg` launch silently create work outside the host's accounting; either register such work explicitly or keep it outside this supervisor design.

Use independent print-mode workers with validated final reports. Distinguish process exit, protocol completion, and task success. Commit each terminal attempt and pending notification atomically. Batch notifications only when the parent is idle and no human decision is pending. Acknowledge delivery after a valid completed parent turn. Assign stable event IDs and deduplicate bookkeeping; crash recovery can deliver events more than once, so promise no exactly-once model actions.

After interruption, reconcile process/session ownership and mark uncertain mutating attempts for review. Do not automatically replay them. Permission denials become `needs_attention`; do not relaunch with broader permissions. Record cancellation before stopping owned processes, preserve unmerged work, and require an explicit user restart. Separate stopping one task from stopping the whole run.

Before implementation is accepted, fake-CLI tests must cover simultaneous completion, parent-busy delivery, malformed output, crashes around acknowledgement, permission denial, cancellation, and attempted same-session overlap. Validate real CLI event fields in a separately authorized smoke test before depending on them. A stdout parser alone is not an approval interface, and this documentation does not build one.
