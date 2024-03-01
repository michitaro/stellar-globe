from dataclasses import dataclass
from typing import TYPE_CHECKING, List, Literal, Optional, Tuple, Dict, Iterable

from .models.actions.catalogs.catalogAdded import Marker
from .models.actions.catalogs.catalogAdded import Model as CatalogAdded
from .models.actions.catalogs.catalogDeleted import Model as CatalogDeleted
from .models.actions.catalogs.catalogUpdated import Model as CatalogUpdated
from .tinyid import tinyid
from .vec3 import SkyCoord
from .window import Window

MarkerType = Literal['asterisk', 'circle', 'circledHollowAsterisk', 'circledHollowPlus', 'circledHollowX', 'diamond', 'dot', 'hollowAsterisk', 'hollowPlus', 'hollowX', 'pentagon', 'plus', 'square', 'triangle', 'x']

Color = List[float]
V3 = List[float]

if TYPE_CHECKING:
    from pandas import DataFrame as pdDataFrame
else:
    pdDataFrame = None


@dataclass
class CatalogManager:
    _w: Window

    @property
    def members(self):
        self._w.sync(only_if_needed=True)
        return self._w._store_state['catalogs']['catalogs']

    def clear(self):
        for catalog in self.members:
            self._w._dispatch(
                CatalogDeleted(
                    type='catalogs/catalogDeleted',
                    payload={'id': catalog['id']},
                )
            )

    def _new(
        self,
        *,
        name: Optional[str] = None,
        table: Dict[str, List[str]],
        xyz: List[V3],
        color: Optional[List[Optional[Color]]] = None,
        type: Optional[Optional[List[MarkerType]]] = None,
        base_color: Optional[Color] = None,
        default_marker_type: MarkerType = 'circle',
        open_catalog_table=False,
    ):
        id = tinyid()
        fields = [*table.keys()]
        name = name or f'Catalog {len(self.members) + 1}'

        # attributesの全ての値が同じ長さであることを確認
        for values in table.values():
            if len(values) != len(xyz):
                raise ValueError('All attributes must have the same length as coords')

        # colors, typesも同じ長さであることを確認
        if color is not None and len(color) != len(xyz):
            raise ValueError('All colors must have the same length as coords')
        if type is not None and len(type) != len(xyz):
            raise ValueError('All types must have the same length as coords')

        markers: List[Marker] = [
            Marker(
                position=xyz[i],
                color=color[i] if color else None,
                type=type[i] if type else None,
            )
            for i in range(len(xyz))
        ]
        attributes = [[table[f][i] for f in table.keys()] for i in range(len(xyz))]

        action = CatalogAdded(
            type='catalogs/catalogAdded',
            payload={
                'openDialog': open_catalog_table,
                'params': {
                    'id': id,
                    'name': name,
                    'attributes': attributes,
                    'baseColor': base_color,
                    'defaultType': default_marker_type,
                    'fields': fields,
                    'markers': markers,
                },
            },
        )
        self._w._dispatch(action)
        return Catalog(id, self._w)

    def from_pandas(
        self,
        df: pdDataFrame,
        *,
        name: Optional[str] = None,
        coord_column: Optional[Tuple[str, str]] = None,
        color_column: Optional[str] = None,
        type_column: Optional[str] = None,
        base_color: Optional[Color] = None,
        default_marker_type: MarkerType = 'circle',
        open_catalog_table=False,
    ):
        w = self._w

        if coord_column is None:
            coord_column = ('ra', 'dec')

        ras = df[coord_column[0]]
        decs = df[coord_column[1]]

        xyz = [
            SkyCoord(
                w._angle_input(ra),
                w._angle_input(dec),
            )
            .vec3()
            .as_list()
            for ra, dec in zip(ras, decs)
        ]

        color = df[color_column].tolist() if color_column else None
        type = df[type_column].tolist() if type_column else None
        table = {k: [str(value) for value in df[k].tolist()] for k in df.columns}

        return self._new(
            name=name,
            table=table,
            xyz=xyz,
            color=color,
            type=type,
            base_color=base_color,
            default_marker_type=default_marker_type,
            open_catalog_table=open_catalog_table,
        )

    def new(
        self,
        ra: List[float],
        dec: List[float],
        *,
        color: Optional[List[Optional[Color]]] = None,
        type: Optional[Optional[List[MarkerType]]] = None,
        base_color: Optional[Color] = None,
        default_marker_type: MarkerType = 'circle',
        open_catalog_table=False,
    ):
        # ra, dec の長さが同じことを確認
        if len(ra) != len(dec):
            raise ValueError('ra and dec must have the same length')

        return self._new(
            table={},
            xyz=[SkyCoord(self._w._angle_input(r), self._w._angle_input(d)).vec3().as_list() for r, d in zip(ra, dec)],
            color=color,
            type=type,
            base_color=base_color,
            default_marker_type=default_marker_type,
            open_catalog_table=open_catalog_table,
        )


@dataclass
class Catalog:
    id: str
    _w: Window

    def delete(self):
        self._w._dispatch(
            CatalogDeleted(
                type='catalogs/catalogDeleted',
                payload={'id': self.id},
            )
        )

    def _sync(self):
        self._w.sync(only_if_needed=True)

    def _state(self):
        self._sync()
        for catalog in self._w._store_state['catalogs']['catalogs']:
            if catalog['id'] == self.id:
                return catalog
        raise ValueError(f'Catalog {self.id} not found')

    def _update(self, **kwargs):
        self._w._dispatch(
            CatalogUpdated(
                type='catalogs/catalogUpdated',
                payload={**kwargs, 'id': self.id},  # type: ignore
            )
        )

    @property
    def name(self):
        self._sync()
        return self._state()['name']

    @name.setter
    def name(self, new_name: str):
        self._update(name=new_name)

    @property
    def color(self):
        self._sync()
        return self._state()['baseColor']

    @color.setter
    def color(self, new_color: Color):
        self._update(baseColor=new_color)

    @property
    def marker(self):
        self._sync()
        return self._state()['defaultType']

    @marker.setter
    def marker(self, new_marker: MarkerType):
        self._update(defaultType=new_marker)

    @property
    def column_names(self):
        self._sync()
        return self._state()['fields']

    @property
    def visible(self):
        self._sync()
        return self._state()['visible']

    @visible.setter
    def visible(self, new_visible: bool):
        self._update(visible=new_visible)

    @property
    def selected_indices(self):
        self._sync()
        return [*map(int, self._state()['selectedRecords'].keys())]


def sample_pandas_data(n_rows: int = 500):
    import numpy
    import pandas

    # pandasでサンプル用のカタログデータを作る
    # カラムは ID, ra, dec, mag
    # 行数はn_rows
    # 内容は適当に乱数で埋める
    # 乱数の範囲は
    # ID: [0, nrows)
    # ra: [-0.5, 0.5]
    # dec: [-0.5, 0.5]
    # mag: [15, 25]
    # とする
    # w.catalogs.from_pandas(df) でカタログを作成できるようにする

    df = pandas.DataFrame(
        {
            'ID': range(n_rows),
            'ra': (numpy.random.rand(n_rows) - 0.5) * 1,
            'dec': (numpy.random.rand(n_rows) - 0.5) * 1,
            'mag': (numpy.random.rand(n_rows) * 10) + 15,
        }
    )
    return df


'''
Catalogの定義

export type Catalog = {
  id: string
  name: string
  markers: Marker[]
  fields: string[]
  attributes: string[][]
  defaultType: MarkerType
  defaultColor: V4
  baseColor: V4
  visible: boolean
  dialog: DialogState
  selectedRecords: { [index: number]: true }
}
'''
