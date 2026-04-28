#!/bin/sh

set -eu

review_app_project_name() {
  printf '%s\n' "${CI_PROJECT_NAME:-app}"
}

review_app_project_path_slug() {
  printf '%s\n' "${CI_PROJECT_PATH_SLUG:-$(review_app_project_name)}"
}

review_app_branch_slug() {
  printf '%s\n' "${CI_COMMIT_REF_SLUG:-local}"
}

review_app_base_path() {
  if [ -n "${REVIEW_APP_BASE_PATH:-}" ]; then
    printf '%s\n' "$REVIEW_APP_BASE_PATH"
    return
  fi

  printf '/review-apps/%s/%s/\n' "$(review_app_project_name)" "$(review_app_branch_slug)"
}

review_app_standalone_path() {
  printf '%sstandalone/\n' "$(review_app_base_path)"
}

review_app_jupyterlite_path() {
  printf '%sjupyterlite/\n' "$(review_app_base_path)"
}

review_app_jupyterlite_e2e_report_path() {
  printf '%sjupyterlite-e2e/\n' "$(review_app_base_path)"
}

review_app_docs_path() {
  printf '%sdocs/\n' "$(review_app_base_path)"
}

review_app_skill_bin_dir() {
  printf '%s\n' "$script_dir/../../.github/skills/gitlab-microk8s-review-app-ci/bin"
}

review_app_detect_node_ip() {
  skill_bin_dir=$(review_app_skill_bin_dir)
  detect_script="$skill_bin_dir/detect-k8s-node-internal-ip.sh"

  if [ ! -f "$detect_script" ] || ! command -v kubectl >/dev/null 2>&1; then
    echo "review app node IP auto-detection is unavailable; set REVIEW_APP_GATEWAY_ADDRESS" >&2
    exit 1
  fi

  sh "$detect_script"
}

review_app_base_url() {
  if [ -n "${REVIEW_APP_BASE_URL:-}" ]; then
    printf '%s\n' "$REVIEW_APP_BASE_URL"
    return
  fi

  printf 'http://%s\n' "$(review_app_gateway_address)"
}

review_app_environment_url() {
  base_url=$(review_app_base_url)
  base_path=$(review_app_base_path)

  printf '%s%s\n' "${base_url%/}" "$base_path"
}

review_app_namespace() {
  if [ -n "${REVIEW_APP_NAMESPACE:-}" ]; then
    printf '%s\n' "$REVIEW_APP_NAMESPACE"
    return
  fi

  base_name="review-$(review_app_project_name)-$(review_app_branch_slug)"
  normalized=$(
    printf '%s' "$base_name" |
      tr '[:upper:]' '[:lower:]' |
      sed 's/[^a-z0-9-]/-/g; s/--*/-/g; s/^-//; s/-$//'
  )
  checksum=$(printf '%s' "$normalized" | cksum | awk '{print $1}')
  prefix=$(printf '%.52s' "$normalized" | sed 's/-$//')
  truncated=$(printf '%s-%s' "$prefix" "$checksum" | cut -c1-63 | sed 's/-$//')

  printf '%s\n' "$truncated"
}

review_app_gateway_namespace() {
  printf '%s\n' "${REVIEW_APP_GATEWAY_NAMESPACE:-gateway-test}"
}

review_app_gateway_name() {
  printf '%s\n' "${REVIEW_APP_GATEWAY_NAME:-microk8s-envoy}"
}

review_app_gateway_class_name() {
  printf '%s\n' "${REVIEW_APP_GATEWAY_CLASS_NAME:-envoy}"
}

review_app_gateway_listener_name() {
  printf '%s\n' "${REVIEW_APP_GATEWAY_LISTENER_NAME:-http}"
}

review_app_gateway_address() {
  if [ -n "${REVIEW_APP_GATEWAY_ADDRESS:-}" ]; then
    printf '%s\n' "$REVIEW_APP_GATEWAY_ADDRESS"
    return
  fi

  review_app_detect_node_ip
}

review_app_registry_port() {
  printf '%s\n' "${REVIEW_APP_REGISTRY_PORT:-32000}"
}

review_app_image_registry() {
  if [ -n "${REVIEW_APP_IMAGE_REGISTRY:-}" ]; then
    printf '%s\n' "$REVIEW_APP_IMAGE_REGISTRY"
    return
  fi

  printf '%s:%s\n' "$(review_app_gateway_address)" "$(review_app_registry_port)"
}

review_app_image_repository() {
  if [ -n "${REVIEW_APP_IMAGE_REPOSITORY:-}" ]; then
    printf '%s\n' "$REVIEW_APP_IMAGE_REPOSITORY"
    return
  fi

  printf 'review-apps/%s\n' "$(review_app_project_path_slug)"
}

review_app_image_tag() {
  printf '%s\n' "${REVIEW_APP_IMAGE_TAG:-${CI_COMMIT_SHA:-local}}"
}

review_app_image() {
  if [ -n "${REVIEW_APP_IMAGE:-}" ]; then
    printf '%s\n' "$REVIEW_APP_IMAGE"
    return
  fi

  printf '%s/%s:%s\n' \
    "$(review_app_image_registry)" \
    "$(review_app_image_repository)" \
    "$(review_app_image_tag)"
}

review_app_registry_namespace() {
  printf '%s\n' "${REVIEW_APP_REGISTRY_NAMESPACE:-container-registry}"
}

review_app_registry_service_name() {
  printf '%s\n' "${REVIEW_APP_REGISTRY_SERVICE_NAME:-registry}"
}

review_app_bootstrap_env_file() {
  printf '%s\n' "${REVIEW_APP_BOOTSTRAP_ENV_FILE:-review-app-bootstrap.env}"
}

review_app_gitlab_env_file() {
  printf '%s\n' "${REVIEW_APP_GITLAB_ENV_FILE:-review-app.env}"
}
