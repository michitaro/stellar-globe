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

* Naming convention
    * JavaScript的な名前
    * 角度はRadian
    * 時間はms

## JSON Schema

### 生成手順

```bash
jlpm run refresh-type-validators-and-datamodels
```
