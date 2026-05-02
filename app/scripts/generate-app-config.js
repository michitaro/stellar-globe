import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const compiledConfigRoot = path.join(appRoot, '.generated-app-config')
const outputPath = path.join(appRoot, 'src', 'app', 'env', 'generated.json')
const sourceConfigPath = resolveAppPath(process.env.APP_CONFIG ?? './config/app.config.ts', 'APP_CONFIG')
const compiledConfigPath = resolveCompiledConfigPath(sourceConfigPath)

const configModule = await import(pathToFileURL(compiledConfigPath).href)

if (!('appConfig' in configModule)) {
  throw new Error(`Config module must export "appConfig": ${path.relative(appRoot, sourceConfigPath)}`)
}

const resolvedAppConfig = await materializeAppConfig(configModule.appConfig, sourceConfigPath)

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(resolvedAppConfig, null, 2)}\n`, 'utf8')

console.log(`Generated ${path.relative(appRoot, outputPath)} from ${path.relative(appRoot, sourceConfigPath)}`)

async function materializeAppConfig(appConfig, sourcePath) {
  return {
    ...appConfig,
    cas: {
      ...appConfig.cas,
      sampleQueries: await Promise.all(appConfig.cas.sampleQueries.map(async query => ({
        ...query,
        sql: typeof query.sql === 'string'
          ? query.sql
          : await readConfigFile(query.sql.path, sourcePath),
      }))),
    },
  }
}

async function readConfigFile(relativePath, sourcePath) {
  const resolvedPath = relativePath.startsWith('file:')
    ? resolveFileUrl(relativePath, 'sql file')
    : resolveAppPath(relativePath, 'sql file', path.dirname(sourcePath))
  return readFile(resolvedPath, 'utf8')
}

function resolveCompiledConfigPath(sourcePath) {
  const relativeSourcePath = path.relative(appRoot, sourcePath)
  if (!relativeSourcePath.endsWith('.ts')) {
    throw new Error(`APP_CONFIG must point to a TypeScript file: ${relativeSourcePath}`)
  }

  return path.join(compiledConfigRoot, replaceExtension(relativeSourcePath, '.js'))
}

function replaceExtension(filePath, extension) {
  return filePath.slice(0, filePath.length - path.extname(filePath).length) + extension
}

function resolveAppPath(filePath, label, baseDir = appRoot) {
  const resolvedPath = path.resolve(baseDir, filePath)
  const relativePath = path.relative(appRoot, resolvedPath)
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`)) {
    throw new Error(`${label} must stay inside app/: ${filePath}`)
  }
  return resolvedPath
}

function resolveFileUrl(fileUrl, label) {
  const resolvedPath = fileURLToPath(fileUrl)
  const relativePath = path.relative(appRoot, resolvedPath)
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`)) {
    throw new Error(`${label} must stay inside app/: ${fileUrl}`)
  }
  return resolvedPath
}
