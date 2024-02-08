import { SkyCoord } from "@stellar-globe/stellar-globe"
import { MenuItem, SubMenu } from "@szhsin/react-menu"
import classNames from "classnames"
import { Fragment, KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useImmer } from 'use-immer'
import { Icon } from '../../../common/components/Icon'
import { useIsFocused } from "../../../common/hooks/useFocus"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { AppDialog } from "../../AppDialog"
import { useAppContext } from '../../context'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Catalog, catalogsSlice } from "./catalogSlice"
import styles from './styles.module.scss'

export const CatalogDialogs = memo(() => {
  const catalogs = useAppSelector(state => state.catalogs.catalogs)

  return (
    <Fragment>
      {catalogs.map(c => (
        c.dialog && <CatalogDialog key={c.id} catalog={c} dialog={c.dialog} />
      ))}
    </Fragment>
  )
})
setDisplayName({ CatalogDialogs })


const CatalogDialog = memo(({ catalog, dialog }: { catalog: Catalog, dialog: NonNullable<Catalog['dialog']> }) => {
  const dispatch = useAppDispatch()
  const closeDialog = useCallback(() => {
    dispatch(catalogsSlice.actions.dialogToggled({ id: catalog.id, opened: false }))
  }, [catalog, dispatch])
  const [rowsPerPage, setRowsPerPage] = useState(250)
  const [page, setPage] = useState(0)
  const range: [number, number] = useMemo(() => {
    return [page * rowsPerPage, (page + 1) * rowsPerPage]
  }, [page, rowsPerPage])
  const [pageStart, pageEnd] = range
  const pagedAttributes = useMemo(() => {
    return catalog.attributes.slice(pageStart, pageEnd)
  }, [catalog, pageEnd, pageStart])
  const maxPage = useMemo(() => {
    return Math.floor((catalog.attributes.length - 1) / rowsPerPage + 1)
  }, [catalog, rowsPerPage])
  const [activeColumn, updateActiveColumn] = useImmer(catalog.fields.map(_ => true))

  const { globeHandle } = useAppContext()

  const jump = useCallback((index: number) => {
    const globe = globeHandle.current?.()
    if (globe) {
      const marker = catalog.markers[index]
      globe.camera.jumpTo({}, { coord: SkyCoord.fromXyz(marker.position) })
    }
  }, [catalog.markers, globeHandle])

  const [focusedIndex, setFocusedIndex] = useState<undefined | number>(undefined)

  const focus = useCallback((index: number, options: { jump: boolean }) => {
    setFocusedIndex(index)
    dispatch(catalogsSlice.actions.focusedPositionChanged({ position: catalog.markers[index].position }))
    if (!(pageStart <= index && index < pageEnd)) {
      setPage(Math.floor(index / rowsPerPage))
    }
    if (options.jump) {
      jump(index)
    }
  }, [catalog, dispatch, jump, pageEnd, pageStart, rowsPerPage])

  useEffect(() => {
    if (tableRef.current && focusedIndex) {
      const trs = [...(tableRef.current as HTMLElement).querySelectorAll('tbody tr')]
      const tr = trs[focusedIndex - pageStart]
      tr?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex, pageStart])

  const unfocus = useCallback(() => {
    setFocusedIndex(undefined)
    dispatch(catalogsSlice.actions.focusedPositionChanged({ position: undefined }))
  }, [dispatch])

  const tableRef = useRef(null)

  const isFocused = useIsFocused(tableRef, [dialog.opened])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        focus(focusedIndex === undefined ? catalog.attributes.length - 1 : Math.max(0, focusedIndex - 1), { jump: true })
        break
      case 'ArrowDown':
        focus(focusedIndex === undefined ? 0 : Math.min(catalog.attributes.length - 1, focusedIndex + 1), { jump: true })
        break
      default:
        return
    }
    e.stopPropagation()
    e.preventDefault()
  }, [catalog, focus, focusedIndex])

  return (
    <AppDialog
      title={catalog.name}
      visible={dialog.opened}
      onCloseButtonClick={closeDialog}
      resizable
      minmaxSize={{ maxHeight: '90vh' }}
      sizeHint={{ width: '600px', height: '400px' }}
      menu={
        <SubMenu label="Columns">
          {
            catalog.fields.map((f, i) => (
              <MenuItem key={i} type='checkbox' checked={activeColumn[i]} onClick={() => updateActiveColumn(_ => {
                _[i] = !_[i]
              })}>
                {f}
              </MenuItem>
            ))
          }
        </SubMenu>
      }
    >
      <div className={styles.catalogDialog}>
        <table>
          <thead>
            <tr>
              {
                activeColumn.map((a, i) => {
                  const f = catalog.fields[i]
                  return a && (
                    <th key={i} title={f} >
                      {f}
                    </th>
                  )
                })
              }
            </tr>
          </thead>
        </table>
        <div className={classNames(styles.tableWrapper, isFocused && styles.hasFocus)}>
          <table tabIndex={0} ref={tableRef} onKeyDown={onKeyDown} onBlur={unfocus}>
            <tbody
              onMouseLeave={() => {
                if (!isFocused) {
                  unfocus()
                }
              }}
            >
              {
                pagedAttributes.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      focus(pageStart + i, { jump: true })
                    }}
                    onMouseEnter={() => {
                      if (!isFocused) {
                        focus(pageStart + i, { jump: false })
                      }
                    }}
                    className={classNames(pageStart + i === focusedIndex && styles.focused)}
                  >
                    {activeColumn.map((a, j) => {
                      const c = row[j]
                      return a && (
                        <td key={j} title={c} >
                          {c}
                        </td>
                      )
                    })}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className={styles.navigation}>
          <div className={styles.pages}>
            <button onClick={() => setPage(0)} disabled={page <= 0}><Icon type='first_page' /></button>
            <button onClick={() => setPage(page - 1)} disabled={page <= 0}  ><Icon type='navigate_before' /></button>
            <input style={{ textAlign: 'center' }} type='text' value={page + 1} onChange={e => ifValidNumberString(e.currentTarget.value, n => setPage(Math.max(0, n - 1)))} size={4} />
            / {maxPage}
            <button onClick={() => setPage(_ => _ + 1)} disabled={page + 1 >= maxPage} ><Icon type='navigate_next' /></button>
            <button onClick={() => setPage(maxPage - 1)} disabled={page + 1 >= maxPage} ><Icon type='last_page' /></button>
            ({pageStart + 1}-{Math.min(pageEnd, catalog.attributes.length)})
          </div>
          <div>
            <input type="text" value={rowsPerPage} size={4} style={{ textAlign: 'center' }}
              onChange={e => ifValidNumberString(e.currentTarget.value, n => setRowsPerPage(Math.max(1, n)))}
            /> rows per page
          </div>
        </div>
      </div>
    </AppDialog>
  )
})


function ifValidNumberString<T>(s: string, cb: (n: number) => T): T | undefined {
  const n = Number(s)
  if (Number.isFinite(n)) {
    return cb(n)
  }
}
