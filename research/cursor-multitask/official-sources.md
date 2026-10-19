# Cursor multitask: official documentation findings

Researched 2026-10-19. Evidence here is published product documentation, not observation of the installed app executing. Documentation is mutable; dated changelogs establish introduction scope. No local application or user data was inspected for this document.

## What the named feature does

**`/multitask` dispatches requests to asynchronous subagents within an agent conversation.** Cursor introduced it in **3.2, April 24, 2026**, initially in the Agents Window. Instead of waiting in the message queue, requests can proceed concurrently; a large task can also be divided among background subagents. Already queued messages can be redirected into multitasking by asking the agent. The same release separately introduced improved worktrees and multi-root workspaces; these are related capabilities, not proof that every multitask automatically receives its own worktree. [Cursor 3.2 changelog](https://cursor.com/changelog/04-24-26)

**3.3, May 7, 2026**, extended `/multitask` to the editor. It added **Build in Parallel**: from a plan, choose that action to execute independent steps concurrently using async subagents, retaining order where dependencies require it. A separate quick action can split accumulated changes into PRs, using conversation context to propose logical divisions and creating a backup snapshot before approval. [Cursor 3.3 changelog](https://cursor.com/changelog/05-07-26)

## Mechanism documented by Cursor

Subagents have separate contexts. The parent supplies their starting instructions; they do not automatically receive the prior conversation. Foreground execution blocks the parent; background execution returns immediately. Multiple Task calls in one message launch concurrent children. Children return results and an agent ID that supports continuation. Background state is persisted as work proceeds.

By default, children **share the parent's checkout**. Explicitly requesting separate environments gives each a Git worktree and branch, or a cloud VM and repository clone; the parent subsequently merges results. `/in-cloud` sends the next task to a cloud subagent with its own VM and branch. The parent remains available. Parent model selection does not guarantee identical child models: built-ins choose models, and custom subagents can inherit or specify one. [Subagents reference](https://cursor.com/docs/subagents)

The enabling runtime capability predates the slash command: **2.5, February 17, 2026**, introduced asynchronous and nested subagents. Previously subagents blocked their parent. That release also states that stopping a parent stops child subagents. This is a historical release claim, not a verified guarantee across every current failure mode. [Cursor 2.5 changelog](https://cursor.com/changelog/2-5)

## Distinguishing adjacent features

| Feature | Unit of work and intended result | Source |
| --- | --- | --- |
| `/multitask` | Different requests or subtasks progress inside a coordinating conversation. | [3.2](https://cursor.com/changelog/04-24-26) |
| Build in Parallel | Independent parts of one plan execute concurrently; dependencies remain ordered. | [3.3](https://cursor.com/changelog/05-07-26) |
| Multiple top-level agents | Separate ongoing conversations managed from the Agents Window sidebar, potentially spanning repositories and environments. | [Multi-agent help](https://cursor.com/help/ai-features/multi-agent) |
| Same-prompt candidate runs | Multiple agents attempt the same problem, producing alternatives to compare rather than complementary subtasks. Cursor 2.0 announced up to eight agents per prompt, isolated by worktrees or remote machines. | [2.0, October 29, 2025](https://cursor.com/changelog/2-0) |
| Cloud agent | Remote execution environment, allowing a long task to continue while the laptop is closed. | [Multi-agent help](https://cursor.com/help/ai-features/multi-agent) |

## Worktree workflow and version caveats

Current documentation places UI-managed worktrees in the Agents Window. Starting or moving an agent into one creates a separate checkout. After review, work may continue there, be committed/pushed, or be brought into the main workspace. Setup is configured through `.cursor/worktrees.json`.

In the IDE, `/worktree` isolates the rest of the chat; `/apply-worktree` brings changes back and `/delete-worktree` cleans up. `/best-of-n` runs a task across models with a separate worktree per candidate. It compares candidates without automatically merging a winner.

Cleanup documentation explicitly describes **3.5 and later**: a machine-wide default maximum of 25 worktrees, with periodic cleanup and additional cleanup when creation exceeds that cap. This is not a concurrent-subagent limit. [Worktrees reference](https://cursor.com/docs/configuration/worktrees)

An older official guide describes selecting several models in a dropdown and applying the chosen result. Treat this as historical UI guidance, not a guarantee for every current layout. [Agent best practices](https://cursor.com/blog/agent-best-practices)

## Evidence limits and open implementation questions

- Answered from official sources: feature meaning, initial release scope, request/plan entry points, relationship to async children, default shared checkout, optional isolation, and distinction from candidate comparison and cloud execution.
- Not established by these sources: exact slash-command prompt, queue mutation algorithm, child scheduling limits, transport protocol, event delivery, retry semantics, stop races, or how the installed build represents state. Those require packaged-code or runtime evidence.
- Inference: `/multitask` is a user-facing orchestration entry point over async subagents. Published descriptions support that interpretation, but do not reveal whether dispatch is driven by a fixed client scheduler, an injected prompt, model tool decisions, or a combination.
- The eight-agent figure belongs to Cursor 2.0 same-prompt candidate runs. It must not be transferred to `/multitask` as its current concurrency cap.
- Current generic help mentions research, shell, and browser built-ins, whereas the dedicated subagent page lists Explore and Browser. This mismatch does not affect the core multitask mechanism; an installed-build check is needed for the exact built-in roster.
