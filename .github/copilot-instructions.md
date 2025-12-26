# Copilot Instructions

Copilotが作業時に遵守すべきルール。このファイルは常にコードと同期させること。

## 作業時留意点

- こまめにgit commitする（`copilot`の中身も含む）
- チェックリスト形式の依頼は、その項目の完了時にチェックを入れる
- コードスニペット実行時はファイルに保存して実行（`./copilot`内に保存）
- コマンド内で`>`は避ける（自動許可されないため）
- 指示者への確認は `./copilot/ask_for_instructions` を使用
  - 作業が進められない場合や各項目完了時のレビュー依頼に活用
- fish shellを使用。bash特有の構文(`read/do/while`など)は不可。
  - コマンド置換 `(command)` は使用禁止（auto approvalが効かないため）
  - 代わりに変数への代入を使用: `set var (command); echo $var`
- 後方互換性は不要（新規開発中のため最適なコードを優先）
- ドキュメント・コメントは日本語で記述


## 自然言語について

* コード中のコメントは日本語、または英語で記述する。
* ドキュメントのmarkdownファイルは `.ja.md` に日本語を `.md` に英語を書いて両方を用意する。
  * 開発時は日本語版ドキュメントを参照して下さい。
  * 日本語版ドキュメントを更新したら英語版も更新してください。

## 開発方針

* 実装は細かい単位で動作確認を行う。
* このプロジェクトはいくつかのコンポーネントに分かれており、それぞれの動作確認はそれぞれのディレクトリにcdする必要がある。動作確認の際には適切なディレクトリで行うこと。
* フロントエンドのテストは `npm run test:noninteractive` を使用して非interactive modeで実行できるようにすること。

## ドキュメント参照

必要に応じて以下のドキュメントを参照してください。

### プロジェクト全体
* `README.ja.md`: プロジェクト全体の概要、コンポーネント構成、依存関係

### `stellar-globe/`
* `stellar-globe/README.ja.md`: コアライブラリの概要、使用方法、主要クラス
* `stellar-globe/demo/`: デモコード
* TypeDocによるAPIドキュメント生成: `npm run typedoc` で生成される `docs/` ディレクトリ

### `react-stellar-globe/`
* `react-stellar-globe/README.ja.md`: Reactラッパーの概要、使用方法、主要コンポーネント
* `react-stellar-globe/examples/`: サンプルコード
* TypeDocによるAPIドキュメント生成: `npm run typedoc` で生成される `docs/` ディレクトリ

### `react-draggable-dialog/`
* `react-draggable-dialog/README.ja.md`: ダイアログコンポーネントの概要、使用方法
* `react-draggable-dialog/example/`: サンプルコード
* TypeDocによるAPIドキュメント生成: `npm run typedoc` で生成される `docs/` ディレクトリ

### `app/`
* `app/README.ja.md`: アプリケーションの構成、Python連携の型チェック機構
* `app/jsonschema/public.json`: 公開API用のJSON Schema

### `python-integration/python/`
* `python-integration/python/README.ja.md`: Pythonライブラリの概要、型チェック機構、Makefileの説明
* `python-integration/python/docs/`: Sphinxによるドキュメントソース

### `python-integration/jupyterlab-extension/`
* `python-integration/jupyterlab-extension/README.ja.md`: JupyterLab拡張の概要、開発手順、パッケージ構成

このセクションは常に最新の状態に保つこと。