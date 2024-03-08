# TypeScript TypeValidator

TypeScriptの型定義ファイルから、runtimeでの型検証を行うためのコードを生成するツール。

```bash
npm install -D ../typescript-typevalidator
node ./node_modules/@stellar-globe/typescript-typevalidator/dist/cli.js -o ./src/typeValidator -t JsonSchema
```

```TypeScript
import { createIs } from './typeValidator/createIs'

const isSomeType = createIs<'SomeType'>()

if (isSomeType(value)) {
  // value is SomeType
} else {
  // value is not SomeType
}
```
