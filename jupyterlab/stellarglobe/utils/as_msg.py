from typing import Any


def as_msg(
    o,
    *,
    exclude_none=True,
) -> Any:
    if isinstance(o, dict):
        return {k: as_msg(v, exclude_none=exclude_none) for k, v in o.items() if not (exclude_none and v is None)}
    if isinstance(o, list):
        return [as_msg(e, exclude_none=exclude_none) for e in o]
    return o
