# NVVAI Autonomous Factory — Hindsight compatibility preflight

**Date:** 2026-11-08 (Europe/Kyiv)  
**Branch:** `feature/nvvai-autonomous-factory-memory-20261108`  
**Target bank (not created):** `nvvai-autonomous-factory`  
**Original bank (untouched):** `webui-vitalii-private`

## Evidence

- Template: `project-templates/nvvai-autonomous-factory/bank-template.json`, GitHub blob SHA `8bd00f47ff2b2872108b1e9cb1dd12bcc339ce58`.
- Bank schema from **this fork**, default `main`: `hindsight-docs/static/bank-template-schema.json`, blob SHA `dd55386464a666c6cb88d5e503a59f0ecf5427ec`.
- Fork source `hindsight-api-slim/pyproject.toml` currently declares API version `1.2.0`; **this is not a deployed runtime version verification**.
- Per-field offline schema validation: **PASS**, 142 validation visits, 0 errors. The manifest includes 7 mental models, 6 directives and 9 bank overrides. Unique IDs and directive names PASS; no conflicting refresh triggers; source bank ID absent from template.
- Read-only default NVVAI SSH Direct profile is available, with `sudo_enabled=false`; Docker access was not assumed.
- The publicly exposed `https://hindsight.nvvai.site/v1/bank-template-schema` requires login (HTTP 307 to the login route).
- Local existing REST gateway at `127.0.0.1:8888` responds to `/health` with `{\"status\":\"ok\",\"mode\":\"identity-scoped-rest\"}`, while unauthenticated `GET /v1/bank-template-schema` returns HTTP 401. 401 is **NOT** proof that the backend API lacks the route.
- Existing single-bank gateway at `127.0.0.1:18098` reports 3 scoped tools, not bank administration.

## Gate status

| Gate | Status | Rationale |
| --- | --- | --- |
| Template loads as JSON | PASS | GitHub file read and JSON.parse |
| Template matches fork main JSON schema | PASS (offline only) | 142 visits; no errors |
| Running server implementation/version confirmed | UNKNOWN | Not verified through authorized server administration |
| Authenticated server `POST /v1/default/banks/nvvai-autonomous-factory/import?dry_run=true` | BLOCKED | Bank-management authority not exposed to current scoped tools; do not bypass 401 |
| Create project bank | NOT PERFORMED | Requires the preceding authenticated dry run |
| Selective historical import | NOT PERFORMED | Do not write source bank or import unverified records |
| Scoped project retain / recall / reflect | NOT PERFORMED | New bank is not active |

## Resume protocol

1. Use an **existing authorized Owner/operator session** on the deployed Hindsight server to obtain the actual runtime API/version/schema and confirm the bank import route; do not print, share, copy or log credentials.
2. Issue an **authenticated, target-pinned** import request with `dry_run=true` and this exact manifest; review server validation/errors first.
3. If and only if dry run passes and release authorization permits, import the template to `nvvai-autonomous-factory`. Do not change `webui-vitalii-private`.
4. Copy only confirmed project knowledge, preserving original document IDs, timestamps, repository refs, SHA, and `VERIFIED/REPORTED/PROPOSED/BLOCKED` scope. Do not copy secrets or unrelated NVVAI projects.
5. Verify bank-specific retain/recall/reflect and mental-model refresh; write a final checkpoint in the **new** bank, not in the old bank.

**Explicitly NOT performed:** existing-bank write, backend API import, new-bank creation, data migration, Docker changes, service restart, production deployment, merge, or schema changes.
