import { MarkerType, markerTypes } from '@stellar-globe/stellar-globe'
import { Fragment, memo, useId } from "react"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import { Icon } from "../../../common/components/Icon"
import { askLocalFileList } from '../../../common/utils/askLocalFileList'
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Catalog, catalogsSlice } from "./catalogSlice"
import { useAddCatalogFileList, useGoToCatalog } from './useAddCatalogFileList'


export const CatalogsPanel = memo(() => {
  const catalogs = useAppSelector(state => state.catalogs.catalogs)

  return (
    <Fragment>
      <table>
        <thead>
          <tr>
            <th><Icon type='visibility' /></th>
            <th>Name</th>
            <th>Marker</th>
            <th></th>
            <th style={{ textAlign: 'right' }}>
              <AddCatalogFromLocal />
            </th>
          </tr>
        </thead>
        <tbody>
          {catalogs.map(c => <CatalogTr key={c.id} catalog={c} />)}
        </tbody>
      </table>
    </Fragment>
  )
})


const CatalogTr = memo(({ catalog: c }: { catalog: Catalog }) => {
  const goToCatalog = useGoToCatalog()
  const dispatch = useAppDispatch()
  const visibleId = useId()

  return (
    <tr key={c.id}>
      <th>
        <input type='checkbox' checked={c.visible} id={visibleId} onChange={e =>
          dispatch(catalogsSlice.actions.catalogUpdated({ id: c.id, visible: e.currentTarget.checked }))
        } />
      </th>
      <td><label htmlFor={visibleId}>{c.name}</label></td>
      <td>
        <select style={{ maxWidth: '8em', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} value={c.defaultType} onChange={e =>
          dispatch(catalogsSlice.actions.catalogUpdated({ id: c.id, defaultType: e.currentTarget.value as MarkerType }))
        }>
          {markerTypes.map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </td>
      <td>
        <ColorPickerRgba color={c.baseColor} onChange={color =>
          dispatch(catalogsSlice.actions.catalogUpdated({ id: c.id, baseColor: color }))
        } />
      </td>
      <td>
        <button onClick={() => goToCatalog(c)}><Icon type='jump_to_element' /></button>
        <button onClick={() => dispatch(catalogsSlice.actions.catalogDeleted({ id: c.id }))}><Icon type="delete" /></button>
      </td>
    </tr>
  )
})
setDisplayName({ CatalogTr })


const AddCatalogFromLocal = memo(() => {
  const addCatalogFiles = useAddCatalogFileList()

  const onClick = async () => {
    try {
      const filelist = await askLocalFileList({ multiple: true })
      addCatalogFiles(filelist)
    }
    catch {
      // do nothing
    }
  }

  return (
    <button>
      <Icon type='upload' onClick={onClick} />
    </button>
  )
})