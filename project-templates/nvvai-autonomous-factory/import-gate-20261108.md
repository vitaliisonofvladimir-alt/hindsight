# NVVAI Autonomous Factory — authorized Hindsight bank import gate

**Date:** 2026-11-08 (Europe/Kyiv)
**Owner instruction:** Authorizes import using the **existing official Hindsight administrator access**, targeting only `nvvai-autonomous-factory`; do not change `webui-vitalii-private`.

## Evidence checked

- Hindsight backend container `hindsight-hindsight-1` running; `hindsight-postgres-1` healthy (via fixed root-owned read-only diagnostic operator).
- Existing bank REST endpoint `http://127.0.0.1:8888/v1/bank-template-schema` returns **401** for the currently available `nvvai-mcp` session. `GET /v1/default/banks/nvvai-autonomous-factory` also returned **401**, not a valid bank-absence test.
- `sudo -n -l` reports only fixed read-only Hindsight inspection, gateway-audit, staging status and maintenance operators. **No approved bank-import operator** is available to `nvvai-mcp`. A root-owned staging wrapper allows only `status|validate|deploy`, and must **not** be repurposed for bank management.
- Fork main `hindsight-api-slim/hindsight_api/api/http.py` contains the handler for `POST /v1/default/banks/{bank_id}/import?dry_run=true`, but this does **not** establish the running binary version or authenticated runtime compatibility.
- GitHub template `bank-template.json` blob SHA `8bd00f47ff2b2872108b1e9cb1dd12bcc339ce58` passed 142 offline schema checks, 0 errors.
- Prepared guarded helper: `project-templates/nvvai-autonomous-factory/operator-import.py`, guarded by the exact template blob SHA, localhost-only URL, no redirect forwarding, explicit `--apply`, server dry-run gate and post-import export verification.

## Gate status

| Gate | Current status |
| --- | --- |
| Owner authorization for this scoped import | **APPROVED** |
| Offline template validation | **PASS** |
| Running backend containers | **UP**, DB healthy |
| Current assistant's bank administrator authentication | **BLOCKED**, HTTP 401 |
| Authenticated live `dry_run` | **NOT EXECUTED** |
| Create new `nvvai-autonomous-factory` bank | **NOT EXECUTED** |
| Selective project record migration | **NOT EXECUTED** |
| Old bank modification | **NONE** |
| Docker restart, deployment, merge, secrets exposure | **NONE** |

## Next exact step

From an *existing*, authorized Hindsight administrator session on the VPS, work with the exact GitHub files on branch `feature/nvvai-autonomous-factory-memory-20261108`, preserving their original content:

```text
project-templates/nvvai-autonomous-factory/bank-template.json
project-templates/nvvai-autonomous-factory/operator-import.py
```

Execute the helper first without `--apply` (it only performs authentication, target-existence check and server `dry_run=true`). The helper obtains the authorized admin token interactively from the terminal or locally from `HINDSIGHT_OPERATOR_TOKEN`; never pass the value in the chat, command line, GitHub, logs or shell history. Upon an actual `DRY_RUN=PASS`, rerun the helper with `--apply`, then verify the target bank export and scoped `retain/recall/reflect`. No new sudoers rule or credential harvesting is authorized by this step.

If the operator's existing credentials are not available in the current authenticated session, **stop** and provision a narrowly scoped approved administrator action via the existing Owner workflow; do not bypass HTTP 401.

**Do not classify this checkpoint as successful import or new-bank creation.**
