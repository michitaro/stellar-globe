#!/bin/sh

set -eu

node_name="${REVIEW_APP_NODE_NAME:-${KUBERNETES_NODE_NAME:-}}"

if [ -z "$node_name" ]; then
  pod_name="${POD_NAME:-${HOSTNAME:-}}"
  pod_namespace="${POD_NAMESPACE:-${KUBERNETES_NAMESPACE:-}}"

  if [ -z "$pod_namespace" ] && [ -f /var/run/secrets/kubernetes.io/serviceaccount/namespace ]; then
    pod_namespace=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)
  fi

  if [ -n "$pod_name" ] && [ -n "$pod_namespace" ]; then
    node_name=$(kubectl get pod "$pod_name" -n "$pod_namespace" -o jsonpath='{.spec.nodeName}' 2>/dev/null || true)
  fi
fi

address=""
if [ -n "$node_name" ]; then
  address=$(
    kubectl get node "$node_name" -o jsonpath='{range .status.addresses[*]}{.type}={.address}{"\n"}{end}' 2>/dev/null |
      awk -F= '$1 == "InternalIP" { print $2; exit }'
  )
fi

if [ -z "$address" ]; then
  address=$(
    kubectl get nodes -o jsonpath='{range .items[*]}{range .status.addresses[*]}{.type}={.address}{"\n"}{end}{end}' |
      awk -F= '$1 == "InternalIP" { print $2; exit }'
  )
fi

if [ -z "$address" ]; then
  echo "failed to detect a Kubernetes node InternalIP" >&2
  exit 1
fi

printf '%s\n' "$address"
