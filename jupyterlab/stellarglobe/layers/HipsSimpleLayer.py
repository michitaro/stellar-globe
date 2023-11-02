from dataclasses import dataclass

from .._models.LayerProps.HipsSimpleLayer import Model as Props
from .BaseLayer import BaseLayer


@dataclass
class HipsSimpleLayer(BaseLayer):
    type = 'HipsSimpleLayer'
    baseUrl: str
    visible: bool = True

    def props(self):
        return Props(baseUrl=self.baseUrl, visible=self.visible)

    # @classmethod
    # def search(
    #     cls,
    # ):
    #     # see http://alasky.cds.unistra.fr/MocServer/query
    #     url = f'http://alasky.cds.unistra.fr/MocServer/query?fields=ID,obs_title,hips_service*,hips_status*&get=record&dataproduct_type=image&casesensitive=false&obs_title=*akari*&fmt=json'
    #     pass
