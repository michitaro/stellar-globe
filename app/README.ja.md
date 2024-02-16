## 概要

JupyterLiteの登場によりJupyterはクライアントサイドで完結する環境で動くようになった。
JupyterLiteはinteractiveなmatplotlib, numpy, astropyなどが動作する。

hscMap4に存在していた、グラフ表示機能、ウインドウ機能などをJupyterの機能を利用することで実現できる。
Jupyterの機能で実現できる機能はhscMap本体には含めないこととしコード量削減をはかる。

## 設計

* Reduxを使用
  * 自動的にJupyterから呼び出せるAPIが整備される。
  * （RTKにより以前に比べRedux関連のコード記述量が減っている）

## TODO

* [x] 右クリック
  * [x] SIMBAD
* [x] カタログdialog
* [ ] カタログクリックイベント
* [ ] Jupyter Region
* [ ] 位置、階調同期Dock