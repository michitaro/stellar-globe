#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(cd "${script_dir}/.." && pwd)"
port="${PORT:-8000}"
raw_base_url="${JUPYTERLITE_E2E_BASE_URL:-http://127.0.0.1:${port}/}"
base_url="${raw_base_url%/}/"
base_path="${base_url#http://}"
base_path="${base_path#https://}"
base_path="/${base_path#*/}"
server_log="$(mktemp)"
server_root="$(mktemp -d)"

cleanup() {
  if [[ -n "${server_pid:-}" ]]; then
    kill "${server_pid}" 2>/dev/null || true
    wait "${server_pid}" 2>/dev/null || true
  fi
  rm -f "${server_log}"
  rm -rf "${server_root}"
}

trap cleanup EXIT

cd "${project_dir}"
if [[ "${base_path}" == "/" ]]; then
  cp -R ./_output/. "${server_root}/"
else
  mount_path="${server_root}${base_path%/}"
  mkdir -p "$(dirname "${mount_path}")"
  cp -R ./_output "${mount_path}"
fi

(cd "${server_root}" && npx static-handler --port "${port}" --coi) >"${server_log}" 2>&1 &
server_pid=$!

for _ in $(seq 1 60); do
  if curl --silent --fail "${base_url}lab/index.html" >/dev/null; then
    test_status=0
    PLAYWRIGHT_SKIP_WEBSERVER=1 PORT="${port}" JUPYTERLITE_E2E_BASE_URL="${base_url}" npx playwright test || test_status=$?
    node ./scripts/annotate-playwright-report.mjs
    exit "${test_status}"
  fi
  sleep 1
done

cat "${server_log}"
exit 1
