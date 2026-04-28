#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$script_dir/common.sh"

base_path=$(review_app_base_path)
output_dir="dist$base_path"
standalone_output_dir="dist$(review_app_standalone_path)"
jupyterlite_output_dir="dist$(review_app_jupyterlite_path)"
app_dist_dir="app/dist/standalone"
jupyterlite_dist_dir="python-integration/jupyterlite/_output"
landing_page="$script_dir/landing-page.html"

JUPYTERLITE_BASE_URL="$(review_app_jupyterlite_path)" bash ./build.bash

if [ ! -f "$landing_page" ]; then
  echo "review app landing page not found: $landing_page" >&2
  exit 1
fi

if [ ! -f "$app_dist_dir/index.html" ]; then
  echo "standalone app entrypoint not found: $app_dist_dir/index.html" >&2
  exit 1
fi

if [ ! -f "$jupyterlite_dist_dir/index.html" ] && [ ! -f "$jupyterlite_dist_dir/lab/index.html" ]; then
  echo "JupyterLite entrypoint not found under $jupyterlite_dist_dir" >&2
  exit 1
fi

rm -rf dist
mkdir -p "$output_dir" "$standalone_output_dir" "$jupyterlite_output_dir"
cp "$landing_page" "${output_dir}index.html"
cp -R "$app_dist_dir"/. "$standalone_output_dir"/
cp -R "$jupyterlite_dist_dir"/. "$jupyterlite_output_dir"/
