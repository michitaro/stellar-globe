* [x] pyrightについて

  現在pythonパッケージの静的型チェックにはpyrightを使っている。
  そのために各pythonパッケージのディレクトリ内にnode_modulesやpackage.jsonが存在している。
  これらを削除してuvによってインストールしたpyrightを使うようにしてください。
  また、それを呼び出すMakefileのコマンドも修正してください。
  実際に型チェックを行い、問題がないことを確認してください。

* [ ] Pythonからcatalogを追加する時のcatalog windowの表示について

  `python-integration/python/src/hscmap/catalogs.py:Catalog._new`で`open_catalog_table`の値が現在無視されています。

  これが反映されるようにしてください。

  `app/src/app/features/catalog/catalogSlice.ts`の`catalogAdded`アクションを修正する必要があるかもしれません。

  関連するドキュメントを読んで、型ファイルなどを適宜更新してください。

* [ ] 今回の作業を踏まえての`app`や`python-integration/python`の変更のドキュメントの改良

  今回の作業を踏まえて、`app/README.ja.md`や`python-integration/python/README.ja.md`の内容がわかりにくいところがあれば改良してください。

* [ ] 指示者に追加の依頼がないか確認

  `./copilot/ask_for_instructions` を使用して指示者に確認を行うこと。
