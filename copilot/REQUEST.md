* [x] シンボル名の変更の提案

  このライブラリ群にはシンボルの末尾が`$`で終わるものがいくつかあります。
  (特に`react-stellar-globe`に多いです)
  これらはcoreライブラリのシンボルと衝突しないために付けられたものですが、
  ラッパーだけの利用者にとっては紛らわしいです。

  これを解消するためのシンボル名の変更を提案してください。
  まずは現状の使われ方を調査する必要があるでしょう。

  → 提案書を作成しました: [copilot/symbol-rename-proposal.md](symbol-rename-proposal.md)

* [x] 提案書の整理

  案1でいきましょう。
  提案書をその方向で整理して下さい。

  → 整理しました

* [x] 変更の実施

  提案に基づいて変更を実施してください。
  テスト・ビルドの確認もお願いします。

  ライブラリ利用者のための移行ドキュメントの整備もお願いします。

  → 完了しました:
  - react-stellar-globe内のシンボル名を変更し、deprecationアノテーションを追加
  - READMEを更新
  - examples/BasicUsage/main.tsxを更新
  - app/内の使用箇所を更新
  - 移行ドキュメントを作成: react-stellar-globe/MIGRATION.md, MIGRATION.ja.md
  - ビルド・テストを確認済み

* [ ] 指示者に追加の依頼がないか確認

  `./copilot/ask_for_instructions` を使用して指示者に確認を行うこと。