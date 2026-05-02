from pathlib import Path

import pytest
from starlette.testclient import TestClient

from hscmapserver.server import build_arg_parser, create_app, validate_static_dir


def create_static_dir(tmp_path: Path) -> Path:
    static_dir = tmp_path / "dist"
    (static_dir / "assets").mkdir(parents=True)
    (static_dir / "index.html").write_text("<!doctype html><title>hscMap</title>", encoding="utf-8")
    (static_dir / "sample.txt").write_text("sample", encoding="utf-8")
    return static_dir


def test_create_app_serves_index_and_static_files(tmp_path: Path) -> None:
    static_dir = create_static_dir(tmp_path)
    client = TestClient(create_app(static_dir))

    root_response = client.get("/")
    static_response = client.get("/sample.txt")
    fallback_response = client.get("/unknown/path")

    assert root_response.status_code == 200
    assert "hscMap" in root_response.text
    assert static_response.status_code == 200
    assert static_response.text == "sample"
    assert fallback_response.status_code == 200
    assert "hscMap" in fallback_response.text


def test_validate_static_dir_requires_built_frontend(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError, match="frontend build was not found"):
        validate_static_dir(tmp_path)


def test_websocket_relay_forwards_messages(tmp_path: Path) -> None:
    static_dir = create_static_dir(tmp_path)
    client = TestClient(create_app(static_dir))

    with client.websocket_connect("/comms") as server_ws:
        server_ws.send_json({"type": "Open", "queryId": "q1"})
        comm_id = server_ws.receive_json()["comm_id"]

        with client.websocket_connect(f"/comms/{comm_id}") as browser_ws:
            assert browser_ws.receive_json() == {"type": "Open", "queryId": "q1"}

            browser_ws.send_json({"type": "queryResponse", "queryId": "q1", "content": "ready"})
            assert server_ws.receive_json() == {
                "type": "queryResponse",
                "queryId": "q1",
                "content": "ready",
            }


def test_cli_parser_accepts_port_and_static_dir(tmp_path: Path) -> None:
    args = build_arg_parser().parse_args(
        ["--host", "0.0.0.0", "--port", "8765", "--static-dir", str(tmp_path)]
    )

    assert args.host == "0.0.0.0"
    assert args.port == 8765
    assert args.static_dir == tmp_path
