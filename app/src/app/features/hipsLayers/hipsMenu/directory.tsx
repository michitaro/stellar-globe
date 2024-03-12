import { MenuItem, SubMenu } from "@szhsin/react-menu"
import { Fragment, Suspense, memo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Icon } from "../../../../common/components/Icon"
import { SmallLoader } from "../../../../common/components/Loader"
import { useAppDispatch } from "../../../store/hooks"
import { parseHipsProperties } from "../HipsProperties"
import { hipsLayersSlice } from "../hipsLayersSlice"


export function HipsDirectoryMenu() {
  return (
    <ErrorBoundary fallback={<MenuItem disabled><Icon type='error' /></MenuItem>}>
      <SubMenu label="Directory">
        <Suspense fallback={<MenuItem disabled>Loading...<SmallLoader /></MenuItem>}>
          <RootDirecotry />
        </Suspense>
      </SubMenu>
    </ErrorBoundary>
  )
}


function RootDirecotry() {
  const root = useHipsDirectoryRoot()
  return (
    <Fragment>
      {root.children.map(child => (
        <HipsEntryOrDirectory key={child.id} entry={child} />
      ))}
    </Fragment>
  )
}


const HipsEntryOrDirectory = memo(({ entry }: { entry: HipsEntryOrDirectory }) => {
  if (entry.type === 'directory') {
    return <HipsDirectorySubMenu directory={entry} />
  }
  return <HipsEntryMenuItem entry={entry} />
})


function HipsDirectorySubMenu({ directory }: { directory: HipsDirectory }) {
  return (
    <SubMenu label={directory.name} overflow="auto">
      {directory.children.map(child => (
        <HipsEntryOrDirectory key={child.id} entry={child} />
      ))}
    </SubMenu>
  )
}


function HipsEntryMenuItem({ entry }: { entry: HipsEntry }) {
  const dispatch = useAppDispatch()
  const onClick = () => {
    dispatch(hipsLayersSlice.actions.baseUrlChanged({ baseUrl: entry.baseUrl }))
  }
  const id = entry.id.split('/').pop()

  return (
    <MenuItem
      onClick={onClick}
    >
      {id} ({entry.title})
    </MenuItem>
  )
}


const rootCache: {
  promise?: Promise<HipsDirectory>
  error?: any
  result?: HipsDirectory
} = {}


function useHipsDirectoryRoot(): HipsDirectory {
  if (!rootCache.promise) {
    const promise = fetchHipsDirectory()
    rootCache.promise = promise
    promise.then(result => {
      rootCache.result = result
    }).catch(error => {
      rootCache.error = error
    })
  }
  const { promise, error, result } = rootCache
  if (result) {
    return result
  }
  throw error ?? promise
}


type HipsDirectory = {
  type: 'directory'
  id: string
  name: string
  children: (HipsDirectory | HipsEntry)[]
}


type HipsEntry = {
  type: 'entry'
  id: string
  baseUrl: string
  title: string
}


type HipsEntryOrDirectory = HipsEntry | HipsDirectory


async function fetchHipsDirectory(): Promise<HipsDirectory> {
  const url = `//alasky.cds.unistra.fr/MocServer/query?expr=(hips_frame%3Dequatorial%2Cgalactic%2Cecliptic+||+hips_frame%3D!*)+%26%26+dataproduct_type!%3Dcatalog%2Ccube+%26%26+hips_service_url%3D*&get=record`
  const response = await (await fetch(url)).text()
  const hipsTextList = response.split('\n\n')

  const root: HipsDirectory = {
    type: 'directory',
    id: '$id',
    name: '$name',
    children: [],
  }

  const hipsList = hipsTextList.map(hipsText => {
    const h = parseHipsProperties(hipsText)
    return Object.fromEntries(h.cards.map(c => [c.key, c.value]))
  })

  const mkdirForEntry = (e: HipsEntry) => {
    const routes = e.id.split('/')
    let current = root
    for (let i = 0; i < routes.length - 1; i++) {
      const route = routes[i]
      const id = routes.slice(0, i + 1).join('/')
      let next = current.children.find(c => c.id === id && c.type === 'directory') as HipsDirectory | undefined
      console.log(next)
      if (!next) {
        next = {
          type: 'directory',
          id,
          name: route,
          children: [],
        }
        current.children.push(next)
      }
      current = next
    }
    return current
  }

  for (const h of hipsList) {
    try {
      const id = assertNotNull(h['ID'])
      const name = h['obs_title'] ?? id
      const entry: HipsEntry = {
        type: 'entry',
        id,
        baseUrl: assertNotNull(h['hips_service_url']),
        title: name,
      }
      const parent = mkdirForEntry(entry)
      parent.children.push(entry)
    }
    catch (e) {
      console.warn(`Invalid HiPS properties: ${JSON.stringify(h)}`)
    }
  }

  return simplifyDirectory(root)
}


function assertNotNull<T = any>(value: T): T {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined')
  }
  return value
}


function simplifyDirectory(parent: HipsDirectory): HipsDirectory {
  if (parent.children.length === 1) {
    const onlyChild = parent.children[0]
    if (onlyChild.type === 'directory') {
      const d = simplifyDirectory(onlyChild as HipsDirectory)
      return {
        ...d,
        id: parent.id,
        name: `${parent.name}/${d.name}`,
      }
    }
  }

  const children = parent.children.map(child => {
    if (child.type === 'directory') {
      if (child.children.length === 1 && child.children[0].type === 'directory') {
        const newChild = simplifyDirectory(child.children[0] as HipsDirectory)
        return {
          ...newChild,
          id: child.id,
          name: `${child.name}/${newChild.name}`,
        }
      }
    }
    return child
  })
  return { ...parent, children }
}