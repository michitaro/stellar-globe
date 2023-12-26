# 構築メモ

1. [公式チュートリアル](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html)に沿って`copier`などでテンプレートを準備。

1. `package.json`に`@stellar-globe/*`を追加。

    ただし、これらは`jlpm add`や`jlpm link`で行うのではなく`package.json`の`dependencies`に対して手動で

    ```json
            "@stellar-globe/react-stellar-globe": "link:../react-stellar-globe",
            "@stellar-globe/stellar-globe": "link:../stellar-globe",
    ```
    
    のような行を追加した。(`jlpm add`で`npm link`のようなことをする方法がわからなかった)
