# CAS SQL access 調査メモ

## 概要

`../old-hscmap` には、`/datasearch/skymaps_api/` 配下の API を使って CAS へ SQL を投げる実装がある。クライアントは同一オリジン上の `datasearch` アプリに依存しており、セッション確立後に `catalog_jobs` API を叩く構成になっている。

## API

### 1. セッションアクセストークン取得

- `GET /datasearch/skymaps_api/session/access_token?source_origin=<location.origin>`
- レスポンスは `{ access_token: string }`
- 取得したトークンはクライアント側でメモリキャッシュしている

### 2. SQL プレビュー

- `POST /datasearch/skymaps_api/catalog_jobs`
- リクエスト body:
  - `preview: true`
  - `catalog_job.sql`
  - `catalog_job.release_version`
  - `authenticity_token`
  - `source_origin`
- レスポンス:
  - `preview.count`
  - `preview.fields`
  - `preview.rows`
  - `error`

### 3. SQL ジョブ投入

- `POST /datasearch/skymaps_api/catalog_jobs`
- リクエスト body:
  - `catalog_job.sql`
  - `catalog_job.release_version`
  - `nomail`
  - `authenticity_token`
  - `source_origin`

### 4. ジョブ一覧

- `GET /datasearch/skymaps_api/catalog_jobs?per=50&page=<page>`
- レスポンスは `jobs` と `num_pages`

### 5. ジョブキャンセル

- `POST /datasearch/skymaps_api/catalog_jobs/:id/cancel`
- リクエスト body に `authenticity_token` と `source_origin`

### 6. ジョブ削除

- `DELETE /datasearch/skymaps_api/catalog_jobs/:id`
- クエリパラメータに `authenticity_token` と `source_origin`

### 7. ジョブ結果ダウンロード

- `GET /datasearch/skymaps_api/catalog_jobs/:id/download`
- `arraybuffer` として取得し、CSV / CSV.gz をカタログとして読み込んでいた

## 認証とセッション確立

旧実装の認証は `database.login()` に集約されている。

1. まず `session/access_token` から `access_token` を取得する。
2. 取得した値を `authenticity_token` として POST / DELETE 系 API に渡す。
3. `source_origin` には常に `location.origin` を渡す。
4. 401 を受けた場合はトークンキャッシュを破棄して再取得する。

補足:

- Safari 向けワークアラウンドとして、トークン取得に失敗した場合は `/datasearch/` を指す iframe を一時的に挿入し、指数バックオフしながら再試行している。
- `jobIndex()` や `downloadJob()` などの GET は `authenticity_token` を明示送信していない。`database.login()` で事前にセッションを確立してから通常の same-origin リクエストを送る設計になっている。
- axios の特別な `baseURL` や `withCredentials` 設定は見当たらず、`/datasearch/...` への same-origin アクセスを前提としている。

## release_version の扱い

- SQL 実行時の `release_version` は UI で選んだ release から渡す。
- `Release.cas_release` が使われ、未指定なら release 名そのもの、必要なら `cas_release` で上書きできる。
- 例として `internal-release` の `dr4` は `cas_release: 'dr4'` を明示していた。

## UI 側の挙動

- SQL エディタには環境ごとの sample query があり、送信前に以下の置換を行う。
  - `$rerun` → 選択中 rerun 名
  - `$coord_in_selection_box` → 選択矩形があれば `boxSearch(coord, ra0, ra1, dec0, dec1)`、なければ `'t'`
- preview モードでは返ってきた `fields` と `rows` を即座にカタログ表示へ変換する。
- queue モードでは非同期ジョブを作成し、ジョブ一覧から状態確認・キャンセル・削除・ダウンロードを行う。
- ジョブ一覧からロードできるのは `csv` または `csv.gz` の完了ジョブ。
- スキーマ参照先として `https://hscdata.mtk.nao.ac.jp/schema_browser3/` を開いていた。

## 移植時の論点

- `app` でも `datasearch` と same-origin で連携できる前提が必要。
- トークン取得と Safari 向け iframe ワークアラウンドが現行構成でも必要かを確認する必要がある。
- 単なる API クライアントだけでなく、少なくとも以下の UI / 状態管理が必要になる。
  - SQL エディタ
  - preview 結果のカタログ化
  - ジョブ一覧
  - release / rerun 選択
  - 選択矩形からの `boxSearch` 展開
