#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$script_dir/common.sh"

site_entry="dist$(review_app_base_path)index.html"
standalone_entry="dist$(review_app_standalone_path)index.html"
jupyterlite_entry="dist$(review_app_jupyterlite_path)index.html"
jupyterlite_lab_entry="dist$(review_app_jupyterlite_path)lab/index.html"

if [ ! -f "$site_entry" ]; then
  echo "review app landing page not found: $site_entry" >&2
  exit 1
fi

if [ ! -f "$standalone_entry" ]; then
  echo "standalone app entrypoint not found: $standalone_entry" >&2
  exit 1
fi

if [ ! -f "$jupyterlite_entry" ] && [ ! -f "$jupyterlite_lab_entry" ]; then
  echo "JupyterLite entrypoint not found under dist$(review_app_jupyterlite_path)" >&2
  exit 1
fi

image_ref=$(review_app_image)
printf 'Review app image: %s\n' "$image_ref" >&2
printf '%s\n' "$image_ref"
