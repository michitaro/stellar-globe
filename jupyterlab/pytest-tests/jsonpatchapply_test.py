import pytest
from stellarglobe_jupyterlab.jsonpatchapply import apply_patch, extract_value


def test_add_operation():
    original = {"a": 1}
    patch = [{"op": "add", "path": "/b", "value": 2}]
    expected = {"a": 1, "b": 2}
    assert apply_patch(original, patch) == expected


def test_remove_operation():
    original = {"a": 1, "b": 2}
    patch = [{"op": "remove", "path": "/b"}]
    expected = {"a": 1}
    assert apply_patch(original, patch) == expected


def test_replace_operation():
    original = {"a": 1}
    patch = [{"op": "replace", "path": "/a", "value": 2}]
    expected = {"a": 2}
    assert apply_patch(original, patch) == expected


def test_move_operation():
    original = {"a": 1, "b": 2}
    patch = [{"op": "move", "from": "/b", "path": "/c"}]
    expected = {"a": 1, "c": 2}
    assert apply_patch(original, patch) == expected


def test_complex_operation():
    original = {"a": [1, 2, 3], "b": {"c": 1}}
    patch = [{"op": "add", "path": "/a/-", "value": 4}, {"op": "remove", "path": "/b/c"}, {"op": "replace", "path": "/a/0", "value": 5}]
    expected = {"a": [5, 2, 3, 4], "b": {}}
    assert apply_patch(original, patch) == expected


# エラーのテストケースも含めることができます
def test_invalid_operation():
    original = {"a": 1}
    patch = [{"op": "invalid_op", "path": "/a", "value": 2}]
    with pytest.raises(ValueError):
        apply_patch(original, patch)


def test_move_operation_to_nonexistent_path():
    original = {"a": 1, "b": 2}
    patch = [{"op": "move", "from": "/b", "path": "/c/d"}]  # 存在しないパスへの移動
    expected = {"a": 1, "c": {"d": 2}}
    assert apply_patch(original, patch) == expected


def test_add_operation_to_nonexistent_path():
    original = {"a": 1}
    patch = [{"op": "add", "path": "/b/c", "value": 2}]  # 存在しないパスへの追加
    expected = {"a": 1, "b": {"c": 2}}
    assert apply_patch(original, patch) == expected


def test_remove_operation_from_nonexistent_path():
    original = {"a": 1, "b": 2}
    patch = [{"op": "remove", "path": "/c"}]  # 存在しないパスからの削除
    with pytest.raises(KeyError):
        apply_patch(original, patch)


def test_replace_operation_on_nonexistent_path():
    original = {"a": 1, "b": 2}
    patch = [{"op": "replace", "path": "/c", "value": 3}]  # 存在しないパスの置換
    with pytest.raises(KeyError):
        apply_patch(original, patch)


def test_add_operation_to_list_with_dash():
    original = {"a": [1, 2, 3]}
    patch = [{"op": "add", "path": "/a/-", "value": 4}]  # リストの末尾への追加
    expected = {"a": [1, 2, 3, 4]}
    assert apply_patch(original, patch) == expected


def test_add_to_empty_object():
    original = {}
    patch = [{"op": "add", "path": "/a", "value": 1}]
    expected = {"a": 1}
    assert apply_patch(original, patch) == expected


def test_remove_from_empty_object():
    original = {}
    patch = [{"op": "remove", "path": "/a"}]
    with pytest.raises(KeyError):
        apply_patch(original, patch)


def test_replace_in_empty_object():
    original = {}
    patch = [{"op": "replace", "path": "/a", "value": 1}]
    with pytest.raises(KeyError):
        apply_patch(original, patch)


def test_move_from_empty_object():
    original = {}
    patch = [{"op": "move", "from": "/a", "path": "/b"}]
    with pytest.raises(KeyError):
        apply_patch(original, patch)


def test_add_operation_to_specific_index_in_list():
    original = {"a": [1, 2, 4]}
    patch = [{"op": "add", "path": "/a/2", "value": 3}]  # インデックス2に値3を挿入
    expected = {"a": [1, 2, 3, 4]}  # 期待される結果は [1, 2, 3, 4]
    assert apply_patch(original, patch) == expected


