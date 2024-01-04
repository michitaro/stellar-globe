* Dialog
  * 概要
    * dragできる
    * クリックでz-indexを調整
    * 大きさの決め方
      * 指定なし
        * resizable: false
          * 常に内容により決まる
        * resizable: true
          * マウント時に内容により決まる
          * サイズ変更後はサイズが保持される
          * サイズ変更前は内容により自動で変わる
      * 指定あり
        * width, heightで指定。(ピクセル単位でなくても良い。right, leftの組み合わせでは決められない)
        * resizable: false
          * 指定と内容により決まる (widthだけの指定だと高さが可変になったり。)
        * resizable: true
          * マウント時に指定と内容により決まる
          * 以後の内容の変更によっては変わらない
    * 初期位置の決め方
      * 指定あり
        * マウント時にその値で決める
        * left, top, right, bottomで決める
      * 指定なし
        * マウント時に自動で決める
    * 実装
      * useState({ size, position })
        * positionのみの場合がある

  * props
    * title
    * children
    * resizable: boolean
    * positionHint?
    * size?

* Position = { left, top }
* Size = { width, height }
* Rect = Position & Size

* Resizable
  * props
    * nodeRef
    * rect: Rect | undefined
    * onChange: (rect: Rect) => void
