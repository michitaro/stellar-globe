## 概要

JupyterLiteの登場によりJupyterはクライアントサイドで完結する環境で動くようになった。
JupyterLiteはinteractiveなmatplotlib, numpy, astropyなどが動作する。

hscMap4で実装したグラフ表示機能やフレー機能はhscMapをJupyterLiteと連携させることで実現可能なので、
これらのコードはhscMap本体からは削除しコード量を削減する。

## 設計

* Reduxを使用
  * 自動的にJupyterから呼び出せるAPIが整備される。
  * （RTKにより以前に比べRedux関連のコード記述量が減っている）

* ディレクトリ構成
  * `/src/{components|hooks|utils}`
    * 別アプリでも再利用可能なレベルで機能がhscMapに依存しない{React Component|React Hook|ユーティリティ}
  * `/src/app`
    * このアプリ特有のコード
    * `/src/app/features`
      * このディレクトリ内に機能ごとに１つディレクトリを作る
      * １つのfeatureに１つのsliceになることが多いか？
      * slice内では他のsliceにアクセスできない
      * しかしexampleではfeatures内のコードが `useAppState` を使いfeature外に依存している
        * https://github.com/reduxjs/redux-templates/blob/master/packages/vite-template-redux/src/features/counter/Counter.tsx
        * feature内ではpresentationコンポーネントだけ置くなどしてfeatureに閉じた構成にすることもできる

* TODO
  * [ ] ツールでドラッグが発生するまでにイベントを無視する時間を作る