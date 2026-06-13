#!/usr/bin/env bash
# Deploy to Cloudflare Workers. Uploads AUTH_SECRET when present in the environment
# (Workers Builds → Settings → Builds → Build variables and secrets → Secret).
set -euo pipefail

deploy_args=()

if [ -n "${AUTH_SECRET:-}" ]; then
  secrets_file="$(mktemp)"
  trap 'rm -f "$secrets_file"' EXIT
  printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET" > "$secrets_file"
  deploy_args+=(--secrets-file "$secrets_file")
fi

exec npx wrangler deploy "${deploy_args[@]}"
