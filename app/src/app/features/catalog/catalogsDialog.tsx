import { MarkerType, markerTypes } from '@stellar-globe/stellar-globe'
import { MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import { Fragment, memo, useId } from "react"
import { ColorPickerRgba } from "../../../common/components/ColorPicker"
import { Icon } from "../../../common/components/Icon"
import { askLocalFileList } from '../../../common/utils/askLocalFileList'
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { AppDialog } from '../../AppDialog'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Catalog, catalogsSlice } from "./catalogSlice"
import exampleCsvWithColor from './examples/with_color_column.csv?url'
import exampleCsvWithColorAndMarker from './examples/with_color_marker_type_column.csv?url'
import { useAddCatalogFileList, useGoToCatalog } from './useAddCatalogFileList'


export const CatalogsDialog = memo(() => {
  const catalogs = useAppSelector(state => state.catalogs.catalogs)
  const visible = useAppSelector(state => state.catalogs.catalogsDialogVisible)
  const dispatch = useAppDispatch()

  return (
    <AppDialog
      title={<Fragment><Icon type='table' marginRight />Catalogs</Fragment>}
      visible={visible}
      onCloseButtonClick={() => dispatch(catalogsSlice.actions.catalogsDialogToggled({}))}
      menu={<CatalogsMenu />}
    >
      <table>
        <thead>
          <tr>
            {catalogs.length > 0 && (
              <Fragment>
                <th><Icon type='visibility' /></th>
                <th>#</th>
                <th>Name</th>
                <th>Marker</th>
                <th></th>
                <th></th>
              </Fragment>
            )}
          </tr>
        </thead>
        <tbody>
          {catalogs.map(c => <CatalogTr key={c.id} catalog={c} />)}
        </tbody>
      </table>
    </AppDialog>
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
      <td style={{ textAlign: 'right' }}>{c.attributes.length}</td>
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
        <button onClick={() => goToCatalog(c)}><Icon type='location_on' /></button>
        <button onClick={() => dispatch(catalogsSlice.actions.dialogToggled({ id: c.id }))}><Icon type='table' /></button>
        <button onClick={() => dispatch(catalogsSlice.actions.catalogDeleted({ id: c.id }))}><Icon type="delete" /></button>
      </td>
    </tr>
  )
})
setDisplayName({ CatalogTr })


export const CatalogsMenu = memo(() => {
  const addCatalogFiles = useAddCatalogFileList()

  const upload = async () => {
    try {
      const filelist = await askLocalFileList({ multiple: true })
      addCatalogFiles(filelist)
    }
    catch {
      // do nothing
    }
  }

  return (
    <Fragment>
      <MenuItem onClick={upload}>
        <Icon type='upload' marginRight />
        Upload
      </MenuItem>
      <MenuDivider />
      <SubMenu label="Example Files">
        <MenuItem
          href={exampleCsvWithColor}
          target="_blank"
          rel="noreferrer"
        >
          With Color Column
        </MenuItem>
        <MenuItem
          href={exampleCsvWithColorAndMarker}
          target="_blank"
          rel="noreferrer"
        >
          With Color Column and Marker Type Column
        </MenuItem>
      </SubMenu>
    </Fragment>
  )
})
setDisplayName({ CatalogsMenu })
