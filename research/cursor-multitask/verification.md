# Research verification

## Original local verification (before publication)

The following verdict records verification of the original local research folder, including the full REA archive retained locally. It does not certify the modified public copy. The full archive is omitted from this repository.

**Verdict: pass with caveats.** The deliverables are internally consistent and their static evidence is reproducible against the installed Cursor 3.25.9 files. This verdict verifies the research artifact, not actual execution of Cursor's multitask feature. Verification date: 2026-10-19.

### Original checks executed

- Read the overview, finding ledger, methodology, official-source notes, artifact map and all three technical analyses. Checked the material implementation claims against the relevant source excerpts, including self-fork instructions and state selection, Task result handling, background dispatch, completion filtering, wakeup acknowledgements/retries, and cancellation exclusions.
- Parsed all five small evidence JSON files successfully. For all **76 excerpts** (33 runtime, 27 UI and 16 host), compared recorded UTF-8 byte ranges with the installed source, exact decoded text, excerpt SHA-256, source SHA-256, source size and one-based starting line. Every assertion passed.
- Checked sizes and SHA-256 hashes for all **eight files** listed in the artifact map. Checked the installed manifests' version, stable channel, build date, commit and realCommit against the report. Every comparison passed.
- Resolved all **43 local Markdown link occurrences** in the existing documents. All destinations existed. This count excludes this verification file and any links added afterward.
- Streamed the gzip archive through its end, validating decompression and its CRC/trailer. Its 389,030,894 decompressed bytes matched the existing uncompressed export byte-for-byte by SHA-256: `55265c6d9337d7a841c647dded9c9fc934498852b19266f108806e96c7c32d97`. No second expanded copy was written.
- Parsed the existing complete uncompressed REA export as JSON and confirmed four records and all four expected Evidence IDs listed in the methodology. Checked the small summary/trace receipts against the reported partial coverage, node ceilings, unknown counts and literal trace no-match.

No failed checks or required corrections were found. Only this verification report was added; the research files and installed application were not modified. No application tests were added because the deliverable is documentation and retained evidence rather than a product-code change.

### Deliberately untested boundaries

Cursor was not launched, user data was not inspected, and no live agent or network experiment was performed. Model compliance, rollout flags, concurrency under load, cancellation races, full queue ordering, cloud execution and restart durability remain unverified, as the research already states. Static prompt text was not treated as a deterministic execution guarantee; the architectural diagram was assessed as a synthesis of conditional routes.

External documentation was reviewed as cited research but was not independently fetched again in this verification pass. This avoids duplicating the original web research; mutable pages and external-link availability therefore remain a verification caveat. The no-match REA trace was correctly treated as inconclusive, and the report does not mistake the export's empty top-level unknown ledger for complete analysis.

## Public repository verification

**Verdict: pass with caveats.** Publication verification date: 2026-10-19. These checks apply to the public derivative and are separate from the original local verification above.

- Parsed all five public evidence JSON files and verified all six entries in `evidence/SHA256SUMS` against the distributed bytes.
- Compared all **76 source excerpts** (33 runtime, 27 UI and 16 host) with the original research copy: excerpt text, offsets, identifiers, source metadata within excerpt records and excerpt hashes are unchanged, except application-root path replacement. Recomputed all 76 excerpt hashes successfully.
- Resolved all **51 relative Markdown link occurrences** across the public documents. Every destination exists inside this repository.
- Scanned the publication files for personal home paths, the local account identifier, private-key headers and common credential formats. No personal paths or credentials were found. Credential-related source matches are field/method names in static excerpts, not account values. Reviewed the file inventory: only documentation, five small evidence JSON files, a checksum manifest and publication ignore rules are included; no raw application, private profile data or complete REA archive is distributed.
- Read the root README, methodology and both public receipt notes. They correctly identify the receipts as redacted derivatives, distinguish source-artifact/record identity from public file checksums, and disclose omission of the complete graph export.

No failed publication checks were found. Only this public verification section was updated during these checks. The public copy was checked against the already-verified original research; the installed app and original full archive were not re-examined. No live Cursor execution, network request or independent external-link recheck was performed. The original runtime and documentation-freshness caveats therefore remain.
