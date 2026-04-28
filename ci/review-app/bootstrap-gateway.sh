#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$script_dir/common.sh"

exec sh "$(review_app_skill_bin_dir)/bootstrap-microk8s-review-app.sh"
