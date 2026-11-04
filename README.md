# 30DayMapChallenge

中島慎也の地図作品集。年度ごとのテーマ・作品・企画を、同じJSONから表示します。

## 起動

```sh
npm ci
npm run dev
```

`/2026/`で2026年の作品を表示します。`/`は`years.json`の既定年度へ案内します。

```sh
npm run plan
npm test
npm run build
```

## 一元管理するファイル

| ファイル | 内容 |
| --- | --- |
| `public/data/site.json` | サイト名、作者、紹介、共通リンク |
| `public/data/years.json` | 登録年度、既定年度 |
| `public/data/2026/works.json` | 30テーマ、意味、企画、作品、公開状態、リンク |
| `public/images/2026/works/` | 実作品のサムネイル |
| `docs/2026-plan.md` | JSONから生成するチャレンジ一覧。直接編集しない |

画面の「作品」「企画一覧」と会話用の生成一覧は同じデータを使います。公開済み作品はHTTP応答とREADMEを確認して登録しています。未取得サムネイルはテーマ名の代替表示です。リポジトリがあるだけで公開済みにはしません。

### 作品の追加と公開

該当日の`projects`へ追加します。同じ日に複数作品を登録できます。`id`は年度内で一意にします。`status`は`planned`（準備中）、`building`（制作中）、`published`（公開済み）。公開済みには閲覧URLが必要です。画像パスは`images/2026/works/name.png`のようなbaseパスに依存しない相対パスにします。

更新後は`updatedAt`も変更し、`npm run plan`で一覧を再生成してください。生成し忘れはビルド時に検出します。公開日数・公開作品数は別々に自動集計します。

### 新年度

`public/data/2027/works.json`と画像フォルダを追加し、その年の公式テーマ30件を登録します。`years.json`に2027を追加し、必要なら`defaultYear`も変更します。アプリのコードやHTMLの編集は不要です。前年の作品やURLは保持します。

### このセッションの企画一覧との同期

JSONが正本です。`npm run plan`で生成した`docs/<year>-plan.md`をもとに、ChatGPTの企画Pageの日別欄を更新します。Pageは編集元ではなく閲覧用スナップショットです。このセッションで変更する際はJSON→生成一覧→Pageの順に反映します。Pageを直接変更しただけではGitHubへ自動同期されません。定期処理やAPI経由の無人同期は設定していません。個人予定など公開対象外のメモはPageにのみ残します。

## 配信

Viteの出力は`dist/`。年度ごとの`2026/index.html`を生成するため、直接アクセスと再読み込みが可能です。

```sh
PORTAL_BASE_PATH=/30daymapchallenge/ PORTAL_ORIGIN=https://shinyanakashima.github.io npm run build
```

GitHub Pages用のActionsを同梱しています。PagesのSourceをGitHub Actionsに設定して利用します。ルート配信では`PORTAL_BASE_PATH=/`。canonical/OGの絶対URLは`PORTAL_ORIGIN`が設定されている場合だけ出力します。

## ライセンス

オリジナルのポータルコードはMIT。第三者のデータ・画像・フォントはそれぞれの利用条件に従います。掲載アプリ自体や元データを、このリポジトリのMITに変更するものではありません。詳細は[CREDITS.md](CREDITS.md)。
