#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "このスクリプトは Linux の host network 前提です。" >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(cd "${script_dir}/.." && pwd)"
port="${PORT:-8000}"
playwright_image="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.58.2-noble}"
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
make rebuild
(cd ./_output && npx static-handler --port "${port}" --coi) >"${server_log}" 2>&1 &
server_pid=$!

for _ in $(seq 1 60); do
  if curl --silent --fail "http://127.0.0.1:${port}/lab/index.html" >/dev/null; then
    docker run --rm --init --ipc=host --network host \
      --user "$(id -u):$(id -g)" \
      -e HOME=/tmp \
      -e CI=1 \
      -e PORT="${port}" \
      -e PLAYWRIGHT_SKIP_WEBSERVER=1 \
      -v "${project_dir}:/work" \
      -w /work \
      "${playwright_image}" \
      /bin/bash -lc "npm ci && npx playwright test"
    exit 0
  fi
  sleep 1
done

cat "${server_log}"
exit 1
