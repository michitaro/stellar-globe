# Copilot Instructions

## 自然言語について

* コード中のコメントは日本語、または英語で記述する。
* markdownファイルは `.ja.md` と `.md` の両方を用意する。
  * `.ja.md`は日本語、`.md`は英語で書く。
  * 日本語版の内容が優先される。

## プロジェクトの目的

このプロジェクト「Stellar Globe」は、全天のビューワーです。
Hyper Suprime-CamのPublic Data Releaseで使われており、以下の特徴があります。

* 任意の位置を任意の倍率で高速に表示できる (WebGL利用)
* 複数バンドのデータから動的にカラー画像を生成可能
* hscMap形式、HiPS形式に対応
* カタログのオーバレイが可能

## 開発方針

* このファイル (`.github/copilot-instructions.md`) が実コードと乖離しないよう、コードの変更を常に反映させる。
* 実装は細かい単位で動作確認を行う。
* このプロジェクトはいくつかのコンポーネントに分かれており、それぞれの動作確認はそれぞれのディレクトリにcdする必要がある。動作確認の際には適切なディレクトリで行うこと。
* フロントエンドのテストは `npm run test:noninteractive` を使用して非interactive modeで実行できるようにすること。

## ドキュメント参照

必要に応じて以下のドキュメントを参照してください。

### `react-stellar-globe/docs`
(TypeDocにより生成されたAPIドキュメント)
* `react-stellar-globe/docs/index.html`
* `react-stellar-globe/docs/modules.html`

### `python-integration/python/docs`
(SphinxによるPython連携ライブラリのドキュメントソース)
* `python-integration/python/docs/index.rst`

### その他
以下のディレクトリには現在ドキュメントが存在しないか、空です。
* `stellar-globe/docs`
* `react-draggable-dialog/docs`
* `app/docs`
