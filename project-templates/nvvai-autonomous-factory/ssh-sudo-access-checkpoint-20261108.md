# NVVAI Autonomous Factory — SSH/sudo access policy checkpoint

Date: 2026-11-08 (Europe/Kyiv)
Scope: owner's OVH VPS; **read-only access validation only**.

## Verified current state

- Gateway SSH already has a ready registered server named `OVH-VPS`, user `ubuntu`.
- Gateway `request_sudo_access` reported `state=already_passwordless` and `sudoAccessSaved=false`; no setup link action or sudo change required.
- Authenticated Gateway non-privileged command `sudo -n -l` succeeded (exit 0) and explicitly returned `(ALL) NOPASSWD: ALL` for `ubuntu`.
- This verifies passwordless unrestricted sudo authorization is **already present**; it does not grant permission to perform privileged actions without the owner's approval.
- Gateway is configured for **direct public SSH** access rather than Tailscale; Tailscale on the VPS was independently confirmed active at `100.69.222.41`, but the Gateway route has not been switched.
- Existing `nvvai-mcp` SSH Direct default profile remains a separate restricted profile and was not modified.
- No privilege-bearing command was executed: `sudo -n -l` only listed sudo privileges, and `request_sudo_access` checked auth; no configuration changed.

## Owner-requested operating protocol

1. Prefer non-privileged read-only operations wherever possible.
2. Before any sudo command or root-context operation, **describe exact task, target, command's intended effect, and risk and request the owner's explicit permission for that operation**.
3. No automatic root session, no permission inference from the fact that `NOPASSWD: ALL` exists.
4. Merge, deployment to production, service restart, deletion, and database migrations require distinct, explicit approval.
5. Avoid storing root credentials, SSH private keys, tokens, personal secrets or environment values in GitHub or memory.
6. No permanent sudoers changes, new SSH identity, root login, restart or Tailscale routing change is authorized by this checkpoint.

## Next step

For the approved Hindsight bank-import workflow, obtain explicit approval **to use sudo for the particular admin import task**, then run the authenticated live dry-run, verify it, apply only to new bank `nvvai-autonomous-factory` and selectively copy verified project knowledge. Do not modify `webui-vitalii-private`.

**Hindsight bank write:** not performed because the currently connected memory plugin targets the old bank and the user directed that original bank remain unchanged. Carry this GitHub checkpoint into the new project bank after that bank has been created and authorized.
