import { memo } from "react"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { catalogsSlice } from "./catalogSlice"
import styles from './styles.module.scss'



export const CatalogInspector = memo(() => {
  const catalogs = useAppSelector(state => state.catalogs.catalogs)
  const currentCatalogId = useAppSelector(state => state.catalogs.currentCatalogId)
  const catalog = useAppSelector(catalogsSlice.selectors.currentCatalog)
  const dispatch = useAppDispatch()

  return (
    <div className={styles.inspector}>
      <div>
        <select value={currentCatalogId} onChange={e => dispatch(catalogsSlice.actions.catalogSelected({ id: e.currentTarget.value }))}>
          <option value={undefined}>Select...</option>
          {catalogs.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {catalog && (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                {catalog.fields.map((f, i) => (
                  <th key={i}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalog.attributes.slice(0, 100).map((r, i) => (
                <tr key={i}>
                  {catalog.fields.map((_f, j) => (
                    <td key={j}>{r[j]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
})
setDisplayName({ CatalogInspector })
