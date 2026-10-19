# Claude Code “Working / Worked for…” implementation spec

**Status:** proposed implementation; no application UI or stream reducer has been implemented or exercised. Checked October 19, 2026. The locally inspected CLI reported **2.1.303 (Claude Code)**. Public protocol references include SDK **0.3.301** declarations; that package version does not establish compatibility with the installed CLI. Pin and validate the deployed CLI before release.

This adapts the [Codex behavior spec](../codex-work-disclosure/working-disclosure-spec.md), using the [Claude stream contract and source ledger](evidence/work-disclosure-stream-contracts.md). Source IDs C1–C7 below refer to that ledger. CLI version/help checks were read-only; no model request or live integration trial was run. The [verification record](working-disclosure-verification.md) documents the completed static review.

## Goal and transfer boundary

Keep the request and answer easy to scan while preserving intermediate prose, tools, and returned reasoning in an expandable activity region. Folding changes presentation only; it never summarizes, deletes, compacts, or rewrites model context.

```text
User request
  › Working for 4s          [while the turn is running]
Newest root text candidate [visible immediately; not yet confirmed final]

User request
  › Worked for 4s           [after confirmed success, with activity]
Final answer               [authoritative result text, outside disclosure]
```

Expanded activity preserves order, tool details, nested child activity, and intermediate assistant updates. Pending app-owned approval/question controls, interruption/error notices, and the candidate/final answer remain accessible outside the folded body.

