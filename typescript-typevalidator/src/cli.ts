import Ajv from 'ajv'
import standaloneCode from "ajv/dist/standalone/index.js"
import { ArgumentParser } from 'argparse'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as TJS from "typescript-json-schema"
import { walk } from './schemautil'
// @ts-ignore
import createIsTemplate from './createIsTemplate.ts?raw'


export function main() {
  type Args = {
    jsonschema: boolean
    typename: string
    out: string
    project: string
    useCache: boolean
    validatorNameKey: string
    onlyIndex: boolean
  }

  const parser = new ArgumentParser({})
  parser.add_argument('--jsonschema', '-j', { action: 'store_true', default: false })
  parser.add_argument('--typename', '-t', { type: String, required: true })
  parser.add_argument('--project', '-p', { type: String, default: '.' })
  parser.add_argument('--out', '-o', { type: String, required: true })
  parser.add_argument('--useCache', '-c', { default: false, action: 'store_true' })
  parser.add_argument('--validatorNameKey', '-k', { default: '__validatorName__', type: String })
  parser.add_argument('--onlyIndex', '-i', { default: false, action: 'store_true' })
  const args: Args = parser.parse_args()

  mkdirP(args.out)

  writeFileSync(`${args.out}/createIs.ts`, createIsTemplate)
  if (args.onlyIndex) {
    return
  }

  if (args.useCache && !args.jsonschema) {
    throw new Error('The useCache option requires the jsonschema option to be provided.')
  }

  const root = ((): TJS.Definition => {
    const jsonschemaFile = `${args.out}/jsonschema.json`
    if (args.useCache && existsSync(jsonschemaFile)) {
      return JSON.parse(readFileSync(jsonschemaFile, 'utf-8'))
    }
    else {
      const root = jsonSchemaFromTsconfig(`${args.project}/tsconfig.json`, args.typename)
      if (args.jsonschema) {
        writeFileSync(jsonschemaFile, JSON.stringify(root, null, 2))
      }
      return root
    }
  })()

  const schemata: TJS.Definition[] = []
  walk(root, node => {
    const key = node.properties?.[args.validatorNameKey]
    if (isConstString(key)) {
      delete node.properties?.[args.validatorNameKey]
      if (node.required) {
        node.required.splice(node.required.indexOf(args.validatorNameKey), 1)
      }
      const $id = key.const
      schemata.push({
        $id,
        ...node,
        definitions: root.definitions,
      })
    }
  })

  const ajv = new Ajv({
    schemas: schemata,
    code: { source: true, esm: true, es5: true, lines: true, optimize: true, }
  })
  const validatorCode = standaloneCode(ajv)
  writeFileSync(`${args.out}/ajv.js`, validatorCode)
}


function isConstString(node: any): node is { const: string } {
  return node && (node as any).const !== undefined
}


function jsonSchemaFromTsconfig(tsconfigPath: string, typeName: string) {
  const program = TJS.programFromConfig(tsconfigPath)
  const schema = TJS.generateSchema(program, typeName, {
    noExtraProps: true,
    required: true,
  }) as TJS.Definition
  return schema
}


function mkdirP(path: string) {
  const parts = path.split('/')
  let current = ''
  for (const part of parts) {
    current += part + '/'
    if (!existsSync(current)) {
      mkdirSync(current)
    }
  }
}


main()
