#!/usr/bin/env bash
set -euo pipefail

bash scripts/cloudflare-build-analytics.sh
bash scripts/cloudflare-deploy-analytics.sh
