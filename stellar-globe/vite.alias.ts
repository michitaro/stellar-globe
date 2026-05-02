import tsconfig from './tsconfig.json'


export function createTsconfigAlias() {
  const { baseUrl, paths } = tsconfig.compilerOptions
  return Object.fromEntries(
    Object.entries(paths).map(([from, to]) => {
      const fromMatch = from.match(/(.*)\*$/)
      console.assert(fromMatch)
      console.assert(to.length === 1)
      const target = to[0]
      const toMatch = target.match(/\.\/(.*)\*$/)
      console.assert(toMatch)
      return [
        fromMatch[1],
        `${__dirname}/${baseUrl}/${toMatch[1]}`,
      ]
    }),
  )
}
