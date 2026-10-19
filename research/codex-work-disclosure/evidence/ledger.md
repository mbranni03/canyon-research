# Evidence ledger

Inspected October 19, 2026. Target: `/Applications/ChatGPT.app`, `com.openai.codex`, version 26.1013.40934, build 20770. Its ASAR SHA-256 is `5ddc4e48259aa6f979e04529b1a5a4ae54b0f5c4ad6db5c6e004924c10916ddb`. This is a static reconstruction; the application, its conversations, and network were not executed or inspected at runtime.

## Evidence navigation

- [Artifact manifest](artifact-manifest.json): nine exact archived source identities, offsets, sizes, SHA-256 and declared ASAR integrity metadata.
- [Exact excerpts](source-excerpts.md): S1–S22 below, with source-relative and absolute ASAR byte ranges.
- [Machine-readable excerpt ranges](excerpt-ranges.json): excerpt hashes and zero-based, end-exclusive byte locations.
- [REA summary receipts](rea-receipts.json): full retained summary responses and coverage.
- [REA module view](rea-module-view.json): one exact export-binding observation from the disclosure source. This view establishes a static binding, not the entire behavioral account.

The behavior claims below are analyst interpretations of the literal code in the exact excerpts. REA supplies source identity, inert syntax analysis, and bounded selected-file receipts; its graph is not a runtime trace and is not itself a proof of every interpretation.

## Finding ledger

| Finding | Evidence | Assessment |
|---|---|---|
| Intermediate activity is partitioned from the final assistant item. Initial user messages are separate; commentary, reasoning, renderable tools, and some later user messages become activity. Blocking patch/exec approval, unfinished userInput, elicitation, and permission requests have separate outputs. | S5, S12 | High confidence static interpretation. Exact source types do not guarantee identical rendering across routes. |
| Ordinary collapse eligibility requires final assistant started, noncancelled turn, and renderable activity. A caller can explicitly allow earlier collapse. Eligibility defaults to collapsed unless auto-collapse is prevented; an explicit supplied/local choice overrides that default. Forced expansion or disabled collapse wins. The activity context supplies early-collapse permission and prevents automatic collapse while running. | S3, S12, S17, S18 | High confidence. `persistedCollapsed` is a prop name, not proof of disk persistence. |
| The component has a React state fallback; external collapsed state and setter can be supplied. Toggle flips expansion and does not change execution status. | S3, S4 | High confidence for mounted state. Durable/reload persistence remains unknown. A bounded string scan of all ASAR `webview/assets/*.js` found `onSetCollapsed` only in local-conversation-turn and sites-end-resource. |
| The main prompt stays outside. Some later user messages can fold when a final answer follows. Pending steering, not-sent messages, hook feedback, and messages without a following final remain persistent. | S2, S5 | High confidence static partition. Do not promise that every user message is always outside. |
| Qualifying final-answer assistant items, incomplete user-input-response items, selected dynamic-tool renderers, one specific MCP approval-policy error, and optionally MCP app widgets remain persistent when activity is collapsed. Leading realtime transcripts appear before the toggle; later transcripts remain persistent. | S2, S8, S14, S15 | High confidence with listed conditions. Dynamic renderer and MCP widget selection are conditional. No universal error-persistence rule was established. |
| No disclosure appears for empty activity, no collapsible count, disabled collapse, or a sole standalone context-compaction item. Group count sums underlying group items, standalone items count once, and separate inline-subagent content adds one. | S3 | High confidence. Count is an activity-item count, despite the fallback word “messages.” |
| Only the `all` commentary mode mounts this turn-level disclosure. `latest` mode filters completed tool groups and keeps a latest commentary/current activity presentation via separate filtering. | S5, S12, S13 | High confidence. Account/route default not established. Do not promise a universal live preview inside every collapsed body. |
| Structured labels are Working below 1,000 ms, Working for duration from 1,000 ms, Worked for duration, You stopped after duration, Paused, Activity for unknown, and a skeleton with “Loading activity status” screen-reader text for loading. | S1, S6 | High confidence. There is no catch-all unknown-status label in the switch. |
| Clock is max((completedAtMs ?? local clock) - startedAtMs, 0); only working items without completedAtMs poll every second. Status item takes precedence over a legacy duration; otherwise a previous-message-count label is used. | S1, S6 | High confidence. No duration is needed for Paused, Activity or loading labels, though the hook still computes an internal value. |
| Duration floors milliseconds to whole seconds and formats locale-sensitive narrow day/hour/minute/second units, omitting zero-valued units. A subsecond completed duration formats as localized zero seconds. | S7, S20–S22 | High confidence. Literal English unit spacing depends on Intl locale behavior. S20 and S22 are separated slices within the same import declaration: imported `Rp` is local `Wfe`; S21 identifies the original export `qJu as Rp`. |
| In the ordinary normalized-turn path, work start is turnStartedAtMs ?? firstTurnWorkItemStartedAtMs. No item is generated without actual pre-final work or a start timestamp; sleep-containing turns and completed turns lacking first-work metadata suppress the start. Endpoint is finalAssistantStartedAtMs. | S9–S11 | High confidence for this specific normalization path, not every structured activity source. Thus this duration measures pre-final work and can freeze while the final answer is streaming. |
| Normalized cancelled turns create an unknown Activity item rather than a success label. A client-interrupted legacy path synthesizes stopped using the supplied duration, with zero start and duration as endpoint. Cancellation blocks ordinary final-start eligibility, but early-collapse permission and structured/terminal routes can alter the result. | S9, S12, S16 | High confidence. Do not equate all cancellations with the stopped label or guaranteed expansion. |
| Disclosure has aria-expanded, a rotating chevron, and a divider. Its lazily rendered/preloaded collapsed body is inert; reduced motion removes vertical translation and height tweening. Collapse/exit uses 150 ms; reduced-motion expansion also uses 150 ms. Normal expansion uses an imported shared transition whose value was not traced. | S1, S4 | High confidence for explicit properties. Keyboard behavior inherited from the shared Button, screen-reader announcements, and exact rendered animation were not runtime-tested. |
| Denied-action count is historical, remains after retry approval, and appears alongside the disclosure. Clicking it can expand activity and scroll to the first denied element after expansion, using instant scroll for reduced motion and smooth otherwise. | S1, S4, S19 | High confidence literal logic. Runtime positioning untested. |

