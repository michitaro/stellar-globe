const path = require('path')
const fs = require('fs')
const Ajv = require("ajv")
const standaloneCode = require("ajv/dist/standalone").default
const root = require('../jsonschema/root.json')


function main() {
  const schemata = []

  for (const mapName of ['LayerProps', 'MessageToJS']) {
    const parent = extractSchema(root, [mapName])
    for (const k of Object.keys(parent.properties)) {
      const $id = `${mapName}_${k}`
      const s = { ...extractSchema(parent, [k]), $id }
      schemata.push(s)
    }
  }

  const ajv = new Ajv({ schemas: schemata, code: { source: true, esm: true, es5: true, lines: true, optimize: true } })
  let moduleCode = standaloneCode(ajv)
  fs.writeFileSync(path.join(__dirname, "../src/typeValidators.js"), moduleCode)
}


function extractSchema(schema, routes) {
  function _() {
    const target = dig(schema, routes)
    const newSchema = {
      ...target,
      definitions: cleanupDefinitions(target, schema.definitions),
    }
    return newSchema
  }

  function dig(schema, routes, definitions = {}) {
    definitions = { ...schema.definitions ?? {}, ...definitions }
    schema = dereference(schema, definitions)
    if (routes.length === 0) {
      return schema
    }
    else {
      const [route, ...rest] = routes
      const nextSchema = schema.properties[route]
      return dig(nextSchema, rest, definitions)
    }
  }

  function isRef(obj) {
    return (obj instanceof Object) && !!obj.$ref
  }

  function dereference(obj, definitions) {
    if (isRef(obj)) {
      /** @type {string} */
      const $ref = obj.$ref
      console.assert($ref.startsWith('#/definitions/'))
      return definitions[definitionKey($ref)]
    }
    return obj
  }

  function definitionKey($ref) {
    return $ref.slice('#/definitions/'.length)
  }

  function cleanupDefinitions(schema, definitions) {
    const usedDefinitaions = new Set()
    const walk = (o) => {
      if (isRef(o)) {
        const key = definitionKey(o.$ref)
        if (!usedDefinitaions.has(key)) {
          usedDefinitaions.add(definitionKey(o.$ref))
          walk(definitions[key], definitions)
        }
      }
      else if (o instanceof Array) {
        o.forEach(c => walk(c))
      }
      else if (o instanceof Object) {
        Object.keys(o).forEach(k => {
          if (k !== 'definitions') {
            walk(o[k])
          }
        })
      }
    }
    walk(schema)
    return Object.fromEntries(
      Array.from(usedDefinitaions.values()).map(k => [k, definitions[k]])
    )
  }

  return _()
}


main()
