from dataclasses import dataclass
from .base import CommBase
from typing import Any, Callable, List
import requests


@dataclass
class ReferenceCommOptions:
    base_url: str


class ReferenceComm(CommBase):
    _id: str
    _base_url: str

    _on_msg: List[Callable] = []

    def __init__(
        self,
        initial_msg: Any,
        options: ReferenceCommOptions,
    ):
        self._id = initial_msg['id']
        self._base_url = options.base_url
        r = requests.post(f'{self._base_url}/comms/', json=initial_msg)
        r.raise_for_status()

    def send(self, msg: Any) -> None:
        r = requests.post(f'{self._base_url}/comms/{self._id}', json=msg)
        r.raise_for_status()

    def on_msg(self, callback: Callable) -> None:
        self._on_msg.append(callback)

    def wait_for_query_response_text(self, query_id: str) -> Any:
        r = requests.get(f'{self._base_url}/comms/{self._id}/queryResponse/{query_id}')
        if r.status_code == 200:  # pragma: no branch
            return r.text
