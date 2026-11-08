# Agent preflight and memory write contract — NVVAI Factory

## Before any action (read-only)
1. Query `verified-current-state`, `blockers-next-safe-step` and `decisions-and-proof-register` mental models, then original evidence with `recall` (not only generated summaries).
2. Compare the proposed action against prior evidence using tuple `{repo, PR, head_sha, environment, test_name, test_version, dataset, auth_role}`. An unchanged tuple with valid PASS evidence should not be executed again.
3. Classify every claim as `VERIFIED`, `REPORTED`, `PROPOSED`, `BLOCKED`, `SUPERSEDED`, or `UNKNOWN`; include timestamp and source document.
4. Check scoped tools; no broad SSH or arbitrary sudo. If authorization is absent, stop and request the specific required authorization without leaking credentials.
5. Identify target, rollback, cost and impact. No migration/merge/prod/restart/destructive action without explicit current owner approval.

## After each step (retain to this bank only)
Use a stable `document_id` such as `nvvai-factory-<pr>-<sha-short>-<gate>-<YYYYMMDD>` and consistent tags `nvvai-factory`, `area:acl`, `env:staging`, `status:verified`, `pr:38` (the actual tags must match facts). Do not reuse `document_id` for unrelated work. Include:

- Purpose; date/time in UTC; operator/actor and authorization scope
- Exact repo/ref/head commit SHA, patch SHA256 and evidence/CI links
- Environment (`source-only`, `isolated-staging`, or `production`)
- Procedure, input, observed output, pass/fail/blocked, limitations
- What was NOT done (e.g. no merge, no deploy, no restart)
- Explicit blocker, single safe next step, who must authorize
- Provenance: Hindsight previous document IDs and original evidence

## During reasoning
`recall` for facts and provenance; `reflect` for comparing options and identifying next steps; `retain` only after obtaining outcomes. A mental model is a convenient living index, **not** an authorization decision, immutable audit record or runtime proof.

## Migration from personal history
Do not wholesale clone `webui-vitalii-private`. Start from historical documents for issues 23/26 and PRs 28/33/35/36/38, decisions, architecture, verified tests and tool scopes. Carry source document ID and original timestamps into newly retained records. Preserve originals intact. Exclude personal and unrelated project data.

## Integration boundaries
Hindsight's MCP tools can have bank-specific endpoints. Point Factory agents at the project bank only, subject to authorized authentication/ACL and an actual connection test. Changing the GitHub fork or the memory template does not reconfigure existing WebUI, MCP or running servers.
