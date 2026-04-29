#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(cd "${script_dir}/.." && pwd)"
port="${PORT:-8000}"
server_log="$(mktemp)"

cleanup() {
  if [[ -n "${server_pid:-}" ]]; then
    kill "${server_pid}" 2>/dev/null || true
    wait "${server_pid}" 2>/dev/null || true
  fi
  rm -f "${server_log}"
}

trap cleanup EXIT

cd "${project_dir}"
(cd ./_output && npx static-handler --port "${port}" --coi) >"${server_log}" 2>&1 &
server_pid=$!

for _ in $(seq 1 60); do
  if curl --silent --fail "http://127.0.0.1:${port}/lab/index.html" >/dev/null; then
    test_status=0
    PLAYWRIGHT_SKIP_WEBSERVER=1 PORT="${port}" npx playwright test || test_status=$?
    node ./scripts/annotate-playwright-report.mjs
    exit "${test_status}"
  fi
  sleep 1
done

cat "${server_log}"
exit 1
