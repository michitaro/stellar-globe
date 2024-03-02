from typing import Any
import json
from pathlib import Path
from .models.StellarGlobeWidgetParams import Model as StellarGlobeWidgetParams


class DummyComm:
    def __init__(self, target: str, initial_msg: StellarGlobeWidgetParams):
        response_file = initial_msg['responseFile']
        make_response_file(Path(response_file), {'state': {}, 'revision': 0})
        assert target == 'stellarglobe/new'

    def send(self, msg):
        print(msg)

    def on_msg(self, callback):
        self._on_msg = callback


def make_response_file(response_file: Path, response: Any):
    data = json.dumps(response)
    response_file.write_text(f'{len(data)}\n{data}')
