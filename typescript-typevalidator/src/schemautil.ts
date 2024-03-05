import { Definition } from "typescript-json-schema"


type WalkOptions = {
  invokeOnRefs?: boolean
}


export function walk(
  root: Definition,
  cb: (node: Definition, depth: number) => void,
  {
    invokeOnRefs = false,
  }: WalkOptions = {},
) {
  const alreadyVisited = new Set<string>()

  const dig = (
    parent: Definition,
    depth: number,
  ) => {
    if (isRef(parent)) {
      if (alreadyVisited.has(parent.$ref)) {
        return
      }
      alreadyVisited.add(parent.$ref)
      if (invokeOnRefs) {
        cb(parent, depth)
      }
      parent = dereference(parent.$ref, root.definitions)
    }
    cb(parent, depth)
    if (parent.properties) {
      Object.values(parent.properties).forEach(child => {
        if (child instanceof Object) {
          dig(child, depth + 1)
        }
      })
    }
    if (parent.items) {
      if (parent.items instanceof Array) {
        parent.items.forEach(child => {
          if (child instanceof Object) {
            dig(child, depth + 1)
          }
        })
      }
      else if (parent.items instanceof Object) {
        dig(parent.items, depth + 1)
      }
    }
    if (parent.anyOf) {
      parent.anyOf.forEach(child => {
        if (child instanceof Object) {
          dig(child, depth + 1)
        }
      })
    }
    if (parent.allOf) {
      parent.allOf.forEach(child => {
        if (child instanceof Object) {
          dig(child, depth + 1)
        }
      })
    }
    if (parent.oneOf) {
      parent.oneOf.forEach(child => {
        if (child instanceof Object) {
          dig(child, depth + 1)
        }
      })
    }
  }

  dig(root, 0)
}


function dereference(ref: string, definitions: Definition['definitions']): Definition {
  if (!definitions) {
    throw new Error("Definitions are undefined.")
  }
  const key = ref.slice('#/definitions/'.length)
  const def = definitions[key]
  if (!(def instanceof Object)) {
    throw new Error(`Definition ${key} not found.`)
  }
  return def
}


function isRef(node: Definition): node is Definition & { $ref: string } {
  return !!node.$ref
}


export function collectUsedDefinitions(root: Definition, node: Definition) {
  if (root.definitions === undefined || !(root.definitions instanceof Object)) {
    throw new Error("Definitions are undefined.")
  }

  const definitions = root.definitions as Record<string, Definition>
  const usedDefinitions: Record<string, Definition> = {}

  walk(root, (node, depth) => {
    if (isRef(node)) {
      const key = node.$ref.slice('#/definitions/'.length)
      usedDefinitions[key] = definitions[key]
      // console.log(('  '.repeat(depth)) + `- ${key}`)
    }
  }, { invokeOnRefs: true })

  return usedDefinitions
}
