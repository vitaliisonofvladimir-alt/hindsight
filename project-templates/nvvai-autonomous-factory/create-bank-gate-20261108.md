# NVVAI Autonomous Factory — live creation gate (2026-11-08)

## Intended operation
Create only `nvvai-autonomous-factory` on the existing Hindsight server using the verified pinned bank template `project-templates/nvvai-autonomous-factory/bank-template.json` (Git blob `8bd00f47ff2b2872108b1e9cb1dd12bcc339ce58`). The original `webui-vitalii-private` must remain unchanged.

## Live evidence
- Owner requested project bank creation. Existing earlier approval covers import via approved Hindsight administrator account, not unauthenticated API bypass.
- Gateway SSH server `OVH-VPS` reachable and registered with user `ubuntu`; `ubuntu` is *not* a member of the docker group as observed through `id -nG`.
- Unprivileged Gateway command: `GET http://127.0.0.1:8888/v1/bank-template-schema` => **HTTP 401**.
- Unprivileged Gateway command: `GET http://127.0.0.1:8888/v1/default/banks/nvvai-autonomous-factory/export` => **HTTP 401**. This does NOT prove the bank absent or present.
- Gateway stored-value metadata search: no `hindsight` or `admin` credential references available. Secret values were not accessed or requested.
- Working backend vs repo API version still not reconciled (source in fork main advertises 1.2.0; historical running backend API was 0.10.3). Do not assume template-import API exists in running image.
- The existing GitHub `operator-import.py` is preparatory and has NOT been run.

## Execution gate
- **Bank created:** NO.
- **Authenticated server dry_run:** NOT RUN (authorization failure).
- **Template applied:** NO.
- **Historical memory copied:** NO.
- **Source bank written:** NO.
- **sudo used:** NO.
- **service restart, migration, deployment or Docker changes:** NO.

## Next action
Obtain explicit task-specific Owner permission to use `sudo` on the VPS **for this Hindsight admin bank-creation operation only**. Thereafter inspect running API version without printing secrets, run authenticated server-side dry run if supported, apply ONLY to the target bank, verify separately via authenticated GET/export and project-scoped recall. If the installed Hindsight lacks template import, pause before any upgrade/migration and report the compatibility blocker. Avoid storing keys/tokens in GitHub, chat, process command-line or logs. Keep the original bank immutable.

GitHub code branch: `feature/nvvai-autonomous-factory-memory-20261108`.
