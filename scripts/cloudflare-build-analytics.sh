#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/apps/analytics"

if [ ! -d node_modules ]; then
  npm install
fi

OPENNEXT_CLOUDFLARE=1 npx opennextjs-cloudflare build
