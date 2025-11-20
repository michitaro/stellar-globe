# Copilot Instructions

## 自然言語について

* コード中のコメントは日本語、または英語で記述する。
* ドキュメントのmarkdownファイルは `.ja.md` に日本語を `.md` に英語を書いて両方を用意する。
  * 開発時は日本語版ドキュメントを使う。
  * 日本語版ドキュメントを更新したら英語版も更新する。

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

このセクションは常に最新の状態に保つこと。