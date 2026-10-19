# Methodology and evidence boundaries

Research date: 2026-10-19. Target: the installed `<CURSOR_APP_ROOT>`, Cursor 3.25.9 stable, build 2026-10-15. See [artifact identity and hashes](evidence/artifact-map.md).

## What was examined

The investigation combined dated official release notes, current official documentation, REA static analysis, and focused reading of shipped JavaScript. It did not launch Cursor, run an agent, inspect private chats or credentials, attach a debugger, or capture network traffic. Packaged prompts were treated as data, not instructions to the researcher.

REA analyzed these exact selected paths in the installed app directory:

```text
package.json
product.json
extensions/cursor-local-agent-runtime/dist/main.js
```

Parameters: `format=directory`, `detail=summary`, `max_heap_mb=1536`, `max_semantic_nodes=12000`, `max_semantic_nodes_per_file=12000`, `analysis_timeout_ms=60000`. The directory inventory covered 16,680 relevant files, with 16,677 outside selected source analysis. REA parsed one JavaScript file, visited 1,321,399 AST nodes and recorded zero parse failures. Application coverage is partial; semantic coverage is partial and truncated by the selected node ceilings. This is not a complete call graph.

## REA receipts

| Record | Evidence ID | Interpretation |
| --- | --- | --- |
| Parent application analysis | `ev_7a178f68882162cbe7980ae291376eaf629e3717502978849428ba32e05aac58` | Selected-source static analysis and full artifact inventory identity. |
| Summary view | `ev_f7e05afc11955c3deed6df5ef8eab071a7df746024744d61375d65f6190d8d09` | [Saved receipt](evidence/rea-summary.json), including limits and unknowns. |
| Module page | `ev_9311a6b83cb53567efdcf303d19605b629407d12634779a2c4ba2fe48e9827b2` | First eight inventory module identities; not a feature trace. |
| Literal outgoing trace | `ev_ffa2b03c7e4a6496a95d129e39834288f94490ce63deae8ed74e32adb5d9300a` | [Saved receipt](evidence/rea-trace.json): `Multitask Mode Guidelines` matched no retained graph entity. With partial graph coverage, this establishes neither absence nor unreachability. |

The exact source contains that prompt despite the graph's no-match result. The feature-specific conclusions therefore cite the independently extracted source excerpts, rather than attributing them to a successful REA trace. UI and host excerpts are supplemental static evidence, outside the REA source selection.

The REA inventory root digest is `5ed67663a5729ba003f610adec30805e0bb24b163a507d9a463f7fb0983f484b`. This is REA's directory artifact identity, not a hash of one executable. Individual bundle hashes are supplied separately.

The original complete REA export is retained locally and omitted from this public repository. It preserves four retained records (389,030,894 uncompressed bytes; roughly 62 MiB compressed), including a whole-application graph beyond this investigation’s focused scope. Its top-level unknown ledger reports zero entries, but the parent graph explicitly contains 16,677 application unknowns and 359,727 semantic unknowns. Zero top-level ledger entries must not be read as complete knowledge. The small public JSON receipts document scope and limits.

### Public evidence derivatives

`<CURSOR_APP_ROOT>` represents the application resource directory in the examined installation. Public files replace absolute application paths with this portable placeholder. The two REA JSON receipts are **public redacted derivatives**, with an added publication note. Their retained Evidence IDs and embedded record digests refer to original records; those digests cannot authenticate the modified public JSON bytes. Source-artifact hashes still identify the original installed files. Excerpt text, offsets and excerpt hashes are unchanged. [SHA256SUMS](evidence/SHA256SUMS) records the public evidence file hashes; run `shasum -a 256 -c SHA256SUMS` from the evidence directory to check them.

## Reading the findings

- **Observed static code:** a branch, field, call, schema or literal exists in the exact shipped bytes. Execution was not observed.
- **Prompt policy:** packaged instructions ask the model to behave a certain way. This is not equivalent to deterministic enforcement or guaranteed model compliance.
- **Inference:** an architectural explanation derived from nearby control flow and cross-layer agreement. Dynamic dispatch and feature gates can change the path used.
- **Official documentation:** a published product description, with dated release scope when available; mutable documentation may differ from this installed version.
- **Unknown:** runtime behavior, server behavior, account flags, actual model decisions and untested failure conditions remain open.

Source snippet offsets use zero-based UTF-8 byte ranges with exclusive ends and original source lines where supplied. The locator map also contains explicitly labeled character offsets; do not interchange the two. Reproduction requires the same file hashes, because Cursor updates can change offsets and minified identifiers.

## Reproduction

1. Check the installed version and the bundle SHA-256 values against the artifact map.
2. Read the exact byte ranges in the snippet JSON files; compare their text with the source bytes. They are excerpts, not executable reconstructed modules.
3. Repeat the REA call above only if you need a new analysis for the same or a changed target. Substitute the actual installed resource directory for `<CURSOR_APP_ROOT>`.
4. Read the public receipts for coverage and limitations. The original full export is retained locally and is not distributed here; reproducing its analysis requires the matching installed artifact and REA. Retain the original receipt IDs and limitations when making further claims.
5. To validate runtime guarantees, use a disposable repository and deliberately test mode entry, overlapping edits, child completion during a parent turn, user stop, interruption, and app restart. Those experiments were not performed in this research pass.
