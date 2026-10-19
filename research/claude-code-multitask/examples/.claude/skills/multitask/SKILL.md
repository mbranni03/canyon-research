---
name: multitask
description: Coordinate independent tasks with native background workers and review their results.
disable-model-invocation: true
---

This is a proposed, untested coordination policy. Remain the user-facing
coordinator in this conversation. Apply the policy to: $ARGUMENTS

1. Read existing repository instructions and retain the user's permission policy.
   Record the objective, dependencies, ownership, and acceptance checks.
2. Request one ordinary native background worker per coherent outcome. Use the
   task-worker definition for isolated changes when available. Read-only work
   can use an ordinary subagent. Launch siblings only for independent outcomes.
3. Give each worker a task ID, context summary, allowed files, intended committed
   base, checks, and result contract. Require actual checkout/HEAD verification
   before edits. If isolation or the intended baseline is unavailable, stop that
   assignment for correction or serialize it. Do not assume dirty changes copy.
4. For inherited conversation context, the user can invoke /subtask. Otherwise
   summarize the handoff. Do not equate independent /fork sessions with returning
   children. Never copy Cursor-specific Task arguments into Claude calls.
5. Include this handoff guard: "This assignment completes delegation. Continue
   the assigned task; do not delegate again merely because inherited instructions
   describe the coordinator." This is prompt policy, not an enforced depth limit.
6. After dispatch, give a brief status and finish the foreground response. Accept
   new requests and corrections. Use native completion delivery; avoid a polling
   loop that occupies the conversation. Do not claim success at dispatch.
7. Review results against actual artifacts. Preserve other workers' changes.
   Integrate serially and check the combined result before reporting completion.
8. Treat explicit user cancellation as terminal until the user requests restart.
   Surface blockers and permission denials; do not retry with broader permissions.
9. Preserve integration ownership here. Do not commit, merge, or publish unless
   the user has authorized that action. Policy persistence is conversational,
   not durable mode state; restate it when needed after context changes.

Requested result contract (not a native event schema): task ID; outcome
(completed/blocked/failed/cancelled); summary; files or artifacts; branch and
worktree; checks and results; unresolved issues; decisions needed.
