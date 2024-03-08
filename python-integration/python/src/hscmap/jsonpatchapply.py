from typing import Any, Dict, List, Union

JsonType = Union[Dict[str, Any], List[Any]]
PatchOperation = Dict[str, Any]


def apply_patch(original: JsonType, patch: List[PatchOperation]) -> JsonType:
    result = original

    for op in patch:
        operation = op['op']
        if operation == 'add':
            result = apply_add(result, op['path'], op['value'])
        elif operation == 'remove':
            result = apply_remove(result, op['path'])
        elif operation == 'replace':
            result = apply_replace(result, op['path'], op['value'])
        elif operation == 'move':
            result = apply_move(result, op['from'], op['path'])
        else:
            raise ValueError(f"Invalid operation: {operation}")

    return result


def mutate_copy(obj: JsonType, path: str) -> JsonType:
    parts = path.strip('/').split('/')

    current = obj
    new_obj = current.copy() if isinstance(current, dict) else current[:]
    parent = new_obj

    for part in parts[:-1]:
        if isinstance(parent, dict):
            if part not in parent:
                parent[part] = {}
            else:
                parent[part] = parent[part].copy()
        elif isinstance(parent, list):  # pragma: no branch
            part = int(part)
            parent[part] = parent[part].copy()
        parent = parent[part]

    return new_obj


def apply_add(obj: JsonType, path: str, value: Any) -> JsonType:
    obj = mutate_copy(obj, path)
    parts = path.strip('/').split('/')
    current = obj
    for i, part in enumerate(parts):
        if i == len(parts) - 1:
            if isinstance(current, list):
                if part == '-':
                    current.append(value)
                else:
                    index = int(part)
                    if index >= len(current):
                        # 指定されたインデックスがリストの長さ以上の場合、末尾に追加
                        current.append(value)
                    else:
                        # 正しいインデックスに挿入
                        current.insert(index, value)
            else:
                current[part] = value
        else:
            if isinstance(current, list):
                current = current[int(part)]
            else:
                current = current.get(part, {})
    return obj


def apply_remove(obj: JsonType, path: str) -> JsonType:
    obj = mutate_copy(obj, path)
    parts = path.strip('/').split('/')
    current = obj
    for i, part in enumerate(parts):
        if i == len(parts) - 1:
            if isinstance(current, list):
                del current[int(part)]
            else:
                del current[part]
        else:
            current = current.get(part, {})  # type: ignore
    return obj


def apply_replace(obj, path, value):
    obj = mutate_copy(obj, path)
    parts = path.strip('/').split('/')
    current = obj
    for i, part in enumerate(parts):
        if i == len(parts) - 1:
            if isinstance(current, list):
                index = int(part)
                if index >= len(current):  # pragma: no cover
                    raise KeyError(f"Path {path} does not exist")
                current[index] = value
            else:
                if part not in current:  # pragma: no cover
                    raise KeyError(f"Path {path} does not exist")
                current[part] = value
        else:
            current = current[int(part)] if isinstance(current, list) else current.get(part, {})
    return obj


def apply_move(obj: JsonType, from_path: str, to_path: str) -> JsonType:
    obj = mutate_copy(obj, from_path)
    obj = mutate_copy(obj, to_path)
    value = extract_value(obj, from_path)
    return apply_remove(apply_add(obj, to_path, value), from_path)


def extract_value(obj, path):
    parts = path.strip('/').split('/')
    current = obj
    for i, part in enumerate(parts):  # pragma: no branch
        if i == len(parts) - 1:
            if isinstance(current, list):
                return current[int(part)] if int(part) < len(current) else None
            else:
                return current.get(part)
        else:
            if isinstance(current, list):
                current = current[int(part)] if int(part) < len(current) else None
            else:
                current = current.get(part)
            if current is None:
                return None
