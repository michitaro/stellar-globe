```bash
./.venv/bin/uvicorn hscmap.comm.hscmap_server:app --reload
```

```python
from hscmap import Window
from hscmap.comm.hscmapserver import HSCMapServerCommOptions

w = Window(options=HSCMapServerCommOptions()) # ブラウザが立ち上がる

```
