from __future__ import annotations

import argparse
import logging
import secrets
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

import uvicorn
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import FileResponse
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.websockets import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


@dataclass
class Relay:
    comm_id: str
    server: WebSocket
    client: WebSocket | None = None
    client_buffer: list[Any] = field(default_factory=list)
    closed: bool = False

    async def close(self) -> None:
        self.closed = True
        await close_websocket(self.client)
        await close_websocket(self.server)

    async def connect_from_client(self, ws: WebSocket) -> bool:
        if self.client is not None:
            await ws.close(code=1008, reason="comm_id is already connected")
            return False
        self.client = ws
        while self.client_buffer:
            await self.client.send_json(self.client_buffer.pop(0))
        return True

    async def send_to_client(self, data: Any) -> None:
        if self.client is not None:
            await self.client.send_json(data)
            return
        self.client_buffer.append(data)


async def close_websocket(ws: WebSocket | None) -> None:
    if ws is None:
        return
    try:
        await ws.close()
    except RuntimeError as exc:
        logger.debug("WebSocket was already closed: %s", exc)


def default_static_dir() -> Path:
    packaged_static = Path(__file__).resolve().parent / "static" / "dist"
    if packaged_static.is_dir():
        return packaged_static

    project_static = Path(__file__).resolve().parents[2] / "static" / "dist"
    return project_static


def validate_static_dir(static_dir: Path) -> None:
    index_html = static_dir / "index.html"
    if not index_html.is_file():
        raise FileNotFoundError(
            f"frontend build was not found at {static_dir}. "
            "Run `make build-frontend` in python-integration/hscmap-server first."
        )


def create_app(static_dir: str | Path | None = None, *, validate_static: bool = True) -> Starlette:
    resolved_static_dir = Path(static_dir) if static_dir is not None else default_static_dir()
    if validate_static:
        validate_static_dir(resolved_static_dir)

    relays: dict[str, Relay] = {}

    def home(_request: Request) -> FileResponse:
        validate_static_dir(resolved_static_dir)
        return FileResponse(resolved_static_dir / "index.html")

    def static_file_or_home(request: Request) -> FileResponse:
        validate_static_dir(resolved_static_dir)
        path = request.path_params["path"]
        requested_path = (resolved_static_dir / path).resolve()
        static_root = resolved_static_dir.resolve()
        try:
            requested_path.relative_to(static_root)
        except ValueError:
            is_static_file = False
        else:
            is_static_file = requested_path.is_file()
        if is_static_file:
            return FileResponse(requested_path)
        return FileResponse(static_root / "index.html")

    async def server_endpoint(ws: WebSocket) -> None:
        await ws.accept()
        comm_id = secrets.token_urlsafe(32)
        relay = Relay(comm_id, server=ws)
        relays[comm_id] = relay
        try:
            open_msg = await ws.receive_json()
            await ws.send_json({"comm_id": comm_id})
            await relay.send_to_client(open_msg)
            while True:
                data = await ws.receive_json()
                await relay.send_to_client(data)
        except (RuntimeError, WebSocketDisconnect) as exc:
            logger.debug("Python side WebSocket closed: %s (%s)", comm_id, exc)
        finally:
            await relay.close()
            relays.pop(comm_id, None)

    async def client_endpoint(ws: WebSocket) -> None:
        await ws.accept()
        comm_id = ws.path_params["comm_id"]
        relay = relays.get(comm_id)
        if relay is None:
            await ws.close(code=1008, reason="unknown comm_id")
            return
        if not await relay.connect_from_client(ws):
            return
        try:
            while True:
                data = await ws.receive_json()
                await relay.server.send_json(data)
        except (RuntimeError, WebSocketDisconnect) as exc:
            logger.debug("Viewer WebSocket closed: %s (%s)", comm_id, exc)
        finally:
            await relay.close()
            relays.pop(comm_id, None)

    app = Starlette(
        routes=[
            Mount(
                "/assets",
                StaticFiles(directory=str(resolved_static_dir / "assets"), check_dir=validate_static),
                name="assets",
            ),
            WebSocketRoute("/comms", server_endpoint),
            WebSocketRoute("/comms/{comm_id}", client_endpoint),
            Route("/", home),
            Route("/{path:path}", static_file_or_home),
        ],
    )
    app.state.relays = relays
    app.state.static_dir = resolved_static_dir
    return app


def run(
    *,
    host: str = "127.0.0.1",
    port: int = 8000,
    static_dir: str | Path | None = None,
    log_level: str = "info",
) -> None:
    app = create_app(static_dir)
    uvicorn.run(app, host=host, port=port, log_level=log_level)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="hscmap-server",
        description="Serve Stellar Globe and relay hscMap WebSocket messages.",
    )
    parser.add_argument("--host", default="127.0.0.1", help="host interface to bind")
    parser.add_argument("--port", default=8000, type=int, help="TCP port to bind")
    parser.add_argument(
        "--static-dir",
        type=Path,
        default=None,
        help="directory containing the built frontend files",
    )
    parser.add_argument(
        "--log-level",
        default="info",
        choices=("critical", "error", "warning", "info", "debug", "trace"),
        help="uvicorn log level",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    run(
        host=args.host,
        port=args.port,
        static_dir=args.static_dir,
        log_level=args.log_level,
    )
    return 0


app = create_app(validate_static=False)
