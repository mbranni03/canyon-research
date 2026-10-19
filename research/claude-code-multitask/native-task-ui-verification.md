# Native task UI specification verification

**Verdict: PASS with runtime caveats.** Verified October 19, 2026. Scope: the [native task UI specification](native-task-ui-spec.md) and its links from the repository and adaptation READMEs. This verifies a proposed document, not an implemented integration.

## Checks executed

- Resolved all **20 relative Markdown link occurrences** in the specification, both READMEs, and this report against repository files; all targets exist.
- Parsed the four illustrative NDJSON records as JSON. There are no shell command fences in these documents; shell syntax validation with `bash -n` is not applicable. The TypeScript snippets are design examples, not compiled implementation.
- Reviewed create/update correlation and output rules against the authoritative documentation findings supplied for this review: root assistant tool IDs pair with user tool-result IDs; creation uses the assigned output ID; updates require both a successful tool envelope and `success: true` with a matching task ID. Status confirmation, deletion, label changes, uncertain results, partial events, and replay handling are explicit.
- Reviewed per-query task-list isolation, interrupted-query reuse, progressive initial rendering, stable resumed-session policy, persisted refresh recovery, and authoritative task-list reconciliation. The optional work-tool gate does not claim to guarantee a semantically complete plan or prevent a tool-free answer.
- Checked consistency with the adjacent adaptation's evidence boundary: this remains an untested native CLI design inspired by a screenshot, not a claim about Claude Desktop internals or a verified runtime workflow.
- Ran `git diff --check`; no whitespace errors were reported.

Review requested explicit task-list reconciliation rules and confirmed-field checks for label updates. Those requirements were added and rechecked, along with the main review's corrections to input aliases, required create descriptions, and the shared-storage subagent caveat. No failing checks remain. The verifier added only this report; the unrelated `crossing-the-canyon.html` was not changed.

## Limits

No model calls, CLI workload, configuration installation, live stream capture, UI execution, or Git mutation was performed by this verifier. External sources were not independently fetched again; contract review used the main investigation's documentation findings. Actual CLI event envelopes, task-list selection with `--resume`, hook behavior, subagent isolation, cancellation, and recovery remain acceptance trials listed in the specification. No software tests were added because this change supplies documentation only.