## REA identities and coverage

Analysis A parent: `ev_62398adff842a7648a36319963afa20d56684bb5665b69ccb15af6236fe7f59c`; summary receipt: `ev_70e14c640e8a65b30975a0e5c3412519b10d2df3bb05ebd0e905d0f644cf71a3`.

Selected exact archived sources: `webview/assets/collapsed-turn-disclosure-5ab38617e1bb.js` and `webview/assets/local-conversation-turn-918111aed944.js`. REA read 95,535 text bytes, parsed two JavaScript files with zero parse failures, and visited 31,354 AST nodes. It left 16,321 inventoried files outside source analysis. Application/semantic coverage are partial; no truncation was reported.

Analysis B parent: `ev_40991b53763083507e50c162cae7858eadf9070f7ccc69db367319f3609efddd`; summary receipt: `ev_9f5cdff75a67c6343a292e21962ecea7e98f7f3c6efa468cbd161fbfb4f906e0`.

Selected exact archived sources: `webview/assets/sites-end-resource-8a7a3656de67.js` and `webview/assets/split-items-into-render-groups-cc782c6c04ea.js`. REA read 424,605 text bytes, parsed two JavaScript files with zero parse failures, and visited 132,722 AST nodes. It left 16,321 inventoried files outside source analysis. Application and semantic coverage are partial. Application coverage reports no truncation; semantic coverage reports truncation at the 10,000 per-file and 20,000 total node ceilings. The nine-file manual excerpt inspection is broader than these four REA-analyzed files and is explicitly represented by the separate manifest and byte provenance.

Selected module view: `ev_7a79e49a05accbcfb3bf304773c0e5628858a8ff890eda2b9eeabd009c33b296`, node `jag_node_1ccfe024356c062d5037f61d2078b2ab1d883e85fcd88177dd3c4918fac147cd`, an export-binding observation for `n` in the disclosure source. One source path has multiple graph roles; a path-only view was rejected as ambiguous before the explicit node was selected.

The initial strict-integrity analysis was rejected because unpacked native companion binaries contradict declared ASAR integrity. Both successful analyses used `record-and-continue`, and their complete summary receipts name seven such native companion files. **All nine archived JavaScript sources in this investigation match their declared integrity hashes.** The mismatched native files were neither executed nor used for the feature conclusions. Integrity mismatches remain explicit limitations rather than being treated as verification of those binaries.

## Checklist and residual unknowns

Answered statically: activity partition, ordinary collapse lifecycle and overrides, content exceptions, mode distinction, labels, clock cadence, duration rounding, ordinary timing provenance, interrupted fallback, denied-action badge, explicit accessibility and reduced-motion code.

Partially answered: external state ownership and reload persistence; exact behavior in other conversation routes; shared normal-expansion timing; generic tool-error treatment. Unresolved: actual account rollout, runtime appearance, screen-reader behavior and pixel-level scroll/animation outcomes. No runtime observation is claimed. No native analysis session was opened, so no native close operation is required.