def test_mutate_copy_on_list_element():
    original = {"a": [1, {"b": 2}, 3]}
    patch = [{"op": "add", "path": "/a/1/c", "value": 3}]  # リストのインデックス1にある辞書に新しいキーを追加
    expected = {"a": [1, {"b": 2, "c": 3}, 3]}  # 期待される結果
    assert apply_patch(original, patch) == expected


def test_mutate_copy_with_list():
    original = {"a": [1, {"b": 2}, 3]}
    patch = [{"op": "replace", "path": "/a/1/b", "value": 4}]
    expected = {"a": [1, {"b": 4}, 3]}
    assert apply_patch(original, patch) == expected


def test_add_operation_beyond_list_length():
    original = {"a": [1, 2]}
    patch = [{"op": "add", "path": "/a/5", "value": 3}]
    expected = {"a": [1, 2, 3]}
    assert apply_patch(original, patch) == expected


def test_extract_value_from_list():
    original = {"a": [1, 2, 3]}
    assert extract_value(original, "/a/1") == 2


def test_extract_value_from_dict():
    original = {"a": {"b": 1}}
    assert extract_value(original, "/a/b") == 1


def test_extract_value_with_list_index_out_of_range_in_path():
    original = {"a": [1, 2, {"b": 3}]}
    assert extract_value(original, "/a/5/b") is None  # リストの範囲外のインデックスを含むパス


def test_extract_value_with_nonexistent_nested_path():
    original = {"a": [1, 2, {"b": 3}]}
    assert extract_value(original, "/a/2/c") is None  # 存在しないネストされたパス


def test_remove_operation_from_list_middle():
    original = {"a": [1, 2, 3, 4]}
    patch = [{"op": "remove", "path": "/a/2"}]  # リストのインデックス2の要素を削除
    expected = {"a": [1, 2, 4]}  # 期待される結果は [1, 2, 4]
    assert apply_patch(original, patch) == expected


def test_extract_value_with_completely_nonexistent_path():
    original = {"a": [1, 2, {"b": 3}]}
    assert extract_value(original, "/x/y/z") is None  # 完全に存在しないパス


def test_shallow_equality_check():
    original = {"a": [1, 2, {"b": 3}], "c": 4}
    patch = [{"op": "replace", "path": "/a/2/b", "value": 5}]
    updated = apply_patch(original, patch)

    assert updated != original  # オブジェクト全体は異なる
    assert updated["c"] is original["c"]  # type: ignore 変更されていない部分は同じ参照
    assert updated["a"] != original["a"]  # type: ignore リスト 'a' は変更されている
    assert updated["a"][0] is original["a"][0]  # type: ignore 変更されていない要素は同じ参照
    assert updated["a"][1] is original["a"][1]  # type: ignore 同上
    assert updated["a"][2] != original["a"][2]  # type: ignore 変更された要素は異なるオブジェクト


def test_shallow_equality_check_with_non_primitive_objects():
    original = {"a": [1, 2, {"b": 3, "d": [5, 6]}], "c": 4, "e": {"f": 7, "g": [8, 9]}}
    patch = [{"op": "replace", "path": "/a/2/b", "value": 5}, {"op": "add", "path": "/e/h", "value": 10}]
    updated = apply_patch(original, patch)

    assert updated != original  # オブジェクト全体は異なる
    assert updated["c"] is original["c"]                  # type: ignore 変更されていない部分は同じ参照
    assert updated["a"] != original["a"]                  # type: ignore リスト 'a' は変更されている
    assert updated["a"][0] is original["a"][0]            # type: ignore 変更されていない要素は同じ参照
    assert updated["a"][1] is original["a"][1]            # type: ignore 同上
    assert updated["a"][2] != original["a"][2]            # type: ignore 変更された要素は異なるオブジェクト
    assert updated["a"][2]["d"] is original["a"][2]["d"]  # type: ignore 変更されていないネストされたリストは同じ参照
    assert updated["e"] != original["e"]                  # type: ignore 辞書 'e' は変更されている
    assert updated["e"]["f"] is original["e"]["f"]        # type: ignore 変更されていない要素は同じ参照
    assert updated["e"]["g"] is original["e"]["g"]        # type: ignore 同上
