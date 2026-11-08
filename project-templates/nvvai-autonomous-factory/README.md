# NVVAI Autonomous Factory — versioned Hindsight memory bank
**Prepared:** 2026-11-08. **Scope:** source-only / configuration proposal. **Not deployed.**

## Purpose
Store project strategy, goal, architecture, agents and roles, skills/tools, approved decisions, verified progress, PR/CI/SHA evidence, blockers and the next safe step together under bank ID `nvvai-autonomous-factory`. Keep the existing `webui-vitalii-private` bank unchanged.

## Files
- `bank-template.json` — portable, declarative Hindsight Bank Template v1: bank configuration, 7 mental models and 6 directives.
- `seed-checkpoint.md` — evidence-labeled initial project context, with precise source IDs and facts that need runtime re-verification.
- `agent-workflow.md` — repeat-prevention protocol, evidence schema, access controls and staged import procedure.

## Safety / version compatibility
This template follows the current upstream Hindsight Bank Templates API. The *installed VPS version* has not been confirmed to support `POST /v1/default/banks/{id}/import`, model cron triggers or directives. Confirm `GET /v1/bank-template-schema` and perform `?dry_run=true` against the **authorized private server** before real import. Do not put API tokens in repository, shell history or chat. Do not blindly deploy the fork: upgrading the running service is a separate risk/approval decision.

## Bootstrap / import (authorized operator, after compatibility verification)
1. Authenticate to the private Hindsight API with existing approved credentials, without printing credentials.
2. Validate the manifest: `POST /v1/default/banks/nvvai-autonomous-factory/import?dry_run=true` with JSON body `bank-template.json`.
3. Inspect fields / model trigger compatibility. If the installed version is older, adapt in a **separate** patch or upgrade plan; do not apply unknown settings.
4. After a successful dry-run and separate release approval, import to the new bank only.
5. Import relevant source records from `webui-vitalii-private` by **selective copying** with original document IDs and date provenance. Do not delete/move the originals.
6. Validate `retain`, `recall`, `reflect`; check the 7 model refresh operations and their histories. Verify bank-scoped MCP access on authorized agents.
7. No factory production change, database migration, merge or restart is authorized by this template.

**Authoritative docs:** https://hindsight.vectorize.io/developer/api/bank-templates
