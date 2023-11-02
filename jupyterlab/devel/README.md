# Message仕様

* Python → StellarGlobe
    * 型
        ```typescript
        type MessageToStellarGlobe = {
            type: string
            args?: any
        }
        ```
    * `type`によって`args`の型が変わる。
    * JSON Schemaによる型の定義がある。JupyerLab側でvalidateする。型に問題があれば`alert`を出し、そのメッセージを無視する。
    * メッセージによってはJupyterLabが処理するもの、StellarGlobeが処理するものがあるが、Pythonからそれらを特に区別しない。

* StellarGlobe → Python
    * 型
        ```typescript
        type MessageToPython = {
            type: string
            args?: any
        }
        ```
    * `type`により`args`の型は変わる。

## JSON Schema

### 生成手順

1. `typescript-json-schema`により、必要な型定義をすべて含んだJSON Schemaを作る
    * `./src/types.ts`の`JsonSchema`で定義
1. ↑のJSON Schemaファイルを解析し必要なSchemaを抽出しファイルに保存
    * `./devel/extractSchema.js`に実装

## Validation

ajvのstandaloneコードを使う。


## Pythonの型チェック

Python内での厳密な型チェックはできない。

