#!/usr/bin/env python3
"""Pinned, localhost-only Hindsight template import, operator-initiated.

Defaults to server-side DRY RUN. --apply first dry-runs and refuses to
overwrite an existing bank. Never prints tokens or response headers.
Requires an explicitly authorized Hindsight administrator session.
"""
import argparse
import getpass
import hashlib
import json
import os
from pathlib import Path
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, build_opener, HTTPRedirectHandler

BANK = "nvvai-autonomous-factory"
TEMPLATE_BLOB_SHA1 = "8bd00f47ff2b2872108b1e9cb1dd12bcc339ce58"
TEMPLATE = Path(__file__).resolve().parent / "bank-template.json"
BASE = "http://127.0.0.1:8888"
MODEL_COUNT = 7
DIRECTIVE_COUNT = 6

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

OPENER = build_opener(NoRedirect)

def safe_request(method, path, token, data=None):
    # Nothing is sent to a remote host, shell, or log.
    assert path.startswith("/") and "//" not in path
    headers = {"Authorization": "Bearer " + token, "Accept": "application/json"}
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with OPENER.open(req, timeout=15) as response:
            raw = response.read(2_000_000)
            try:
                payload = json.loads(raw)
            except ValueError:
                payload = None
            return response.status, payload
    except HTTPError as exc:
        # Do not print potentially sensitive server responses.
        exc.close()
        return exc.code, None
    except (URLError, TimeoutError, OSError):
        return 0, None

def main():
    arg = argparse.ArgumentParser(description="Import NVVAI Factory project memory template")
    arg.add_argument("--apply", action="store_true",
                     help="Apply only after an authenticated dry run passes")
    opts = arg.parse_args()
    data = TEMPLATE.read_bytes()
    blob_hash = hashlib.sha1(b"blob " + str(len(data)).encode() + bytes([0]) + data).hexdigest()
    if blob_hash != TEMPLATE_BLOB_SHA1:
        raise SystemExit("BLOCKED: template Git blob SHA mismatch")
    manifest = json.loads(data)
    if manifest.get("version") != "1" or len(manifest.get("mental_models", [])) != MODEL_COUNT or len(manifest.get("directives", [])) != DIRECTIVE_COUNT:
        raise SystemExit("BLOCKED: template structure mismatch")
    if len({m["id"] for m in manifest["mental_models"]}) != MODEL_COUNT or len({d["name"] for d in manifest["directives"]}) != DIRECTIVE_COUNT:
        raise SystemExit("BLOCKED: duplicate template identities")

    token = os.getenv("HINDSIGHT_OPERATOR_TOKEN") or getpass.getpass("Existing authorized Hindsight admin token (not echoed): ")
    if not token.strip():
        raise SystemExit("BLOCKED: no authorized admin session")
    status, schema = safe_request("GET", "/v1/bank-template-schema", token)
    print("AUTHENTICATED_SCHEMA_HTTP=" + str(status))
    if status != 200 or not isinstance(schema, dict) or "properties" not in schema:
        raise SystemExit("BLOCKED: running server schema unavailable; no writes")

    target = "/v1/default/banks/" + BANK
    status, _ = safe_request("GET", target + "/export", token)
    print("TARGET_EXPORT_HTTP=" + str(status))
    if status == 200:
        raise SystemExit("BLOCKED: bank already exists; refusing overwrite")
    if status != 404:
        raise SystemExit("BLOCKED: cannot prove target bank absent")

    status, result = safe_request("POST", target + "/import?dry_run=true", token, data)
    print("SERVER_DRY_RUN_HTTP=" + str(status))
    if status != 200 or not isinstance(result, dict) or result.get("dry_run") is not True or result.get("bank_id") != BANK:
        raise SystemExit("BLOCKED: authenticated server dry_run did not pass")
    models = set(result.get("mental_models_created", []))
    directives = set(result.get("directives_created", []))
    if models != {m["id"] for m in manifest["mental_models"]} or directives != {d["name"] for d in manifest["directives"]}:
        raise SystemExit("BLOCKED: dry_run identities do not match manifest")
    print("DRY_RUN=PASS MODELS=7 DIRECTIVES=6")
    if not opts.apply:
        print("APPLY=NOT_REQUESTED; NO_CHANGES")
        return

    # Fail closed on target races: a fresh existence check immediately before import.
    status, _ = safe_request("GET", target + "/export", token)
    if status != 404:
        raise SystemExit("BLOCKED: target changed since dry_run")
    status, result = safe_request("POST", target + "/import", token, data)
    print("IMPORT_HTTP=" + str(status))
    if status != 200 or not isinstance(result, dict) or result.get("bank_id") != BANK:
        raise SystemExit("BLOCKED: import unconfirmed")
    status, exported = safe_request("GET", target + "/export", token)
    if status != 200 or not isinstance(exported, dict):
        raise SystemExit("BLOCKED: post-import verification failed")
    actual_models = {m.get("id") for m in exported.get("mental_models", [])}
    actual_directives = {d.get("name") for d in exported.get("directives", [])}
    if actual_models != models or actual_directives != directives:
        raise SystemExit("BLOCKED: post-import entities differ")
    print("IMPORT=VERIFIED BANK=" + BANK + " MODELS=7 DIRECTIVES=6")
    print("SOURCE_BANK=NOT_ACCESSED; NO_MERGE_NO_DEPLOY_NO_RESTART")

if __name__ == "__main__":
    try:
        main()
    except (KeyError, ValueError, OSError) as exc:
        print("BLOCKED: " + type(exc).__name__, file=sys.stderr)
        sys.exit(1)
