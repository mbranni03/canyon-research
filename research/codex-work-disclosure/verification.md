# Static specification verification

**Result:** pass, October 19, 2026. Target confirmed by the user: `/Applications/ChatGPT.app`, bundle `com.openai.codex`, version 26.1013.40934, build 20770.

An independent verification pass checked the [specification](working-disclosure-spec.md) against the [evidence ledger](evidence/ledger.md) and source excerpts S1–S22.

- Installed ASAR SHA-256 and bundle identity match the manifest.
- All nine selected JavaScript module hashes match archived bytes and their declared integrity.
- All 22 excerpt byte ranges and hashes match the original archive.
- Grouping, collapse overrides, status labels, final-answer qualification, duration boundaries, and acceptance scenarios agree with the retained source.
- Evidence JSON parses, relative Markdown links resolve, and `git diff --check` passes.
- The published research contains focused packaged-source excerpts and receipts; no private conversation, credential, or user-profile content was included.

Review corrections included precise `unknown` status handling, acceptance of empty completed final answers, helper/import provenance, and explicit semantic-graph truncation limits for REA analysis B. Seven unrelated unpacked native integrity mismatches remain recorded limitations; they do not apply to the nine verified archived JavaScript sources.

This verifies a static behavior specification. No application workload or UI scenario was run. Account rollout, actual screen-reader behavior, scrolling/animation results, and reload persistence remain unverified. Proposed reconstruction requirements are not claims about tested Codex behavior.
