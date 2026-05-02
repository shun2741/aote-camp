# AOTE Camp

スマホファーストの静的旅行アプリです。毎年の旅行について、概要、スケジュール、ホテル、経費精算、麻雀精算をひとつのページ群にまとめて確認できます。

## Stack

- Vite
- React
- TypeScript
- React Router (`HashRouter`)
- GitHub Pages

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

- GitHub Pages 向けに `.github/workflows/deploy.yml` を追加しています。
- GitHub の `Settings > Pages` で `Build and deployment` を `GitHub Actions` に設定してください。
- `vite.config.ts` の `base` はリポジトリ名 `aote-camp` 前提です。リポジトリ名を変える場合は `/aote-camp/` を更新してください。
- 共有反映用の Worker URL を使う場合は、GitHub リポジトリの `Settings > Secrets and variables > Actions > Variables` に `VITE_SYNC_WRITE_URL` を追加してください。

## Shared Sync

経費と麻雀は `public/shared/2026-gw-tsukuba/*.json` を正本にして共有できます。

- 閲覧
  - GitHub Pages 上の静的 JSON を全員が読み込みます。
- 反映
  - owner だけが Cloudflare Worker 経由で GitHub リポジトリの JSON を更新します。
  - commit 後に GitHub Pages が再デプロイされ、少し待つと全員へ反映されます。

### Files

- 経費: `public/shared/2026-gw-tsukuba/expenses.json`
- 麻雀: `public/shared/2026-gw-tsukuba/mahjong.json`

### Cloudflare Worker Setup

1. Cloudflare の `Workers & Pages` で新しい Worker を作成
2. `worker/github-sync-worker.mjs` の内容を貼り付けて deploy
3. `Settings > Variables and Secrets` で以下を追加
   - Secret: `GITHUB_TOKEN`
   - Secret: `WRITE_SECRET`
   - Text: `GITHUB_OWNER=shun2741`
   - Text: `GITHUB_REPO=aote-camp`
   - Text: `GITHUB_BRANCH=main`
   - Text: `ALLOWED_ORIGINS=https://shun2741.github.io,http://localhost:5173`
4. GitHub で fine-grained token を作成
   - 対象 repo: `shun2741/aote-camp`
   - 権限: `Contents: Read and write`
5. Worker の URL を控える
6. GitHub リポジトリの `Settings > Secrets and variables > Actions > Variables` に `VITE_SYNC_WRITE_URL` として Worker URL を入れる
7. `main` に push すると、その URL を使ったビルドに変わります

### Notes

- `WRITE_SECRET` は長いランダム文字列にしてください。これを知っている人だけが `GitHubへ反映` できます。
- GitHub の file contents API でファイルを書き換えています。
- GitHub Pages は静的サイトなので、反映後にデプロイ完了まで少し待ちます。

## Data Structure

旅行データは `src/data/trips/*.ts` に分割しています。

- 新しい旅行を追加する
  - `src/data/trips/` に新しいファイルを追加
  - `src/data/trips.ts` に export を追加
- 主要型
  - `src/types/trip.ts`
- 計算ロジック
  - 割り勘: `src/lib/expenses.ts`
  - 麻雀: `src/lib/mahjong.ts`
