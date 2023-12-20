import { FocusableItem, MenuItem } from "@szhsin/react-menu"
import { Fragment, Suspense, memo, useEffect, useState, useTransition } from "react"
import { useInstanceVariable } from "../../../common/hooks/useInstanceVaribale"
import { Debounce } from "../../../common/utils/debounce"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { hipsLayersSlice } from "./hipsLayersSlice"
import styles from './style.module.scss'
import { TomoegozenSubmenu } from "./tomoegozen"


export const HipsMenu = memo(() => {
  const dispatch = useAppDispatch()

  return (
    <Fragment>
      {/* <MenuItem onClick={() => dispatch(hipsLayersSlice.actions.baseUrlChanged({ baseUrl: '//alasky.cds.unistra.fr/Pan-STARRS/DR1/color-i-r-g' }))}>Pan-STARRS DR1</MenuItem> */}
      <HipsSearch />
      <TomoegozenSubmenu />
      <MenuItem onClick={() => dispatch(hipsLayersSlice.actions.baseUrlChanged({ baseUrl: undefined }))}>Clear</MenuItem>
    </Fragment>
  )
})
setDisplayName({ HipsMenu })


function HipsSearch() {
  const [searchText, setSearchText] = useState('')
  const [debouncedQuery, isPending] = useDebounceInTransition(400, searchText)

  return (
    <Fragment>
      <FocusableItem>{({ ref }) => (
        <Fragment>
          <input className={styles.search} ref={ref} type="search" value={searchText} placeholder="Search" onChange={e => {
            setSearchText(e.currentTarget.value)
          }} />
          {
            isPending && <progress style={{ marginLeft: '2em' }} />
          }
        </Fragment>
      )}</FocusableItem>
      <Suspense>
        <SearchResults query={debouncedQuery} />
      </Suspense>
    </Fragment>
  )
}

// useSearchResults に useRef で持たせることはできない
const searchCache = new Map<
  string,
  {
    promise: Promise<unknown>
    result?: HipsSurvey[]
    error?: string
  }
>

function useSearchResults(query: string): HipsSurvey[] {
  if (!searchCache.has(query)) {
    const promise = queryHiPS(query)
    searchCache.set(query, { promise })
    promise.then(result => {
      searchCache.get(query)!.result = result
    }).catch(error => {
      searchCache.get(query)!.error = error
    })
  }

  const { promise, error, result } = searchCache.get(query)!
  if (result) {
    return result
  }
  throw error ?? promise
}


const SearchResults = memo(({ query }: { query: string }) => {
  const searchResults = useSearchResults(query)
  const currentBaseUrl = useAppSelector(state => state.hipsLayers.baseUrl)
  const dispatch = useAppDispatch()
  return (
    <Fragment>
      {searchResults.map(r => (
        <MenuItem
          type='checkbox'
          checked={r.hips_service_url === currentBaseUrl}
          key={r.ID}
          onClick={() => dispatch(hipsLayersSlice.actions.baseUrlChanged({ baseUrl: r.hips_service_url }))}
        >
          {r.obs_title}
        </MenuItem>
      ))}
    </Fragment>
  )
})

setDisplayName({ SearchResults })


function useDebounceInTransition<T>(delay: number, value: T): [T, boolean] {
  const debounce = useInstanceVariable(() => Debounce(delay))
  const [debounced, setDebounced] = useState(value)
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    debounce(() => {
      startTransition(() => {
        setDebounced(value)
      })
    })
  }, [debounce, value])
  return [debounced, isPending]
}


async function queryHiPS(q: string) {
  if (q.length > 0) {
    const ac = new AbortController()
    const url = `//alasky.u-strasbg.fr/MocServer/query?hips_service_url*=*&casesensitive=false&obs_title=${encodeURIComponent(`*${q}*`)}&dataproduct_type=image&dataproduct_subtype=*&get=record&fields=ID,obs_title,hips_service*,hips_status*&fmt=json`
    const promise = (await fetch(url, { signal: ac.signal })).json() as Promise<HipsSurvey[]>
    return Object.assign(promise, { abort: () => ac.abort() })
  }
  else {
    return Object.assign(Promise.resolve<HipsSurvey[]>([]), { abort: () => { } })
  }
}


type HipsSurvey = {
  ID: string
  obs_title: string
  hips_service_url: string
  [name: string]: string
}
