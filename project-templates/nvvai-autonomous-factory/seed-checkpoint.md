# NVVAI Autonomous Factory — initial project checkpoint
**Date:** 2026-11-08 (Europe/Kyiv)
**Classification:** historical evidence snapshot; validate live state before acting.
**Canonical repo:** `vitaliisonofvladimir-alt/agentdock-factory`
**Former memory bank:** `webui-vitalii-private`
**New bank:** `nvvai-autonomous-factory` (proposed, not yet created by this commit)

## Owner-approved direction
Create an autonomous yet controlled software-product factory: Supervisor coordinates implementation through Engineer / Reviewer and GitHub/CI, records reliable proof, uses constrained compute and API budgets, seeks a practical route to a first sale. Owner is the approval authority for merge, production, destructive cleanup, migrations and restarts. Agent roles must remain separated; independent Reviewer must not be simulated by Engineer.

## Evidence and scope
- **GitHub read-only, 2026-11-08:** PR #38 is **open Draft**, head `d6215719972c1d7a305693e457c0b2def7ebfe4f`, not merged. Title: `security(staging): pin real Factory HTTP handlers to trusted sessions; separate human transition policy`.
- **GitHub read-only, 2026-11-08:** PR #36 is **open Draft**, head `d31b69782f0f6305d26b0b24e9062b62d742e293`, not merged.
- **GitHub issue #26, 2026-11-08:** acceptance gates still have unchecked boxes for isolation, stale revision, blocked/held cross-tenant behavior, independent Reviewer, model routing, GPT-6 seat attestation and redacted rollback proof.
- **Hindsight document** `nvvai-factory-pr36-staging-policy-audit-checkpoint-20261107`: PR36 source/tests are not equal to three authenticated end-to-end Supervisor→Engineer→Reviewer→PR/CI→Done; reported E2E progress 0/3 at that checkpoint. Independent review and native PostgreSQL concurrency/rollback tests remain pending.
- **Hindsight document** `nvvai-factory-pr38-v2-source-audit-create-checkpoint-20261108`: v2 source-only patch tests 34/34 PASS; independent review blocked (free route HTTP 429), staging BLOCKED. V2 patch sha256 `27bc85392259d94d444d12efbaaeb3478731240dd5582516d2b1ee0b7043377b`.
- **Hindsight document** `nvvai-pr38-v4-workitems-transaction-github-checkpoint-20261108`: later v4 work items source integration committed on branch `security/pr38-v4-enforce-policies-20261108`, factory commit `dfd9218d2d9b2068cb254c175ff4b359696dad37`; report explicitly says source-integrated **NOT DEPLOYED**. Older running staging image `nvvai-factory-pr27-e2e:520800cf` and production unchanged in that report. This is NOT a new live verification.
- **Hindsight document** `nvvai-pr38-v4-staging-rollback-plan-20261108`: staging DB graph/audit triggers were reported enabled and rollback prepared, not executed. Do not confuse DB trigger state with JS runtime integration.

## Current highest-value milestone
One fully verified, isolated, authenticated E2E through Supervisor→Engineer→independent Reviewer→GitHub PR/CI→Done, then repeat for three consecutive tasks with idempotency and rollback evidence. Avoid starting this before owner/session ACL, source review, and PostgreSQL checks pass.

## Project agent / tool map (capabilities subject to verification)
- Owner: approves irreversible actions and permission boundaries.
- Supervisor: orchestrates work, checks state, budgets and gates. **Autonomous E2E not proven.**
- Engineer / Rapid Prototyper: scoped implementation in isolated workspace.
- Independent Reviewer: read-only pinned-SHA review, separate authorization from Engineer.
- GitHub connector: repository source, PR and CI evidence; credentials hidden.
- Hindsight: durable retain/recall/reflect and mental models for this project.
- NVVAI SSH Direct: separate read-only preflight using health → list_profiles → id; no sudo on default profile as checked 2026-11-08; denied Docker socket access not circumvented.
- PostgreSQL staging: explicitly isolated and gated; no production credentials or write tokens shared.
- Model routing: verify exact configured model identifier and provider availability; plans are not runtime proof.

## Known operational constraints
Keep bulk project artifacts under /mnt/disk when working on VPS (verify mount/capacity); no destructive cleanup without approval; no code or env secrets in memory. Avoid repeat checks that already passed on identical SHA+environment; record test proof/limitations. Source-only branch changes do not authorize deployments.

## Next safe step
Independent pinned-SHA source review and verified transactional security/CREATE recovery implementation, then separately authorized **isolated** native PostgreSQL staging acceptance. Reconcile latest PR38 v4 branch and checkpoints before deciding what exact SHA is next; do not rerun or redeploy based on this historical snapshot.
