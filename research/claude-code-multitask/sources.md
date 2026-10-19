# Sources and evidence boundary

Checked **October 19, 2026**. These are official documentation and local command-help observations, not reverse-engineered Claude internals. No model call, login, live session inspection, or workload execution was performed. Templates and operating rules are proposed design.

| Official source | Used for |
|---|---|
| [Subagents](https://code.claude.com/docs/en/sub-agents) | Child execution, context, definitions, follow-up |
| [Skills](https://code.claude.com/docs/en/skills) | Project skill layout and invocation |
| [CLI reference](https://code.claude.com/docs/en/cli-reference) | Command interfaces |
| [Programmatic usage](https://code.claude.com/docs/en/headless) | Structured results and process lifecycle |
| [Agent view](https://code.claude.com/docs/en/agent-view) | Independent managed sessions |
| [Worktrees](https://code.claude.com/docs/en/worktrees) | Checkout selection and isolation |
| [Agent teams](https://code.claude.com/docs/en/agent-teams) | Optional experimental alternative |

The [selected local help capture](evidence/local-cli-help.txt) comes from Claude Code **2.1.303**. Only version/help commands were executed. Personal executable paths are omitted; selections preserve help wording, with explicit source line labels. The larger original capture is retained locally.

The CLI reference documents some flags omitted from local help. Conversely, local interface wording is not a live test of combinations. Notably, the inspected permission choices include `manual`, while online documentation also describes `default`. No example depends on resolving that discrepancy.

The [work disclosure stream-contract ledger](evidence/work-disclosure-stream-contracts.md) records additional official streaming, result, permission, and thinking contracts used by the [collapsed work UI implementation spec](working-disclosure-implementation-spec.md). It separates published SDK protocol declarations from compatibility with the installed CLI and marks final-answer classification and timing fallbacks as application policies.

The [Cursor report](../cursor-multitask/README.md) supplies the pattern being adapted, not evidence of Claude behavior. Cursor-specific tool arguments are not used as Claude APIs. Runtime completion timing, concurrency, cancellation, recovery, and template effectiveness remain unverified. No third-party source code is distributed in this Claude adaptation.
