* [ ] pyrightについて

  現在pythonパッケージの静的型チェックにはpyrightを使っている。
  そのために各pythonパッケージのディレクトリ内にnode_modulesやpackage.jsonが存在している。
  これらを削除してuvによってインストールしたpyrightを使うようにしてください。
  また、それを呼び出すMakefileのコマンドも修正してください。
  実際に型チェックを行い、問題がないことを確認してください。

* [ ] 指示者に追加の依頼がないか確認

  `./copilot/ask_for_instructions` を使用して指示者に確認を行うこと。
