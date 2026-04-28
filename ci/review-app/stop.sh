#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$script_dir/common.sh"

namespace=$(review_app_namespace)

kubectl delete namespace "$namespace" --ignore-not-found=true --wait=false
