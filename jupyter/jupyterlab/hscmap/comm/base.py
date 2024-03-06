import abc
import json
from typing import Any, Callable, TypeVar, cast


class CommBase(abc.ABC):
    @abc.abstractmethod
    def on_msg(self, callback: Callable): ...

    @abc.abstractmethod
    def send(self, msg: Any): ...

    @abc.abstractmethod
    def wait_for_query_response_text(
        self,
        query_id: str,
        *,
        timeout: float = 10,
        poll_interval: float = 0.1,
    ) -> Any: ...

    def wait_for_response(self, query_id: str, *, timeout: float = 10, poll_interval: float = 0.1) -> Any:
        text = self.wait_for_query_response_text(query_id, timeout=timeout, poll_interval=poll_interval)
        return json.loads(text)


T = TypeVar('T')


def remove_none(o: T) -> T:
    if isinstance(o, dict):
        return cast(T, {k: remove_none(v) for k, v in o.items() if not v is None})
    if isinstance(o, list):
        return cast(T, [remove_none(e) for e in o])
    return o
