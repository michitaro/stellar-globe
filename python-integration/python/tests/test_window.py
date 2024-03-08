import re
from typing import cast

import pytest
import requests
from requests.exceptions import HTTPError

from hscmap.comm.reference import ReferenceComm
from hscmap.window import Window


# Dummy Serverが動いていることを確認
def test_dummy_server(w: Window):

    comm: ReferenceComm = cast(ReferenceComm, w._comm)
    r = requests.get(comm._base_url + "/healthz")
    assert r.status_code == 200


# ウィンドウを作成できる
def test_Window(w: Window):
    pass


# 不正なメッセージにはエラーが出る
def test_send_invalid_message(w: Window):
    with pytest.raises(HTTPError) as e:
        w._post_message({"type": "invalid"})
    assert e.value.response.status_code == 400


# 正しいメッセージはエラーが出ない
def test_send_valid_message(w: Window):
    w.sync()


def test_window_repr(w: Window):
    s = repr(w)
    assert re.search(r"<Window .*>", s)
