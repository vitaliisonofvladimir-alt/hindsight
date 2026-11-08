# Hindsight Control Plane: NVVAI GitHub navbar link checkpoint

Date: 2026-11-08 (Europe/Kyiv)
Request: replace the GitHub header action in `https://hindsight.nvvai.site`, currently pointing at upstream `https://github.com/vectorize-io/hindsight`, with the owner's own fork: `https://github.com/vitaliisonofvladimir-alt/hindsight`.

## Verified source change

- Repository: `vitaliisonofvladimir-alt/hindsight`
- Narrowly scoped branch based on `main`: `fix/nvvai-own-github-navbar-20261108`
- Exact file: `hindsight-control-plane/src/components/bank-selector.tsx`
- Existing source blob before edit: `8866412206cd9f3f483dd5af53f16ec8340b1a0e`
- Source-only commit: `52fb11631899c4eb00871e837b40a91059a3283a`
- After-edit blob: `3683c68a90b9b31c497bb93bdb24b778535414a1`
- Changed exactly 3 `href` strings, all originally `https://github.com/vectorize-io/hindsight`; new `href` in all 3 positions is `https://github.com/vitaliisonofvladimir-alt/hindsight`.
- Positions: phone dropdown, regular desktop navigation link, alternate navbar variant.
- Exact string validation against fetched GitHub blob: `old_link_count=0`, `new_link_count=3`, `only_changed=true`, postwrite content verification PASS.
- GitHub source URL: `https://github.com/vitaliisonofvladimir-alt/hindsight/blob/fix/nvvai-own-github-navbar-20261108/hindsight-control-plane/src/components/bank-selector.tsx`.

## Explicit boundaries and next step

- This is a **source-only** change on an isolated branch; it is NOT deployed. Browser at `hindsight.nvvai.site` will continue pointing upstream until the frontend is rebuilt/deployed.
- No merge, production rebuild/restart, service edit, API or memory change. No sudo executed for this task.
- Do **not** treat the existing unrelated approval for sudo during Hindsight bank creation as approval for Control Plane deployment.
- Next: obtain separate explicit Owner approval for controlled Hindsight Control Plane build/deployment and any necessary restart, with staging smoke test, rollback path, and verification on both desktop/mobile. The old memory bank `webui-vitalii-private` and intended project bank `nvvai-autonomous-factory` are outside this UI change.
- Project bank Hindsight write was not done because a verified scoped connector to the target bank is not yet available and original memory must remain untouched. Retain this checkpoint to the project bank once it is established.