Transfer Codex’s disclosure interaction, labels, duration formatting, separate final answer, and separation of expansion from execution status. Deliberately change its automatic-collapse boundary: raw Claude messages have no documented Codex-style final-answer phase, so default collapse waits for a successful terminal result. Candidate text stays visible while the header remains `Working`; it may later move into activity. A `message_stop`, an `end_turn` stop reason, silence, or final-sounding prose cannot confirm the turn. [C3: streaming](https://code.claude.com/docs/en/agent-sdk/streaming-output), [C4: declarations](https://app.unpkg.com/@anthropic-ai/claude-agent-sdk@0.3.301/files/sdk.d.ts)

Do not reproduce Codex route modes, private renderer flags, compaction exceptions, or denied-action badges unless an existing host feature already supplies equivalent data. No automatic early candidate collapse is included in this implementation.

## Integration scope

Reuse the application’s existing CLI launcher, transcript/storage controls, permission handling, frontend transport, tool renderer, and Markdown renderer. Add a projection/reducer and disclosure component through those paths. Do not introduce an Agent SDK dependency, task scheduler, task tools, or MCP server for this presentation feature.

Launch with an executable and argument array, never a shell-composed prompt:

```ts
spawn(claudeExecutable, [
  "-p", prompt,
  "--output-format", "stream-json",
  "--verbose", "--include-partial-messages",
], existingSpawnOptions);
```

Existing session integration may add supported `--resume` or session-selection flags. Existing stream-JSON stdin integration may instead supply user input using its supported schema; it is optional for one prompt. Do not invent stdin control messages, permission callbacks, or approval acknowledgments from stdout shapes. Preserve current permissions and authentication; add no permission-bypass flags. A parsed `tool_use` is not an approval request. SDK `canUseTool` is not a callback exposed by raw CLI stdout. [C1: launch](https://code.claude.com/docs/en/headless), [C2: flags](https://code.claude.com/docs/en/cli-reference), [C5: permissions](https://code.claude.com/docs/en/agent-sdk/permissions)

The normalized journal follows existing transcript retention, redaction, access, and deletion controls. Do not create a second permanent raw-output archive or retain hidden reasoning/signatures for this UI. Preserve existing stderr diagnostics with their existing privacy policy.

## App-owned state and identity

One submitted application request owns one turn. A process may serve more than one turn; process lifetime and turn lifetime are separate. Route output through the launcher’s active request/session binding, and never guess ownership from the latest visible conversation.

```ts
type Turn = {
  requestId: string; sessionId?: string; processGeneration: string;
  status: "working" | "worked" | "stopped" | "failed" | "unknown";
  startedAtWallMs: number; terminalOffsetMs?: number;
  workEndOffsetMs?: number;
  timing: "live" | "matched-answer-start" | "run-end-fallback" | "terminal";
  responses: Response[]; activity: ActivityRef[]; tools: Map<string, Tool>;
  candidate?: Candidate; final?: FinalAnswer; diagnostics: Diagnostic[];
  explicitExpanded?: boolean; acceptedStopSeq?: number; lastAppliedSeq: number;
};
type Response = {
  messageId: string; parentToolUseId: string | null; ordinal: number;
  blocks: Map<number, Block>; canonicalFrames: CanonicalFrame[];
  firstNonemptyTextOffsetMs?: number; stopped: boolean;
  eligible: boolean; eligibilityReason?: string;
};
type Block = {
  index: number; type: string; text: string; inputJson: string;
  toolUseId?: string; generationStopped: boolean;
};
type Tool = {
  id: string; responseId: string; parentToolUseId: string | null;
  inputState: "generating" | "ready";
  executionState: "requested" | "running" | "completed" | "failed" | "unknown";
  children: ActivityRef[]; result?: unknown;
};
type NormalizedEvent = {
  requestId: string; sessionId?: string; processGeneration: string;
  seq: number; receivedAtWallMs: number; elapsedOffsetMs: number;
  envelopeUuid?: string; messageId?: string; parentToolUseId?: string | null;
  kind: "response-start" | "block-start" | "block-delta" | "block-stop"
    | "response-update" | "response-stop" | "assistant-canonical"
    | "tool-result" | "retry" | "result" | "notice"
    | "transport-error" | "stop-request" | "cancel" | "process-exit";
  payload: unknown; // validated supported fields; existing retention policy applies
};
```

These are logical records, not a requirement for new tables/classes. Extend existing entities where available. `Response` identity includes turn, generation, parent scope, and response ordinal/API message ID; indexes are local to that response. Tool correlation uses `(requestId, processGeneration, emitting parent/agent scope, tool_use_id)`, deriving scope only from available parent metadata. This is an app key, not a new protocol field. A canonical frame has its own envelope identity, ordered content fragments, and receive timing.

Assign a monotonically increasing local `seq` to every ingested stdout line **before** journaling. Persist normalized envelopes and their original sequence together. Derived records from one line carry that line’s sequence plus a stable sub-index; apply the whole line atomically. Locally generated cancellation/exit/transport records use the same ordered journal sequence allocator.

Reject stale request/generation events at the routing boundary. Session ID learned from initialization may bind the active request, but a conflicting session ID is a diagnostic, not permission to move an event to another turn. A resume is a fresh request/generation binding; it must not append ambiguous replay to an old partial buffer.

## Incremental transport

Treat stdout as NDJSON, independent of subprocess chunk boundaries. Use an incremental UTF-8 decoder, retain incomplete bytes/lines, split at newline, accept CRLF, and parse a nonempty final unterminated line at EOF. One chunk can contain many frames; a multibyte character or JSON line can span chunks. Never merge stderr into this parser. EOF drains input; it does not independently finalize a missing-result turn. Emit its `process-exit` terminal event only after stdout is drained and process-close/exit metadata is available, using the existing launcher’s close lifecycle. [C1: output format](https://code.claude.com/docs/en/headless)

Enforce a configurable line/buffer limit (initial application policy: 8 MiB per line). Malformed UTF-8, invalid nonempty JSON, or an exceeded limit produces a visible transport diagnostic and an incomplete/failed presentation; do not silently discard the line or fabricate success. Preserve any already rendered partial content. A valid terminal result already committed is not rewritten by a later process diagnostic.

Validate known envelope fields before reduction. Unknown event/block types remain opaque notices under existing retention controls; they do not become answer text, terminate a turn, or fail an otherwise healthy run solely because they are new. Unknown enum values and missing required terminal fields cannot imply success. Avoid logging full sensitive frames in parser errors.

## Protocol mapping

Partial wrappers contain raw API events; complete assistant messages are a separate canonical projection. Complete frames can arrive per nonempty block, share `message.id`, and precede that block’s stop. Do not assume a complete frame contains the whole response. [C3: ordering](https://code.claude.com/docs/en/agent-sdk/streaming-output)

| Incoming frame/event | Normalization and projection |
|---|---|
| Initialization/system session metadata | Bind/check session; keep existing notices. No answer or success transition. |
| `stream_event` / `message_start` | Open scoped response using API message ID and parent metadata. Supersede/demote any previous root candidate. |
| `content_block_start` with `index` | Create the indexed block; seed any provided initial content once. Nonempty initial root text applies the same candidate and first-text timestamp rule as a text delta at this receipt. Root tool-use immediately makes that response’s text ineligible as final candidate. |
| `content_block_delta` / `text_delta` | Append text to that indexed partial block exactly once. First nonempty root text records its receive offset and makes the newest eligible root response a candidate. |
| Delta / `input_json_delta.partial_json` | Append tool-input bytes as text; parse accumulated JSON only when complete. Never parse each fragment as standalone JSON. |
| Thinking/signature/redacted blocks | Render only supported readable returned content in activity. Treat signatures/redacted or encrypted payloads as opaque; never display them as explanation text. |
| `content_block_stop` | Close generation for that index; finalize input parsing. It does not complete tool execution. |
| `message_delta` | Record stop reason/usage and applicable truncation warnings. Stop reason is response metadata, not turn completion. |
| `message_stop` | Close one response and prefer available canonical assembly. Keep `Working`; the tool loop or another response may follow. |
| Complete `assistant` | Create/find its scoped response even without partials; retain each distinct envelope and fragments in arrival order. Reconcile with partial blocks without overwriting by `message.id`. First nonempty canonical-only root text records its receive offset and becomes an eligible candidate immediately. |
| `user` carrying `tool_result` | Correlate each `tool_use_id`; attach result and `is_error` to that tool. This frame is tool activity, not a new visible user prompt or final answer. |
| Child frames with `parent_tool_use_id` | Nest under the spawning tool, recursively. Child text cannot become the root answer. Buffer an unresolved parent link until its tool arrives; retain an orphan diagnostic if unresolved. |
| `system` / `api_retry` | Record retry activity and demote/invalidate the current root candidate. Preserve its text and response history. |
| Stream/API error | Record error, invalidate candidate, preserve partial content. Await authoritative result or terminal transport/exit handling; never treat error text as successful answer. |
| `result` | Execute terminal commit below; this ends the turn even if the subprocess remains alive. |
| Ping/informational frames | No assistant prose or success transition. Informational frames after result may update existing metadata only. |

Block indexes and incomplete input rules follow the [API streaming contract (C6)](https://platform.claude.com/docs/en/build-with-claude/streaming). Thinking display must respect [returned-content limits (C7)](https://platform.claude.com/docs/en/build-with-claude/thinking). Current partial-stream documentation covers main-session token events; support complete child messages even when no child partials arrive. [C3](https://code.claude.com/docs/en/agent-sdk/streaming-output)

Deduplicate reliable envelope UUIDs within session and process generation. API `message.id` alone is not a duplicate key: several legitimate canonical frames can share it. With no partial stream, assemble the distinct complete fragments in arrival order. Identical strings in distinct blocks/envelopes are legitimate repeated content.

For display, use partial assembly during streaming and prefer available canonical fragments at response stop/result, without ever concatenating both projections. Keep unmatched partial blocks until reconciled; associate fragments with an index only when metadata/order makes that mapping unambiguous. If assembly is uncertain, retain both source representations for diagnostics and use the authoritative result independently; never manufacture a matching answer by dropping repeated text. Abrupt termination preserves partial text when canonical content never arrived.

Skip already applied journal sequences during replay. Wrappers without reliable UUIDs apply live deltas once in sequence; the journal supplies replay identity. Never hash-deduplicate delta strings: `ha` followed by `ha` means `haha`. Without a persisted original cursor/sequence, reconnect creates a new generation and an incomplete prior attempt; do not append an unidentifiable replay to existing partial state.

## Candidate and terminal commit

The newest root response’s text is immediately visible outside activity as a provisional candidate. Demote it into ordered activity on root tool-use, retry, error, or a superseding root response. Child text always stays within tool activity. A later text block in an already ineligible response does not restore eligibility.

On a valid `result` with `subtype === "success"` **and** `is_error === false`, `result.result` is the authoritative final string and must be rendered verbatim. Success subtype alone is insufficient: it can accompany API error text. Keep any limit/truncation warnings even when the terminal result is successful. All documented error subtypes—including execution, max-turns, budget, and structured-output retry exhaustion—take the failed path. [C4: terminal types](https://app.unpkg.com/@anthropic-ai/claude-agent-sdk@0.3.301/files/sdk.d.ts)

Associate final-start timing only when the final string uniquely and exactly equals the latest eligible root response’s complete concatenated text, with reliable assembly and a recorded first nonempty text offset. Compare without trimming, fuzzy matching, prose heuristics, or matching child output. Multiple plausible equal candidates, uncertain assembly, absent canonical completeness, or absent timestamp means no proven mapping.

For an unmatched final string, render that string independently, retain provisional text as activity, and use result receipt for the work endpoint with `run-end-fallback` provenance. Empty string is an explicit empty-answer path and cannot acquire a first-text timestamp. A validated `structured_output` uses the existing structured renderer outside activity; never stringify it to fake a text match. Empty/structured-only success uses result-receipt fallback and no blank answer bubble. Structured output is final only when validated in the result. [C3](https://code.claude.com/docs/en/agent-sdk/streaming-output)

```text
onEnvelope(e):
  if wrongRequestOrGeneration(e) or e.seq <= turn.lastAppliedSeq: return
  atomically journal/apply all derived events; mark seq applied
  if turn already terminal:
    accept informational metadata; diagnose conflicting terminal/content events; return
  update response/block/tool projections
  if root tool-use, retry, error, or superseding root response:
    demote candidate to activity; mark affected response ineligible
  if accepted local stop request: record acceptedStopSeq; request existing launcher stop
  if valid result:
    preserve raw protocol result under existing retention controls
    if acceptedStopSeq precedes this result:
      demote candidate; terminal = stopped; workEnd = terminalOffset = e.elapsedOffset
      timing = terminal; do not default-collapse or commit successful final
    else if subtype == success AND is_error == false:
      final = authoritative result string and/or validated structured output
      matches = reliably complete eligible root responses exactly equal to nonempty final string
      match = only matches[0] if it is latest eligible root AND matches.length == 1
      if match has firstNonemptyTextOffset:
        workEnd = match.firstNonemptyTextOffset; timing = matched-answer-start
        remove matched text projection from activity; retain original journal
      else:
        demote candidate; workEnd = e.elapsedOffset; timing = run-end-fallback
      terminal = worked; terminalOffset = e.elapsedOffset
    else:
      demote candidate; terminal = failed; workEnd = terminalOffset = e.elapsedOffset
    preserve warnings; recompute default expansion; stop live timer
  else if confirmed local cancellation / transport failure / exit without result:
    demote candidate; terminal = stopped / failed / unknown as applicable
    workEnd = terminalOffset = e.elapsedOffset; timing = terminal; stop live timer
```

Serialize accepted app stop requests with result ingestion in the same ordered reducer. A validated result applied first wins; a later stop does nothing to that completed turn. If stop intent was accepted first while running, use the existing launcher’s SIGINT/stop path and keep consuming output until result, confirmed cancellation, or exit. At that terminal observation, display `stopped` even if the later protocol result reports success; retain that result as protocol history without default success collapse. Result text or structured output received after accepted stop intent remains accessible as stopped-run output through the existing safe renderer, even if no partial/canonical copy arrived; it is not a successful final-answer commit. This deterministic race rule is application policy, not a Claude guarantee. A stop request alone remains pending and does not freeze the clock.

Without an accepted stop intent, failed transport or a known failing process close produces `failed`; a drained zero-exit close without result or an unexplained lost run produces `unknown` with an incomplete-run notice. Buffer an early exit notification until stdout drains, and await close metadata after early EOF; either ordering must yield the same terminal classification. A result still finalizes immediately without waiting for close. Preserve the actual cause and any signal/exit code. SIGTERM does not complete/record the turn; SIGINT behavior still requires observing the resulting frames. Never infer success from either signal or exit code alone. [C1: lifecycle](https://code.claude.com/docs/en/headless)

After a valid terminal result, later process exit cannot turn success into “still working” or create another answer. Background work may keep print mode alive. The first valid terminal decision closes this turn; a conflicting late result is diagnostic and cannot silently overwrite it. [C1](https://code.claude.com/docs/en/headless), [C4](https://app.unpkg.com/@anthropic-ai/claude-agent-sdk@0.3.301/files/sdk.d.ts)

## Timing, labels, and expansion

Start the work clock when the app accepts the submitted request into its existing execution path; capture wall time plus a monotonic origin. Each receive offset is `max(monotonicNow - origin, 0)`. Tick once per second for display, deriving elapsed from the origin rather than incrementing a counter. Expansion, retries, tool boundaries, and rerenders do not reset it.

Keep the live `Working` timer until terminal confirmation, including candidate streaming. After proven final mapping, retrospectively freeze work time at the candidate’s first nonempty text receipt, excluding subsequent answer streaming. Otherwise freeze at result receipt and retain fallback provenance in diagnostics. Error/cancel/missing-result endpoints use observed terminal time. Result duration fields are not an answer-boundary substitute. Clamp negative durations to zero.

Persist wall timestamps, elapsed offsets, terminal endpoint, and provenance. Rehydrate completed durations from stored offsets. Monotonic clocks cannot span processes/reloads: use the existing running-process subscription to recover a live run; if unavailable, show unknown/interrupted state until reconciled instead of claiming uninterrupted timing.

| State | English label and behavior |
|---|---|
| Working, elapsed `< 1,000 ms` | `Working` |
| Working, elapsed `>= 1,000 ms` | `Working for {duration}`; includes pending app-owned interaction |
| Confirmed success | `Worked for {duration}` |
| Confirmed local stop | `You stopped after {duration}` |
| Failure | `Failed after {duration}` plus visible cause; proposed Claude adaptation |
| Missing-result/unknown interruption | `Activity` plus visible incomplete-run notice; no success wording |

Floor duration to whole seconds; localize narrow units and omit zero-valued units (`0s`, `1m`, `1h` in English). Do not import unsupported paused/loading statuses from Codex as invented CLI states.

Default activity expansion is open while working and after unsuccessful termination; confirmed success defaults closed when renderable activity exists. `explicitExpanded: boolean | undefined` is separate from this default and persists per turn using existing UI state storage. A user’s explicit choice survives new events and completion; existing force-expanded/accessibility overrides take precedence. Manual collapse while working is allowed and does not cancel or resume execution.

Never create an empty disclosure. A text-only run shows a noninteractive Working status while waiting; remove it after success when the matched answer leaves no activity. Empty/structured success also has no toggle unless real activity remains. Keep notices and pending approval/input controls outside regardless of expansion. A tool failure/denial can remain in history while the overall turn later succeeds.

Use the existing disclosure/button primitive with keyboard activation, visible focus, `aria-expanded`, `aria-controls`, an associated region, and a meaningful accessible name. Avoid per-second screen-reader announcements; announce meaningful status transitions. Keep focus stable on candidate demotion and preserve scroll position for readers above the newest output. Animate height/opacity and chevron only within existing reduced-motion conventions; new activity must not force scrolling.

## Tool cards and child activity

Create a card when tool-use generation starts, keyed by its tool-use ID. Show “generating input” until its complete input is available, then “requested.” A complete assistant frame or block stop proves input generation, not actual execution. Mark “running” only from a supported existing lifecycle/tool-progress signal; otherwise leave requested until a result arrives. Render incomplete JSON as a generating preview, never as executable complete arguments.

Join `user` tool results by `tool_use_id` with matching request, generation, and emitting parent/agent scope, including multiple results in one envelope. A result marks the correlated tool completed or failed using its error flag; retain unrecognized result content through the existing safe renderer. Deduplicate envelope replay, not repeated content. An unmatched result remains visible with an attribution diagnostic. Child assistant/tool results nest under their spawning `parent_tool_use_id`; use available parent metadata to resolve the spawning card. If several cards could match, keep attribution unresolved with an ambiguity diagnostic rather than attaching arbitrarily. A child finishing does not complete the root turn.

Use existing permission/question events to maintain visible controls. Ordinary tool generation alone must not show an approval affordance. At terminal interruption, unresolved tools become unknown/interrupted; a turn result cannot retroactively prove each tool succeeded. [C3: block completion](https://code.claude.com/docs/en/agent-sdk/streaming-output), [C5: user input](https://code.claude.com/docs/en/agent-sdk/user-input)

## Illustrative normalized traces

These traces are **synthetic**, showing normalized reducer input and offsets; they are not captured raw CLI JSON or promises about exact frame ordering. All rows share an app request/session/generation and increasing local sequences.

```text
seq  offset  event
1    0ms     request accepted
2    100ms   root response A starts; text block 0 starts
3    200ms   text delta "Let me check." -> visible candidate A
4    300ms   canonical assistant envelope U1, message A, text "Let me check."
5    350ms   root tool block 1 starts, tool T -> demote A; generating input
6    400ms   canonical U2, message A, tool T; same message ID, distinct frame
7    420ms   block 1 stops -> input ready/requested; response stop is not success
8    900ms   user tool_result for T -> completed
9    1000ms  root response B starts
10   1200ms  text delta "Found it." -> candidate B; Working for 1s
11   1700ms  canonical U3/message B text "Found it."; response stops
12   2200ms  result success, is_error=false, result="Found it."
             -> final B; Worked for 1s (endpoint 1200ms); collapse A/T activity
```

```text
seq  offset  event
1    0ms     request accepted
2    100ms   root response A/tool T; child text attributed to parent T
3    300ms   child response C says "Done" -> nested activity, never root candidate
4    500ms   root response B text "Answer" -> provisional candidate
5    700ms   system/api_retry -> demote B; keep Working and history
6    1000ms  root response D text "Answer" -> new candidate
7    1400ms  result success, is_error=false, result="Different answer"
             -> authoritative unmatched final; Worked for 1s, endpoint 1400ms
             -> run-end-fallback diagnostic; retain B/D and child activity
8    1600ms  informational notice; process still alive -> turn stays complete
```

## Implementation order

1. Confirm current launcher/session ownership, transcript privacy controls, permission events, frontend channel, and persistence hooks; extend those paths only.
2. Add bounded NDJSON decoding and validated normalized envelopes with request/generation identity, journal sequence, and monotonic receive offsets.
3. Add indexed partial/canonical projections, per-envelope deduplication, child/tool correlation, and replay-safe reduction.
4. Add provisional candidate demotion and authoritative result commit, distinct terminal causes, timing provenance, and warning retention.
5. Add disclosure presentation with separately persisted explicit expansion, accessible controls, visible pending interactions/errors, and stable scrolling.
6. Implement/run the fixture matrix below against the reducer and existing component harness; capture sanitized optional live checks before release. Document any deployed CLI deviations.

## Acceptance fixtures and release checks

Fixtures must use synthetic/sanitized data with explicit receive offsets. These are required implementation tests, **not tests already run**. Assert activity order, candidate/final projection, status, expansion, identity, and endpoint/provenance as applicable.

| Fixture | Expected outcome |
|---|---|
| Text-only, exact canonical/result match | Candidate visible immediately; Working until result; retrospectively freeze at first text; remove status when no activity remains. |
| Tool-first; commentary → tool → answer | Tool/commentary remain ordered activity; final outside; success defaults collapsed. |
| Text and tool blocks share `message.id` | Keep both canonical envelopes; tool demotes commentary; no message-ID deduplication. |
| Canonical assistant precedes block stop | No duplicate text; input generation stop never marks execution completed. |
| Nonempty text seeded at block start | Show it immediately and timestamp first text at that receipt; later deltas do not move the boundary. |
| Partial plus canonical representations | Render one reconciled projection, never their concatenation. |
| Distinct identical canonical text blocks | Preserve both in concatenated text; no text/hash deduplication. |
| Repeated identical delta text | Both deltas apply once; persisted journal replay adds neither twice. |
| Canonical-only mode or abrupt partial-only end | Assemble distinct canonical fragments; preserve partials on interruption; no fabricated completion. |
| Child text and nested children; parent arrives late | Tree follows tool IDs; child text never becomes root final; unresolved links remain visible/diagnosed. |
| Same string tool ID in different child scopes | Results scope-match their cards; ambiguous spawning-card lookup stays unresolved with an attribution diagnostic. |
| Retry after candidate; subsequent root response | Demote candidate, preserve history, keep Working; only eligible latest response can map. |
| `message_stop`, `end_turn`, truncated response | Neither completes turn; retain truncation warning even if a later result succeeds. |
| Success subtype with `is_error=true` | Failed status and visible error; never Worked. |
| Each documented error result subtype | Failed terminal presentation; no committed successful final or automatic success collapse. |
| Unmatched/ambiguous final or incomplete canonical assembly | Render authoritative result verbatim; retain activity; endpoint=result receipt, fallback diagnostic. |
| Whitespace difference between candidate and result | No trim/fuzzy match; result wins with fallback timing. |
| Empty result; validated structured-only result | Explicit empty/structured answer path; no blank bubble or false match; fallback timing. |
| Tool result error/denial followed by turn success | Preserve tool failure/history; turn may Worked; app approval controls derive from real events only. |
| Local cancel, SIGTERM, SIGINT, failing exit, zero exit without result | Preserve distinct observed cause; stopped/failed/unknown as specified; no exit-based success. |
| EOF then exit 1; exit 1 then final stdout drain | Both wait for drain plus close metadata and end failed; EOF never locks in unknown prematurely. |
| Serialized stop/result race in both orderings | Result-first keeps completion; accepted-stop-first keeps consuming but ends stopped with raw result retained and no default success collapse. |
| Result while process alive; metadata and exit afterward | Finalize once at result; retain informational updates without restarting the timer or answer. |
| Split UTF-8/JSON, multiple lines/chunk, CRLF, final line without newline | Same normalized sequence/projection as equivalent complete-line input. |
| Malformed JSON/UTF-8, over-limit line, unknown event | Known transport corruption is visible/incomplete; unknown valid event is safe metadata, never success. |
| Duplicate UUID vs shared message ID | Ignore actual envelope replay; keep distinct per-block frames. |
| Journal replay; late prior-generation output; cursorless reconnect | Identical projection/timing on replay; stale output rejected; no ambiguous partial append. |
| 999/1000ms, 60s, negative offset, slow final streaming | Correct labels/units/clamping; matching final excludes streaming after first text. |
| Manual expansion/collapse during work and after reload | Explicit choice persists across events/terminal result using existing state storage. |
| No activity, errors, pending questions/permissions | No empty toggle; visible status/control/error remains accessible outside collapsed activity. |
| Keyboard, screen reader, reduced motion, reading earlier output | Correct focus/expanded state; no second-by-second announcement or forced scroll. |

Optional release validation should capture harmless text-only and read-only tool streams from the pinned CLI using existing authentication and permissions. Check canonical ordering, candidate/result equality, child forwarding, retry/error shapes, permission events, signal outcomes, and informational output after result. Those live checks were **not run** here; documentation establishes protocol intent, while executable ordering and app integration remain unverified.
