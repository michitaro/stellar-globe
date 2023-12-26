import Ajv from "ajv"
import standaloneCode from "ajv/dist/standalone/index.js"
import { writeFileSync } from 'fs'
import root from './jsonschema/root.json' assert { type: "json" }


function main() {
  const keys = Object.keys(root.properties)
  const schemata = keys.map(key => ({
    $id: key,
    ...extractSchema(root, [key])
    ,
  }))
  const ajv = new Ajv({ schemas: schemata, code: { source: true, esm: true, es5: true, lines: true, optimize: true } })
  let moduleCode = standaloneCode(ajv)
  writeFileSync("./src/typeGuard/typeValidators.js", moduleCode)
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
