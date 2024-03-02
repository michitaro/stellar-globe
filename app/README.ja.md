## 概要

JupyterLiteの登場によりJupyterはクライアントサイドで完結する環境で動くようになった。
JupyterLiteはinteractiveなmatplotlib, numpy, astropyなどが動作する。

hscMap4に存在していた、グラフ表示機能、ウインドウ機能などをJupyterの機能を利用することで実現できる。
Jupyterの機能で実現できる機能はhscMap本体には含めないこととしコード量削減をはかる。

## 設計

* Reduxを使用
  * 自動的にJupyterから呼び出せるAPIが整備される。
  * （RTKにより以前に比べRedux関連のコード記述量が減っている）

## 型情報のエクスポート

* RTKによって作られる方は`vite-dts-plugin`を使用して、型情報をエクスポートすることはできなかった。
* 外部へexportする型だけ`export.ts`に手動で作り、それを↓でエクスポートする。

    ```bash
    tsc --declaration --declarationDir types --emitDeclarationOnly --noEmit false ./export.ts
    ```

* 関連する型の実装は`export.ts`をimportし、代入可能かどうかをコンパイル時にチェックする。
      
## TODO

* [x] 右クリック
  * [x] SIMBAD
* [x] カタログdialog
* [ ] ~~カタログクリックイベント~~
* [x] Jupyter Region
* [ ] 位置、階調同期Dock
