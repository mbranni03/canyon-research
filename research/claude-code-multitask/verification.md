# Static documentation verification

**Verdict: PASS with runtime caveats.** Verified October 19, 2026. Scope: this Claude adaptation, its two example templates, selected help evidence, and the repository README links. This is not a test of a running Claude workload.

## Checks executed

- Compared the native capability claims with the prepared official-documentation notes and the captured **Claude Code 2.1.303** help. Confirmed the distinction between documented interfaces, proposed coordination policy, Cursor-derived lessons, and unverified runtime behavior. Did not fetch external pages again.
- Compared all **16 labeled help selections** byte-for-byte as text with their corresponding original capture lines. All matched. Reviewed CLI flags and subcommands against that capture and the official notes; commands are examples, not claims of tested combinations.
- Checked all **six shell command examples** with shell syntax-only parsing; parsed the example JSON schema. No command was executed. Print/background modes remain separate, the plan warns against `--bare` for background-subagent coordination, and the read-only print recipe uses an advertised permission mode.
- Reviewed the concurrency and recovery design: exclusive parent-session ownership, serial input/completion turns, host launch accounting, no automatic replay of uncertain mutation, and explicit cancellation. Process exit, final protocol results, managed-session status, and task success are distinguished. The proposed supervisor is not presented as existing Claude machinery.
- Checked worktree-base and dirty-change caveats, fresh versus inherited context, custom `/multitask` versus built-in handoff, and independent background-session semantics. Integration and combined verification remain the coordinator's responsibility.
- Checked both frontmatter blocks against the supported fields recorded in the official notes. The skill has explicit user invocation and no fork context; the worker has background/worktree settings without permission or model overrides. Templates remain beneath `examples/`; no root `.claude` installation exists in the publication tree.
- Resolved **19 relative Markdown link occurrences** across the adaptation and root README before adding this report. Every target exists inside the repository. Scanned those public files for personal home paths, the local account identifier, private-key headers and common credential signatures; none were found.

Initial review requested explicit `--bare`, managed-session `done`, and host launch-accounting caveats. The plan was corrected and those passages rechecked; no failing checks remain. This verifier added only this report.

## Limits

No model calls, installs, configuration changes, Git operations, agent launches or live-runtime validation were performed. The shell check only parsed example syntax. Completion delivery, context inheritance, permission behavior, isolation effectiveness, cancellation, crash recovery and template effectiveness remain untested. The plan's disposable-repository trials and any future supervisor tests are acceptance work to perform later, not completed tests. External documentation freshness and links were not independently revalidated in this pass. The existing Cursor evidence was outside this bounded review.
