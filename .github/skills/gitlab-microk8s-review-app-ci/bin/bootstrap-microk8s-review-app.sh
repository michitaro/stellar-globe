#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
detect_script="$script_dir/detect-k8s-node-internal-ip.sh"

gateway_namespace="${REVIEW_APP_GATEWAY_NAMESPACE:-${BOOTSTRAP_GATEWAY_NAMESPACE:-gateway-test}}"
gateway_name="${REVIEW_APP_GATEWAY_NAME:-${BOOTSTRAP_GATEWAY_NAME:-microk8s-envoy}}"
gateway_class_name="${REVIEW_APP_GATEWAY_CLASS_NAME:-${BOOTSTRAP_GATEWAY_CLASS_NAME:-envoy}}"
listener_name="${REVIEW_APP_GATEWAY_LISTENER_NAME:-${BOOTSTRAP_GATEWAY_LISTENER_NAME:-http}}"
registry_namespace="${REVIEW_APP_REGISTRY_NAMESPACE:-${BOOTSTRAP_REGISTRY_NAMESPACE:-container-registry}}"
registry_service_name="${REVIEW_APP_REGISTRY_SERVICE_NAME:-${BOOTSTRAP_REGISTRY_SERVICE_NAME:-registry}}"
registry_port="${REVIEW_APP_REGISTRY_PORT:-${BOOTSTRAP_REGISTRY_PORT:-32000}}"
env_file="${REVIEW_APP_BOOTSTRAP_ENV_FILE:-${BOOTSTRAP_ENV_FILE:-review-app-bootstrap.env}}"

gateway_address="${REVIEW_APP_GATEWAY_ADDRESS:-${BOOTSTRAP_GATEWAY_ADDRESS:-}}"
if [ -z "$gateway_address" ]; then
  gateway_address=$(sh "$detect_script")
fi

base_url="${REVIEW_APP_BASE_URL:-${BOOTSTRAP_BASE_URL:-}}"
if [ -z "$base_url" ]; then
  base_url="http://${gateway_address}"
fi

image_registry="${REVIEW_APP_IMAGE_REGISTRY:-${BOOTSTRAP_IMAGE_REGISTRY:-}}"
if [ -z "$image_registry" ]; then
  image_registry="${gateway_address}:${registry_port}"
fi

address_block=$(cat <<EOF
  addresses:
  - type: IPAddress
    value: ${gateway_address}
EOF
)

can_manage_microk8s_host() {
  command -v microk8s >/dev/null 2>&1 &&
    command -v sudo >/dev/null 2>&1 &&
    sudo -n true >/dev/null 2>&1
}

ensure_microk8s_registry_host() {
  if ! can_manage_microk8s_host; then
    return
  fi

  config_dir="/var/snap/microk8s/current/args/certs.d/${image_registry}"
  tmp=$(mktemp)
  cat > "$tmp" <<EOF
server = "http://${image_registry}"

[host."http://${image_registry}"]
  capabilities = ["pull", "resolve"]
EOF

  sudo microk8s enable registry >/dev/null
  sudo install -d "$config_dir"

  changed=0
  if ! sudo test -f "$config_dir/hosts.toml"; then
    changed=1
  elif ! sudo cmp -s "$tmp" "$config_dir/hosts.toml"; then
    changed=1
  fi

  if [ "$changed" -eq 1 ]; then
    sudo cp "$tmp" "$config_dir/hosts.toml"
    sudo snap restart microk8s.daemon-containerd >/dev/null
  fi

  rm -f "$tmp"
  sudo microk8s status --wait-ready >/dev/null
}

ensure_microk8s_registry_host

kubectl wait --for=condition=Available "deployment/${registry_service_name}" -n "$registry_namespace" --timeout=180s

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${gateway_namespace}
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${gateway_name}
  namespace: ${gateway_namespace}
spec:
  gatewayClassName: ${gateway_class_name}
${address_block}
  listeners:
  - name: ${listener_name}
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same
EOF

service_ref=""
for _ in $(seq 1 30); do
  service_ref=$(
    kubectl get svc -A \
      -l "gateway.envoyproxy.io/owning-gateway-name=${gateway_name},gateway.envoyproxy.io/owning-gateway-namespace=${gateway_namespace}" \
      -o jsonpath='{.items[0].metadata.namespace} {.items[0].metadata.name}' 2>/dev/null || true
  )
  if [ -n "$service_ref" ]; then
    break
  fi
  sleep 2
done

if [ -z "$service_ref" ]; then
  echo "failed to find Envoy service for gateway ${gateway_namespace}/${gateway_name}" >&2
  exit 1
fi

service_namespace=${service_ref% *}
service_name=${service_ref#* }
kubectl patch svc -n "$service_namespace" "$service_name" --type=merge -p "{\"spec\":{\"externalIPs\":[\"${gateway_address}\"]}}"

cat > "$env_file" <<EOF
BOOTSTRAP_GATEWAY_ADDRESS=${gateway_address}
BOOTSTRAP_BASE_URL=${base_url}
BOOTSTRAP_IMAGE_REGISTRY=${image_registry}
REVIEW_APP_GATEWAY_ADDRESS=${gateway_address}
REVIEW_APP_BASE_URL=${base_url}
REVIEW_APP_IMAGE_REGISTRY=${image_registry}
EOF

printf 'Gateway address: %s\n' "$gateway_address"
printf 'Image registry: %s\n' "$image_registry"
printf 'Bootstrap env file: %s\n' "$env_file"
