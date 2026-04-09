from __future__ import annotations

import importlib.util
import sys
import textwrap
from datetime import datetime, timedelta, timezone
from pathlib import Path


MODULE_PATH = (
    Path(__file__).resolve().parents[3] / "tools" / "check_dependency_freshness.py"
)
MODULE_SPEC = importlib.util.spec_from_file_location(
    "check_dependency_freshness", MODULE_PATH
)
assert MODULE_SPEC is not None
assert MODULE_SPEC.loader is not None
dependency_freshness = importlib.util.module_from_spec(MODULE_SPEC)
sys.modules[MODULE_SPEC.name] = dependency_freshness
MODULE_SPEC.loader.exec_module(dependency_freshness)


class FakeNpmRegistryClient:
    def __init__(self, publish_times: dict[tuple[str, str], datetime]) -> None:
        self.publish_times = publish_times

    def fetch_publish_time(self, package_name: str, version: str) -> datetime:
        return self.publish_times[(package_name, version)]


def test_collect_package_lock_dependency_records_skips_local_specs(
    tmp_path: Path,
) -> None:
    (tmp_path / "package.json").write_text(
        """
        {
          "dependencies": {
            "left-pad": "^1.3.0",
            "@stellar-globe/local": "file:../local"
          },
          "devDependencies": {
            "vitest": "^2.1.8"
          }
        }
        """,
        encoding="utf-8",
    )
    (tmp_path / "package-lock.json").write_text(
        """
        {
          "name": "fixture",
          "lockfileVersion": 3,
          "packages": {
            "": {
              "dependencies": {
                "left-pad": "^1.3.0"
              },
              "devDependencies": {
                "vitest": "^2.1.8"
              }
            },
            "node_modules/left-pad": {
              "version": "1.3.0"
            },
            "node_modules/vitest": {
              "version": "2.1.8"
            }
          }
        }
        """,
        encoding="utf-8",
    )

    registry = FakeNpmRegistryClient(
        {
            ("left-pad", "1.3.0"): datetime(2020, 1, 1, tzinfo=timezone.utc),
            ("vitest", "2.1.8"): datetime(2024, 1, 1, tzinfo=timezone.utc),
        }
    )

    records = dependency_freshness.collect_package_lock_dependency_records(
        tmp_path, registry
    )

    assert [(record.name, record.version) for record in records] == [
        ("left-pad", "1.3.0"),
        ("vitest", "2.1.8"),
    ]


def test_collect_yarn_dependency_records_reads_direct_versions(tmp_path: Path) -> None:
    (tmp_path / "package.json").write_text(
        textwrap.dedent(
            """
        {
          "dependencies": {
            "@jupyterlab/application": "^4.0.0",
            "@stellar-globe/app": "link:../../app"
          }
        }
        """
        ),
        encoding="utf-8",
    )
    (tmp_path / "yarn.lock").write_text(
        textwrap.dedent(
            """
        __metadata:
          version: 6

        "@jupyterlab/application@npm:^4.0.0":
          version: 4.0.11
        """
        ),
        encoding="utf-8",
    )

    registry = FakeNpmRegistryClient(
        {
            ("@jupyterlab/application", "4.0.11"): datetime(
                2024, 2, 1, tzinfo=timezone.utc
            ),
        }
    )

    records = dependency_freshness.collect_yarn_dependency_records(tmp_path, registry)

    assert [(record.name, record.version) for record in records] == [
        ("@jupyterlab/application", "4.0.11"),
    ]


def test_collect_uv_dependency_records_reads_upload_time(tmp_path: Path) -> None:
    (tmp_path / "pyproject.toml").write_text(
        """
        [project]
        name = "sample_project"
        version = "0.0.0"
        """,
        encoding="utf-8",
    )
    (tmp_path / "uv.lock").write_text(
        """
        version = 1

        [[package]]
        name = "sample-project"
        version = "0.0.0"
        source = { editable = "." }

        [package.dev-dependencies]
        dev = [
            { name = "pytest", version = "8.4.2", source = { registry = "https://pypi.org/simple" } },
            { name = "requests" }
        ]

        [[package]]
        name = "pytest"
        version = "8.4.2"
        source = { registry = "https://pypi.org/simple" }
        sdist = { url = "https://example.invalid/pytest-8.4.2.tar.gz", hash = "sha256:1", size = 1, upload-time = "2025-09-01T00:00:00Z" }

        [[package]]
        name = "requests"
        version = "2.32.5"
        source = { registry = "https://pypi.org/simple" }
        wheels = [
            { url = "https://example.invalid/requests-2.32.5.whl", hash = "sha256:2", size = 1, upload-time = "2025-08-01T00:00:00Z" }
        ]
        """,
        encoding="utf-8",
    )

    records = dependency_freshness.collect_uv_dependency_records(tmp_path)

    assert [(record.name, record.version) for record in records] == [
        ("pytest", "8.4.2"),
        ("requests", "2.32.5"),
    ]
    assert records[0].published_at == datetime(2025, 9, 1, tzinfo=timezone.utc)
    assert records[1].published_at == datetime(2025, 8, 1, tzinfo=timezone.utc)


def test_find_violations_respects_minimum_age_days() -> None:
    now = datetime(2026, 4, 9, tzinfo=timezone.utc)
    records = [
        dependency_freshness.DependencyRecord(
            ecosystem="npm",
            project_root=Path("/tmp/app"),
            dependency_kind="dependencies",
            name="fresh-package",
            version="1.0.0",
            published_at=now - timedelta(days=10),
        ),
        dependency_freshness.DependencyRecord(
            ecosystem="uv",
            project_root=Path("/tmp/python"),
            dependency_kind="dev:dev",
            name="old-package",
            version="2.0.0",
            published_at=now - timedelta(days=45),
        ),
    ]

    violations = dependency_freshness.find_violations(records, 30, now)

    assert [(violation.record.name, round(violation.age_days, 1)) for violation in violations] == [
        ("fresh-package", 10.0),
    ]
