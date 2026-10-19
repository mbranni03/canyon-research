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

## Provenance

This is independent research and is not affiliated with or endorsed by Cursor. Third-party excerpts are included for analysis and retain their original ownership. This repository grants no rights to third-party source excerpts or artifacts. No source-code license grant is provided.
