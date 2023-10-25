const path = require('path')
const fs = require('fs')


function main() {
  const schema = require('../jsonschema/root.json')
  dumpOne(schema, ['MessageToStellarGlobe'], './jsonschema/MessageToStellraGlobe.json')
  dumpChildren(schema, ['MessageToJupyterLabMap'], './jsonschema/MessageToJupyterLab')
  dumpChildren(schema, ['MessageToStellarGlobeMap'], './jsonschema/MessageToStellraGlobe')
  dumpChildren(schema, ['LayerPropsMap'], './jsonschema/LayerProps')
}


function dumpOne(schema, routes, out) {
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(
    out,
    JSON.stringify(extractSchema(schema, routes), null, 2),
  )
}


function dumpChildren(schema, routes, directory) {
  const parent = extractSchema(schema, routes)
  fs.mkdirSync(directory, { recursive: true })
  Object.keys(parent.properties).forEach(child => {
    fs.writeFileSync(
      `${directory}/${child}.json`,
      JSON.stringify(extractSchema(parent, [child]), null, 2),
    )
  })
}


function extractSchema(schema, routes) {
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
    return obj && !!obj.$ref
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

  const target = dig(schema, routes)
  const newSchema = {
    ...target,
    definitions: cleanupDefinitions(target, schema.definitions),
  }
  return newSchema
}


main()
