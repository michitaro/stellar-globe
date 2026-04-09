#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

CONFIG_FILENAME = "dependency-freshness.json"
SKIP_DIR_NAMES = {
    ".git",
    ".venv",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "htmlcov",
    "node_modules",
}
JS_DEPENDENCY_FIELDS = (
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
)
LOCAL_JS_SPEC_PREFIXES = ("file:", "link:", "portal:", "workspace:")
UNSUPPORTED_JS_SPEC_PREFIXES = ("git:", "git+", "github:", "http:", "https:", "patch:")


class PolicyError(Exception):
    pass


@dataclass(frozen=True)
class PolicyConfig:
    minimum_release_age_days: int


@dataclass(frozen=True)
class DependencyRecord:
    ecosystem: str
    project_root: Path
    dependency_kind: str
    name: str
    version: str
    published_at: datetime


@dataclass(frozen=True)
class Violation:
    record: DependencyRecord
    age_days: float
    minimum_release_age_days: int


class NpmRegistryClient:
    def __init__(self) -> None:
        self._metadata_cache: dict[str, dict[str, Any]] = {}

    def fetch_publish_time(self, package_name: str, version: str) -> datetime:
        metadata = self._metadata_cache.get(package_name)
        if metadata is None:
            package_path = urllib.parse.quote(package_name, safe="")
            url = f"https://registry.npmjs.org/{package_path}"
            try:
                with urllib.request.urlopen(url) as response:
                    metadata = json.load(response)
            except urllib.error.URLError as exc:
                raise PolicyError(
                    f"npm registry metadata could not be fetched for {package_name}: {exc}"
                ) from exc
            self._metadata_cache[package_name] = metadata

        time_map = metadata.get("time", {})
        publish_time = time_map.get(version)
        if publish_time is None:
            raise PolicyError(
                f"publish time for npm package {package_name}@{version} was not found"
            )

        return parse_timestamp(publish_time)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check that repository dependencies are older than the configured minimum age."
    )
    parser.add_argument(
        "--project-root",
        type=Path,
        help="Only check the specified project directory.",
    )
    parser.add_argument(
        "--repo-root",
        type=Path,
        help="Repository root. If omitted, it is discovered automatically.",
    )
    parser.add_argument(
        "--min-age-days",
        type=int,
        help="Override the configured minimum release age in days.",
    )
    return parser.parse_args()


def parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def format_timestamp(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def normalize_python_package_name(name: str) -> str:
    return re.sub(r"[-_.]+", "-", name).lower()


def discover_repo_root(start_path: Path) -> Path:
    current = start_path.resolve()
    if current.is_file():
        current = current.parent

    for candidate in (current, *current.parents):
        if (candidate / CONFIG_FILENAME).is_file():
            return candidate

    for candidate in (current, *current.parents):
        if (candidate / ".git").exists():
            return candidate

    raise PolicyError(f"repository root could not be discovered from {start_path}")


def load_policy_config(repo_root: Path, minimum_release_age_days: int | None) -> PolicyConfig:
    config_path = repo_root / CONFIG_FILENAME
    if not config_path.is_file():
        raise PolicyError(f"{CONFIG_FILENAME} was not found under {repo_root}")

    with config_path.open("rb") as file:
        raw_config = json.load(file)

    configured_days = raw_config.get("minimumReleaseAgeDays")
    if not isinstance(configured_days, int) or configured_days <= 0:
        raise PolicyError(
            f"{CONFIG_FILENAME} must contain a positive integer minimumReleaseAgeDays"
        )

    return PolicyConfig(
        minimum_release_age_days=minimum_release_age_days or configured_days
    )


def should_skip_path(path: Path) -> bool:
    return any(part in SKIP_DIR_NAMES for part in path.parts)


def discover_project_roots(repo_root: Path) -> list[Path]:
    project_roots: set[Path] = set()

    for package_json in repo_root.rglob("package.json"):
        if should_skip_path(package_json):
            continue
        project_root = package_json.parent
        if (project_root / "package-lock.json").is_file() or (project_root / "yarn.lock").is_file():
            project_roots.add(project_root)

    for pyproject_toml in repo_root.rglob("pyproject.toml"):
        if should_skip_path(pyproject_toml):
            continue
        project_root = pyproject_toml.parent
        if (project_root / "uv.lock").is_file():
            project_roots.add(project_root)

    return sorted(project_roots)


def iter_manifest_dependency_specs(
    package_data: dict[str, Any],
) -> list[tuple[str, str, str]]:
    dependencies: list[tuple[str, str, str]] = []
    for dependency_kind in JS_DEPENDENCY_FIELDS:
        raw_dependencies = package_data.get(dependency_kind, {})
        if not isinstance(raw_dependencies, dict):
            continue
        for name, spec in raw_dependencies.items():
            if isinstance(spec, str):
                dependencies.append((dependency_kind, name, spec))
    return dependencies


def classify_js_spec(spec: str) -> str:
    if spec.startswith(LOCAL_JS_SPEC_PREFIXES):
        return "local"
    if spec.startswith(UNSUPPORTED_JS_SPEC_PREFIXES):
        return "unsupported"
    if spec.startswith("npm:"):
        return "registry-alias"
    if spec.startswith(("./", "../", "/")):
        return "local"
    return "registry"


def resolve_package_lock_version(lock_data: dict[str, Any], dependency_name: str) -> str | None:
    packages = lock_data.get("packages", {})
    if isinstance(packages, dict):
        package_entry = packages.get(f"node_modules/{dependency_name}")
        if isinstance(package_entry, dict):
            version = package_entry.get("version")
            if isinstance(version, str):
                return version

    dependencies = lock_data.get("dependencies", {})
    if isinstance(dependencies, dict):
        dependency_entry = dependencies.get(dependency_name)
        if isinstance(dependency_entry, dict):
            version = dependency_entry.get("version")
            if isinstance(version, str):
                return version

    return None


def strip_wrapped_quotes(value: str) -> str:
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    return value


def parse_yarn_lock_versions(lock_text: str) -> dict[str, str]:
    versions: dict[str, str] = {}
    current_selectors: list[str] = []

    for raw_line in lock_text.splitlines():
        line = raw_line.rstrip()
        if not line or line.startswith("#"):
            continue

        if not line.startswith(" "):
            if not line.endswith(":"):
                raise PolicyError(f"unexpected yarn.lock header: {line}")
            header = strip_wrapped_quotes(line[:-1].strip())
            current_selectors = [selector.strip() for selector in header.split(", ") if selector.strip()]
            continue

        if line.startswith("  version: "):
            version = strip_wrapped_quotes(line.split(": ", 1)[1].strip())
            for selector in current_selectors:
                versions[selector] = version

    return versions


def resolve_yarn_version(
    selector_to_version: dict[str, str], dependency_name: str, spec: str
) -> str | None:
    candidates = [f"{dependency_name}@npm:{spec}"]
    if spec.startswith("npm:"):
        candidates.append(f"{dependency_name}@{spec}")

    for candidate in candidates:
        version = selector_to_version.get(candidate)
        if version is not None:
            return version

    return None


def collect_package_lock_dependency_records(
    project_root: Path, npm_registry: NpmRegistryClient
) -> list[DependencyRecord]:
    with (project_root / "package.json").open("r", encoding="utf-8") as file:
        package_data = json.load(file)
    with (project_root / "package-lock.json").open("r", encoding="utf-8") as file:
        lock_data = json.load(file)

    records: list[DependencyRecord] = []
    seen: set[tuple[str, str]] = set()

    for dependency_kind, dependency_name, spec in iter_manifest_dependency_specs(package_data):
        spec_type = classify_js_spec(spec)
        if spec_type == "local":
            continue
        if spec_type == "unsupported":
            raise PolicyError(
                f"unsupported npm dependency spec for {dependency_name}: {spec}"
            )

        resolved_version = resolve_package_lock_version(lock_data, dependency_name)
        if resolved_version is None:
            raise PolicyError(
                f"{dependency_name} is declared in package.json but not resolved in package-lock.json"
            )

        key = (dependency_name, resolved_version)
        if key in seen:
            continue
        seen.add(key)

        records.append(
            DependencyRecord(
                ecosystem="npm",
                project_root=project_root,
                dependency_kind=dependency_kind,
                name=dependency_name,
                version=resolved_version,
                published_at=npm_registry.fetch_publish_time(
                    dependency_name, resolved_version
                ),
            )
        )

    return records


def collect_yarn_dependency_records(
    project_root: Path, npm_registry: NpmRegistryClient
) -> list[DependencyRecord]:
    with (project_root / "package.json").open("r", encoding="utf-8") as file:
        package_data = json.load(file)
    selector_to_version = parse_yarn_lock_versions(
        (project_root / "yarn.lock").read_text(encoding="utf-8")
    )

    records: list[DependencyRecord] = []
    seen: set[tuple[str, str]] = set()

    for dependency_kind, dependency_name, spec in iter_manifest_dependency_specs(package_data):
        spec_type = classify_js_spec(spec)
        if spec_type == "local":
            continue
        if spec_type == "unsupported":
            raise PolicyError(
                f"unsupported yarn dependency spec for {dependency_name}: {spec}"
            )

        resolved_version = resolve_yarn_version(selector_to_version, dependency_name, spec)
        if resolved_version is None:
            raise PolicyError(
                f"{dependency_name}@{spec} is declared in package.json but not resolved in yarn.lock"
            )

        key = (dependency_name, resolved_version)
        if key in seen:
            continue
        seen.add(key)

        records.append(
            DependencyRecord(
                ecosystem="yarn",
                project_root=project_root,
                dependency_kind=dependency_kind,
                name=dependency_name,
                version=resolved_version,
                published_at=npm_registry.fetch_publish_time(
                    dependency_name, resolved_version
                ),
            )
        )

    return records


def select_package_publish_time(package_entry: dict[str, Any]) -> datetime | None:
    timestamps: list[datetime] = []

    sdist = package_entry.get("sdist")
    if isinstance(sdist, dict):
        upload_time = sdist.get("upload-time")
        if isinstance(upload_time, str):
            timestamps.append(parse_timestamp(upload_time))

    wheels = package_entry.get("wheels", [])
    if isinstance(wheels, list):
        for wheel in wheels:
            if not isinstance(wheel, dict):
                continue
            upload_time = wheel.get("upload-time")
            if isinstance(upload_time, str):
                timestamps.append(parse_timestamp(upload_time))

    if not timestamps:
        return None

    return min(timestamps)


def build_uv_publish_index(
    packages: list[dict[str, Any]],
) -> dict[str, dict[str, datetime]]:
    publish_index: dict[str, dict[str, datetime]] = {}

    for package_entry in packages:
        if not isinstance(package_entry, dict):
            continue
        source = package_entry.get("source")
        if not isinstance(source, dict) or "registry" not in source:
            continue
        name = package_entry.get("name")
        version = package_entry.get("version")
        if not isinstance(name, str) or not isinstance(version, str):
            continue

        publish_time = select_package_publish_time(package_entry)
        if publish_time is None:
            continue

        normalized_name = normalize_python_package_name(name)
        versions = publish_index.setdefault(normalized_name, {})
        current = versions.get(version)
        if current is None or publish_time < current:
            versions[version] = publish_time

    return publish_index


def find_root_uv_package(
    pyproject_data: dict[str, Any], packages: list[dict[str, Any]]
) -> dict[str, Any]:
    project = pyproject_data.get("project")
    if not isinstance(project, dict):
        raise PolicyError("pyproject.toml is missing [project]")

    project_name = project.get("name")
    if not isinstance(project_name, str):
        raise PolicyError("pyproject.toml is missing project.name")

    normalized_project_name = normalize_python_package_name(project_name)
    for package_entry in packages:
        if not isinstance(package_entry, dict):
            continue
        name = package_entry.get("name")
        source = package_entry.get("source")
        if not isinstance(name, str) or not isinstance(source, dict):
            continue
        if normalize_python_package_name(name) != normalized_project_name:
            continue
        if "editable" in source or "virtual" in source:
            return package_entry

    raise PolicyError(
        f"root package entry for {project_name} was not found in uv.lock"
    )


def iter_uv_direct_dependencies(
    root_package: dict[str, Any],
) -> list[tuple[str, dict[str, Any]]]:
    dependencies: list[tuple[str, dict[str, Any]]] = []

    raw_dependencies = root_package.get("dependencies", [])
    if isinstance(raw_dependencies, list):
        for dependency in raw_dependencies:
            if isinstance(dependency, dict):
                dependencies.append(("dependencies", dependency))

    optional_dependencies = root_package.get("optional-dependencies", {})
    if isinstance(optional_dependencies, dict):
        for group_name, entries in optional_dependencies.items():
            if not isinstance(entries, list):
                continue
            for dependency in entries:
                if isinstance(dependency, dict):
                    dependencies.append((f"optional:{group_name}", dependency))

    dev_dependencies = root_package.get("dev-dependencies", {})
    if isinstance(dev_dependencies, dict):
        for group_name, entries in dev_dependencies.items():
            if not isinstance(entries, list):
                continue
            for dependency in entries:
                if isinstance(dependency, dict):
                    dependencies.append((f"dev:{group_name}", dependency))

    return dependencies


def collect_uv_dependency_records(project_root: Path) -> list[DependencyRecord]:
    with (project_root / "pyproject.toml").open("rb") as file:
        pyproject_data = tomllib.load(file)
    with (project_root / "uv.lock").open("rb") as file:
        uv_lock_data = tomllib.load(file)

    packages = uv_lock_data.get("package")
    if not isinstance(packages, list):
        raise PolicyError("uv.lock is missing package entries")

    publish_index = build_uv_publish_index(packages)
    root_package = find_root_uv_package(pyproject_data, packages)

    records: list[DependencyRecord] = []
    seen: set[tuple[str, str]] = set()

    for dependency_kind, dependency in iter_uv_direct_dependencies(root_package):
        source = dependency.get("source")
        if isinstance(source, dict) and (
            "editable" in source or "virtual" in source or "path" in source
        ):
            continue

        dependency_name = dependency.get("name")
        if not isinstance(dependency_name, str):
            continue

        normalized_name = normalize_python_package_name(dependency_name)
        resolved_versions: list[str] = []

        version = dependency.get("version")
        if isinstance(version, str):
            resolved_versions = [version]
        else:
            resolved_versions = sorted(publish_index.get(normalized_name, {}).keys())

        if not resolved_versions:
            raise PolicyError(
                f"resolved version for Python dependency {dependency_name} was not found in uv.lock"
            )

        for resolved_version in resolved_versions:
            publish_time = publish_index.get(normalized_name, {}).get(resolved_version)
            if publish_time is None:
                raise PolicyError(
                    f"publish time for Python dependency {dependency_name}@{resolved_version} was not found in uv.lock"
                )

            key = (normalized_name, resolved_version)
            if key in seen:
                continue
            seen.add(key)

            records.append(
                DependencyRecord(
                    ecosystem="uv",
                    project_root=project_root,
                    dependency_kind=dependency_kind,
                    name=dependency_name,
                    version=resolved_version,
                    published_at=publish_time,
                )
            )

    return records


def collect_project_dependency_records(
    project_root: Path, npm_registry: NpmRegistryClient
) -> list[DependencyRecord]:
    records: list[DependencyRecord] = []
    supported = False

    if (project_root / "package.json").is_file():
        if (project_root / "package-lock.json").is_file():
            supported = True
            records.extend(collect_package_lock_dependency_records(project_root, npm_registry))
        elif (project_root / "yarn.lock").is_file():
            supported = True
            records.extend(collect_yarn_dependency_records(project_root, npm_registry))
        else:
            raise PolicyError("package.json exists but no supported JavaScript lockfile was found")

    if (project_root / "pyproject.toml").is_file():
        if (project_root / "uv.lock").is_file():
            supported = True
            records.extend(collect_uv_dependency_records(project_root))
        else:
            raise PolicyError("pyproject.toml exists but uv.lock was not found")

    if not supported:
        raise PolicyError("no supported dependency definition was found")

    return records


def find_violations(
    records: list[DependencyRecord],
    minimum_release_age_days: int,
    now: datetime,
) -> list[Violation]:
    violations: list[Violation] = []
    minimum_age_seconds = minimum_release_age_days * 24 * 60 * 60

    for record in records:
        age_seconds = (now - record.published_at).total_seconds()
        if age_seconds < minimum_age_seconds:
            violations.append(
                Violation(
                    record=record,
                    age_days=age_seconds / (24 * 60 * 60),
                    minimum_release_age_days=minimum_release_age_days,
                )
            )

    return violations


def format_project_root(repo_root: Path, project_root: Path) -> str:
    try:
        return str(project_root.relative_to(repo_root))
    except ValueError:
        return str(project_root)


def print_errors(repo_root: Path, errors: list[str]) -> None:
    print("Dependency freshness check could not complete.", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)


def print_violations(repo_root: Path, violations: list[Violation]) -> None:
    minimum_release_age_days = violations[0].minimum_release_age_days
    print(
        f"Dependency freshness check failed: {len(violations)} dependency versions are newer than {minimum_release_age_days} days.",
        file=sys.stderr,
    )

    for violation in sorted(
        violations,
        key=lambda item: (
            format_project_root(repo_root, item.record.project_root),
            item.record.ecosystem,
            item.record.name.lower(),
            item.record.version,
        ),
    ):
        project_root = format_project_root(repo_root, violation.record.project_root)
        print(
            f"- [{violation.record.ecosystem}] {project_root}: "
            f"{violation.record.name}@{violation.record.version} "
            f"({violation.record.dependency_kind}) was published at "
            f"{format_timestamp(violation.record.published_at)} and is "
            f"{violation.age_days:.1f} days old.",
            file=sys.stderr,
        )


def main() -> int:
    args = parse_args()
    project_root = args.project_root.resolve() if args.project_root else None
    repo_root = (
        args.repo_root.resolve()
        if args.repo_root
        else discover_repo_root(project_root or Path.cwd())
    )
    config = load_policy_config(repo_root, args.min_age_days)
    npm_registry = NpmRegistryClient()
    now = datetime.now(timezone.utc)

    if project_root is not None:
        project_roots = [project_root]
    else:
        project_roots = discover_project_roots(repo_root)

    if not project_roots:
        raise PolicyError("no supported projects were found")

    checked_records = 0
    errors: list[str] = []
    violations: list[Violation] = []

    for current_project_root in project_roots:
        try:
            records = collect_project_dependency_records(current_project_root, npm_registry)
        except PolicyError as exc:
            project_root_label = format_project_root(repo_root, current_project_root)
            errors.append(f"{project_root_label}: {exc}")
            continue

        checked_records += len(records)
        violations.extend(
            find_violations(records, config.minimum_release_age_days, now)
        )

    if errors:
        print_errors(repo_root, errors)
        return 2

    if violations:
        print_violations(repo_root, violations)
        return 1

    print(
        f"Dependency freshness check passed for {len(project_roots)} projects "
        f"and {checked_records} direct dependencies (minimum age: "
        f"{config.minimum_release_age_days} days)."
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except PolicyError as exc:
        print(f"Dependency freshness check could not complete: {exc}", file=sys.stderr)
        sys.exit(2)
