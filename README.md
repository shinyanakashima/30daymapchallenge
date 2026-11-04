# 30DayMapChallenge

[#30DayMapChallenge](https://30daymapchallenge.com/) の作品ポータルです。テーマと作品は `public/data/<year>/works.json` で管理しています。

## 開発

```sh
npm ci
npm run dev
```

`/2026/` が2026年のページです。`/` は `years.json` の `defaultYear` へ移動します。

データを変更したら次を実行します。

```sh
npm run plan   # docs/<year>-plan.md を再生成
npm test
npm run build
```

## データ

| ファイル | 内容 |
| --- | --- |
| `public/data/site.json` | サイト名、作者、リンクなど共通の表示内容 |
| `public/data/years.json` | 掲載する年と既定の年 |
| `public/data/2026/works.json` | 30日分のテーマ、企画メモ、作品 |
| `public/images/2026/works/` | 作品のサムネイル |
| `docs/2026-plan.md` | works.json から生成した一覧（手で編集しない） |

英語の表示文は各JSONの `en` フィールド、画面共通のラベルは `src/ui.json` にあります。表示言語は英語が既定で、ヘッダーの EN / 日本語 か `?lang=en|ja` で切り替えます。

### 作品を追加する

該当日の `projects` に追加します。1日に複数登録できます。

- `id` は年内で重複させない
- `status` は `planned`（準備中）、`building`（制作中）、`published`（公開済み）。`published` には `appUrl` が必要
- 画像は `images/2026/works/name.jpg` のように先頭に `/` を付けずに書く

追加したら `updatedAt` を更新し、`npm run plan` を実行します。一覧の再生成を忘れると `npm run build` が失敗します。

### 年を追加する

`public/data/2027/works.json` と画像フォルダを作り、`years.json` に2027を追加します。必要なら `defaultYear` も変えます。コードの変更は不要です。

## デプロイ

GitHub Actions（`.github/workflows/pages.yml`）で GitHub Pages に公開しています。リポジトリ設定の Pages の Source を GitHub Actions にしておきます。

手元で同じ構成をビルドする場合：

```sh
PORTAL_BASE_PATH=/30daymapchallenge/ PORTAL_ORIGIN=https://shinyanakashima.github.io npm run build
```

`PORTAL_ORIGIN` を指定したときだけ canonical と OGP に絶対URLが入ります。年ごとに `2026/index.html` を出力するので、直接アクセスや再読み込みでも表示できます。

## ライセンス

このサイトのコードは MIT ライセンスです。作品のスクリーンショット、元データ、フォントにはそれぞれの利用条件があり、MIT の対象ではありません。詳しくは [CREDITS.md](CREDITS.md) を見てください。
