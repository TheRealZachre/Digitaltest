#!/usr/bin/env bash
# Deploy the analytics-only app to Cloudflare Workers (separate URL from main app).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

load_secret() {
  if [ -n "${AUTH_SECRET:-}" ]; then
    return 0
  fi
  if [ -n "${NEXTAUTH_SECRET:-}" ]; then
    AUTH_SECRET="$NEXTAUTH_SECRET"
    export AUTH_SECRET
    return 0
  fi
  if [ -f "$root/.dev.vars" ]; then
    # shellcheck disable=SC1091
    set -a
    source "$root/.dev.vars"
    set +a
  fi
}

load_secret

deploy_args=()

if [ -n "${AUTH_SECRET:-}" ]; then
  secrets_file="$(mktemp)"
  trap 'rm -f "$secrets_file"' EXIT
  printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET" > "$secrets_file"
  deploy_args+=(--secrets-file "$secrets_file")
  echo "Uploading AUTH_SECRET with wrangler deploy (analytics)..."
elif [ "${WORKERS_CI:-}" = "1" ]; then
  cat >&2 <<'EOF'

ERROR: AUTH_SECRET is not available for analytics deploy.

Set AUTH_SECRET in Cloudflare dashboard for worker "digitaltest-analytics"
(Settings → Variables and Secrets), using the same value as the main app.

EOF
  exit 1
else
  echo "WARNING: AUTH_SECRET not set — analytics deploy may fail login."
fi

cd "$root/apps/analytics"
exec npx wrangler deploy "${deploy_args[@]}"
