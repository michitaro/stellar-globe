# StellarGlobeBridge

このアプリケーションはStellarGlobeをMessaing APIで操作できるようにしたものである。（これをcoreと呼ぶ）
このアプリケーションを`iframe`や`window.open`で開き、それに対して`postMessage`でメッセージを送信したり、`window.addEventListener('message', ...)`によってメッセージを受信できる。（これをする主体をwrapper呼ぶ）

典型的な使い方は次のようになる。

```TypeScript
/**
次のようなHTMLを想定
<iframe src="/webui/" id="stellar-globe" />
**/

const iframeElement = document.querySelector('#stellar-globe')

iframeElement.contentWindow.postMessage({ type: 'jumpTo', jumpTo: { ... } })

window.addEventListener('message', event => {
  if (event.data.type === 'callback') {
    ...
  }
})
```

## Pythonとの連携

Pythonとcoreを連携させるには何らかの方法でPythonから`postMessage`を呼ぶ必要があるが、次のような方法が考えられる。

* PythonがHTTP Serverとなる場合
    * HTTP ServerがwrapperをserveしwrapperがHTTP Serverとの仲介をする。
* JupyterLab内からの利用
    * JupyterLabのextensionがwrapperを担う。Pythonからwrapperを呼び出す。

### Callback

Cameraの移動イベントなどcoreからwrapperへ通信が発生することがある。
wrapperは`window.addEventListener('message', messageHandler)`でこれを受け取り、Pythonへこれを通知する。

