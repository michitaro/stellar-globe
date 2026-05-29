#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$script_dir/common.sh"

namespace=$(review_app_namespace)
route_name=$(review_app_route_name)
project_name=$(review_app_project_name)
project_path_slug=$(review_app_project_path_slug)
branch_slug=$(review_app_branch_slug)
base_path=$(review_app_base_path)
gateway_namespace=$(review_app_gateway_namespace)
gateway_name=$(review_app_gateway_name)
listener_name=$(review_app_gateway_listener_name)
gateway_address=$(review_app_gateway_address)
base_url=$(review_app_base_url)
environment_url=$(review_app_environment_url)
image=$(review_app_image)
env_file=$(review_app_gitlab_env_file)

route_condition_status() {
  route_namespace=$1
  route_name=$2
  condition_type=$3
  kubectl -n "$route_namespace" get httproute "$route_name" -o jsonpath="{.status.parents[0].conditions[?(@.type==\"${condition_type}\")].status}"
}

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${namespace}
  labels:
    app.kubernetes.io/part-of: ${project_name}
    app.gitlab.com/env: review
    app.gitlab.com/project: ${project_path_slug}
    review-app.branch: ${branch_slug}
EOF

kubectl wait --for=jsonpath='{.status.phase}'=Active "namespace/${namespace}" --timeout=60s

cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: review-app
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: review-app
    app.kubernetes.io/instance: ${branch_slug}
    app.kubernetes.io/part-of: ${project_name}
spec:
  replicas: 1
  revisionHistoryLimit: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: review-app
      app.kubernetes.io/instance: ${branch_slug}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: review-app
        app.kubernetes.io/instance: ${branch_slug}
        app.kubernetes.io/part-of: ${project_name}
      annotations:
        review-app.commit: ${CI_COMMIT_SHA:-local}
        review-app.image: ${image}
    spec:
      containers:
      - name: nginx
        image: ${image}
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 80
        readinessProbe:
          httpGet:
            path: ${base_path}
            port: http
          initialDelaySeconds: 3
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: ${base_path}
            port: http
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: review-app
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: review-app
    app.kubernetes.io/instance: ${branch_slug}
spec:
  selector:
    app.kubernetes.io/name: review-app
    app.kubernetes.io/instance: ${branch_slug}
  ports:
  - name: http
    port: 80
    targetPort: http
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: ${route_name}
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: review-app
    app.kubernetes.io/instance: ${branch_slug}
spec:
  from:
  - group: gateway.networking.k8s.io
    kind: HTTPRoute
    namespace: ${gateway_namespace}
  to:
  - group: ""
    kind: Service
    name: review-app
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: ${route_name}
  namespace: ${gateway_namespace}
  labels:
    app.kubernetes.io/name: review-app
    app.kubernetes.io/instance: ${branch_slug}
spec:
  parentRefs:
  - name: ${gateway_name}
    namespace: ${gateway_namespace}
    sectionName: ${listener_name}
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: ${base_path}
    backendRefs:
    - name: review-app
      namespace: ${namespace}
      port: 80
EOF

kubectl -n "$namespace" delete httproute review-app --ignore-not-found=true
kubectl -n "$namespace" rollout status deployment/review-app --timeout=180s

for _ in $(seq 1 30); do
  accepted=$(route_condition_status "$gateway_namespace" "$route_name" Accepted || true)
  resolved_refs=$(route_condition_status "$gateway_namespace" "$route_name" ResolvedRefs || true)
  if [ "$accepted" = "True" ] && [ "$resolved_refs" = "True" ]; then
    break
  fi
  sleep 2
done

accepted=$(route_condition_status "$gateway_namespace" "$route_name" Accepted || true)
resolved_refs=$(route_condition_status "$gateway_namespace" "$route_name" ResolvedRefs || true)
if [ "$accepted" != "True" ] || [ "$resolved_refs" != "True" ]; then
  kubectl -n "$gateway_namespace" get httproute "$route_name" -o yaml >&2
  kubectl -n "$namespace" get referencegrant "$route_name" -o yaml >&2
  echo "review app HTTPRoute did not become ready" >&2
  exit 1
fi

curl --fail --silent --show-error \
  --retry 10 \
  --retry-all-errors \
  --retry-delay 2 \
  --max-time 20 \
  "$environment_url" >/dev/null

cat > "$env_file" <<EOF
REVIEW_APP_GATEWAY_ADDRESS=${gateway_address}
REVIEW_APP_BASE_URL=${base_url}
REVIEW_APP_ENVIRONMENT_URL=${environment_url}
EOF

printf 'Review app URL: %s\n' "$environment_url"
