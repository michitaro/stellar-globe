# 構築メモ

1. [公式チュートリアル](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html)に沿って`copier`などでテンプレートを準備。

1. `package.json`に`@stellar-globe/*`を追加。

    ただし、これらは`jlpm add`や`jlpm link`で行うのではなく`package.json`の`dependencies`に対して手動で

    ```json
            "@stellar-globe/react-stellar-globe": "link:../react-stellar-globe",
            "@stellar-globe/stellar-globe": "link:../stellar-globe",
    ```
    
    のような行を追加した。(`jlpm add`で`npm link`のようなことをする方法がわからなかった)

## storeの同期

* frontendは1つとは限らない?
  * １つと限られる
    * windowの作成が必ずPythonから行われるので。
* Python側とfrontend側でstoreを同期したい。
* storeの本体はfrontendにある。
  * storeの更新ロジックはfrontendにあるので
  * frontendのstoreの更新時には


## 制限

* セルの実行中は comm._on_msg が呼ばれないようだ。
  * ということは・・セルの実行によってフロントエンドの何かを待つことはできない
  * 例えば python から 何かリクエストをfrontendに出して、結果が来るのを待つ、など。
  * これは別のセルを手動で実行しないといけない

## セルの実行中にfrontendからPythonへメッセージを通知する方法

* commによらない方法が必要。
* ファイルやソケットなどプロセス間通信の手段を使う。
* JupyterLab Extension内でContentsManagerを使うことでファイル操作が可能。
  * これはcommとは別の経路での通信の様だ。
* これを使いセルの実行中にfrontendからのレスポンスを待ち受けることができる。
* FrontendはContentsManager経由で次の様なUTF8のファイルを作る。
  ```typescript
  `${contents.length}\n${contents}`
  ```
* Python側では↑の形式であることを仮定し、ファイルの完成を待つ。