# Cursor multitask finding ledger

The installed target is Cursor 3.25.9 stable. “Answered” below means answered within static code or official-documentation scope, not verified by an executing agent. `R`, `UI` and `H` identify local snippet records, not REA Evidence IDs. See [methodology](methodology.md) for the actual REA receipts and limits.

| Question | Status and conclusion | Evidence and confidence | Remaining boundary |
| --- | --- | --- | --- |
| What is multitask? | Answered: an orchestration mode over async children. | [Official sources](official-sources.md), R01–R06; high for documented/static contracts. | Actual model compliance. |
| How does the slash action work? | Answered for Glass: dynamically generated mode action toggles unifiedMode. | UI01–UI08; high static. | Other UI variants and active rollout. |
| How is ongoing work handed off? | Answered: a distinct simulated action injects a one-child self-fork instruction. | UI09–UI12, R01; high static/prompt. | Whether a model follows the instruction in a given run. |
| Does a child inherit context? | Answered by route: ordinary fresh task, resume and self-fork differ. | R07–R13, R17, R31–R33; high static. | Downstream client fork snapshot implementation and configured state mappers. |
| Who chooses the decomposition? | Partially answered: model instructions define selective delegation and plan phases; executor runs Task calls. | R02–R06, R17–R18; high for policy, architectural inference for whole feature. | Server-side planning mechanisms outside these bundles. |
| How does async dispatch return? | Answered: register background promise and return status/ID before child completion. | UI13, H02; high static. | Real latency and scheduling fairness. |
| How are results delivered? | Answered for examined routes: completion registry, parent queue, wakeup action, simulated input. | UI14–UI23, H03–H05, R20–R23; high static. | Active flags, crash recovery and exactly-once guarantees. |
| Can the parent receive new input? | Answered at design level: background handoff frees the turn; steering and waits have yielding paths. | R17, UI13, H10; high static. | Interleaving under real load. |
| Can a running child receive follow-ups? | Partially answered: resume/interrupt schema and queued-resume machinery coexist; running-followup result may be a tool error. | R13, R18, R28, UI15; high static. | End-to-end acceptance and durable ordering. |
| What happens to queued user messages? | Partially answered: queue-tray tracks first item and forces handoff submission. | UI11–UI12; high static. | Complete downstream queue-drain order. |
| Does each child get a worktree? | Answered in current docs: shared checkout by default; isolation explicit. | [Subagents reference](https://cursor.com/docs/subagents), UI08; high for documentation. | Runtime filesystem behavior for the selected installed route. |
| What are concurrency limits? | Partially answered: local configurable fallback 32; not a product-wide cap. | UI13, UI26–UI27, H01, H16; high static. | Account/backend/cloud limits and active config. |
| What does stop do? | Partially answered: explicit child cancellation, exclusions and local hard-cancel backstop. | H11–H13, R24–R27; high static. | All race conditions, teardown and cloud behavior. |
| Does work survive restart? | Unresolved: no restart experiment or full persistence schema analysis. | No positive evidence. | Requires runtime/durable-state investigation. |

## Evidence index

| Prefix | Detailed explanation | Exact source records |
| --- | --- | --- |
| R01–R33 | [Runtime](technical/runtime-analysis.md) | [runtime-snippets.json](evidence/runtime-snippets.json) |
| UI01–UI27 | [UI](technical/ui-analysis.md) | [ui-snippets.json](evidence/ui-snippets.json) |
| H01–H16 | [Host](technical/host-analysis.md) | [host-snippets.json](evidence/host-snippets.json) |

The REA parent is `ev_7a178f68882162cbe7980ae291376eaf629e3717502978849428ba32e05aac58`; its source selection covers the runtime bundle and manifests, not the separately inspected UI/host bundles. A capped graph did not retain a matching entity for the literal prompt seed. No finding above treats that no-match as evidence that the feature is absent.
