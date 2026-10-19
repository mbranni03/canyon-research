# Canyon Research

A collection of software investigations grounded in shipped artifacts and published documentation. Each investigation records its evidence, methods and limitations so future research can build on a clear starting point.

## Current investigation: Cursor multitask

[How Cursor multitask works](research/cursor-multitask/README.md) examines `/multitask`, background subagents and parent completion handling in **Cursor 3.25.9 stable**, built October 15, 2026. Research date: **October 19, 2026**.

The investigation combines static inspection of shipped JavaScript with official documentation. It explains the coordinator policy, self-fork handoff, asynchronous execution and completion queue. No live agent run, private conversation, credential inspection or network capture was performed; runtime guarantees remain explicitly unverified.

- [Report and architecture diagram](research/cursor-multitask/README.md)
- [Finding ledger](research/cursor-multitask/findings.md)
- [Evidence and artifact identity](research/cursor-multitask/evidence/artifact-map.md)
- [Methods, evidence boundaries and public redaction](research/cursor-multitask/methodology.md)
- [Verification record](research/cursor-multitask/verification.md)
- [Official sources](research/cursor-multitask/official-sources.md)

This repository includes 76 focused source excerpts and small REA receipts. The complete application-graph export is retained locally and omitted from publication. Public evidence checksums identify the files distributed here; original REA Evidence IDs identify the original records, not modified public receipt bytes.

## Claude Code adaptation

[A Cursor-style multitask workflow for Claude Code](research/claude-code-multitask/README.md) turns the research into a proposed native-first CLI workflow: one interactive coordinator, background subagents, and reusable instruction templates. The [implementation plan](research/claude-code-multitask/implementation-plan.md) covers adoption, isolation, integration checks, and when a custom supervisor might be warranted.

This is documentation and untested example configuration, supported by official Claude documentation and local **Claude Code 2.1.303** help. No configuration was installed and no Claude workload was run. It is separate from the Cursor reverse-engineering evidence.

The [native task UI specification](research/claude-code-multitask/native-task-ui-spec.md) describes per-query progress cards in a custom app using Claude CLI's native tasks and JSON stream, including early list creation, confirmed updates, persistence, and interruption handling without MCP.

The [context usage tracking specification](research/claude-code-multitask/context-usage-tracking-spec.md) covers a context meter backed by native SDK summaries, a raw CLI fallback, refresh and compaction handling, and acceptance tests.

The [collapsed work UI implementation specification](research/claude-code-multitask/working-disclosure-implementation-spec.md) adapts Codex’s Working / Worked for… disclosure to Claude Code’s JSON stream, including incremental text, tool grouping, final-answer reconciliation, timing, interruption, and acceptance tests.

## Codex conversation work disclosure

The [Working / Worked for… behavior specification](research/codex-work-disclosure/working-disclosure-spec.md) describes how Codex folds intermediate conversation activity into an expandable work section while keeping the answer readable. It records grouping, status labels, duration, disclosure state, exceptions, and acceptance scenarios, with packaged-source evidence and explicit limits.

## Provenance

This is independent research and is not affiliated with or endorsed by Cursor, Anthropic, or OpenAI. Third-party excerpts are included for analysis and retain their original ownership. This repository grants no rights to third-party source excerpts or artifacts. No source-code license grant is provided.
