# Factory Hindsight bank — Owner admin import authorization checkpoint

Date: 2026-11-08 (Europe/Kyiv)

## Owner authorization
Owner explicitly authorized import **through the normal Hindsight administrator access** for target bank `nvvai-autonomous-factory`. This authorization does not require changing the existing `webui-vitalii-private` bank, service restart, deployment, merge or migration. Do not interpret it as permission to bypass 401 or retrieve secrets via Gateway.

## Current evidence
- Fork: `vitaliisonofvladimir-alt/hindsight`.
- Template: `project-templates/nvvai-autonomous-factory/bank-template.json`, blob SHA `8bd00f47ff2b2872108b1e9cb1dd12bcc339ce58`.
- Fork schema: `hindsight-docs/static/bank-template-schema.json`, schema blob SHA `dd55386464a666c6cb88d5e503a59f0ecf5427ec`. Offline validation: PASS, 142 checks, zero errors, 7 models, 6 directives.
- Fork API code `hindsight-api-slim/hindsight_api/api/http.py` defines `POST /v1/default/banks/{bank_id}/import?dry_run=true` and returns a validation-only result. Fork source version 1.2.0 is **not** verified deployed version.
- Live `127.0.0.1:8888` identity-scoped REST gateway requires an authenticated admin session: GET schema and bank export without it returned HTTP 401 (before and after authorization message). User permission does **not** itself attach an admin API session to SSH Direct.
- NVVAI SSH Direct default `nvvai-mcp` has no sudo and no bank administration method. Available `/usr/local/sbin/nvvai-hindsight-staging-control` only supports `status|validate|deploy` for a staging Compose service, **not** bank template import.
- Existing ChatGPT Hindsight plugin provides only `retain`, `recall`, `reflect`; it does not expose the bank-management API or a target-bank selector.

## Result
- **Authenticated real-server dry_run:** BLOCKED — administrator identity not present in the currently connected tools.
- **New bank created:** NO.
- **Seed records copied:** NO.
- **Source personal bank changed:** NO.
- **Production changes/restarts/deployments:** NONE.

## Next safe action
Use the existing Owner-authenticated Hindsight Control Plane session or grant the connected tool an explicit least-privilege admin API capability for `nvvai-autonomous-factory` only. On that **authorized** path, invoke `POST /v1/default/banks/nvvai-autonomous-factory/import?dry_run=true` with pinned manifest, verify `dry_run:true`, 7 model IDs and 6 directive names, then perform the same import without dry_run and read back created bank. Do not send or print administrator tokens. Copy only verified factory project facts with original provenance afterward.
