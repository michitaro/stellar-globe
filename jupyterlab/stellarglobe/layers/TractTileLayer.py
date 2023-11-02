from dataclasses import dataclass
from typing import Optional, Union

from .._models.LayerProps.TractTileLayer import Model as Props, Filter
from .._models.TractTileLayerColorParams.simpleRgb import Model as SimpleRgb
from .._models.TractTileLayerColorParams.simpleColorMatrix import Model as SimpleColorMatrix
from .._models.TractTileLayerColorParams.sdssTrueColor import Model as SdssTrueColor
from .._models.TractTileLayerColorParams.simpleColorMatrix import Model as SimpleColorMatrix
from .BaseLayer import BaseLayer


@dataclass
class TractTileLayer(BaseLayer):
    type = 'TractTileLayer'
    baseUrl: str
    colorParams: Optional[Union[SimpleRgb, SimpleColorMatrix, SdssTrueColor, SimpleColorMatrix]] = None
    filters: Optional[list[Filter]] = None
    outline: Optional[bool] = True
    visible: Optional[bool] = None

    def props(self):
        return Props(
            baseUrl=self.baseUrl,
            colorParams=self.colorParams,  # type: ignore
            filters=self.filters,
            outline=self.outline,
            visible=self.visible,
        )

    SimpleRgb = SimpleRgb
    SimpleColorMatrix = SimpleColorMatrix
    SdssTrueColor = SdssTrueColor
    SimpleColorMatrix = SimpleColorMatrix

    pdr3_wide_url = '//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide'
    pdr3_dud_url = '//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_dud'
    la2014_url = '//hscmap.mtk.nao.ac.jp/hscMap4/data/la2014'
    la2016_url = '//hscmap.mtk.nao.ac.jp/hscMap4/data/la2016'
