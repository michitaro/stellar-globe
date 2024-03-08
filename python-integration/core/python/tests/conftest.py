import pytest

from hscmap import Window
from hscmap.comm.reference import ReferenceCommOptions


@pytest.fixture
def w():
    options = ReferenceCommOptions(base_url="http://localhost:3000")
    return Window(comm_options=options)
