# AOTE Camp

スマホファーストの静的旅行アプリです。毎年の旅行について、概要、スケジュール、ホテル、経費精算、麻雀精算をひとつのページ群にまとめて確認できます。

## Stack

- Vite
- React
- TypeScript
- React Router (`BrowserRouter`)
- Vercel
- Vercel Functions

## Local Development

```bash
npm install
npm run dev
```

共有 API まで含めてローカル確認するなら `vercel dev` を使ってください。

## Build

```bash
npm run build
```

## Deploy

- Vercel に GitHub リポジトリ連携でデプロイしてください。
- SPA の直接アクセス用に [vercel.json](/Users/shun/Desktop/codex-app/aote-camp/vercel.json) で rewrite を入れています。

## Shared Sync

経費と麻雀は `public/shared/2026-gw-tsukuba/*.json` を正本にして共有できます。

- 閲覧
  - Vercel Function が GitHub 上の JSON を読みます。
- 反映
  - owner だけが Vercel Function 経由で GitHub リポジトリの JSON を更新します。
  - 更新後、ほかの人は `最新を取得` を押せばすぐ同じ内容を読めます。

### Files

- 経費: `public/shared/2026-gw-tsukuba/expenses.json`
- 麻雀: `public/shared/2026-gw-tsukuba/mahjong.json`
- API: `api/shared.ts`

### Vercel Setup

1. Vercel にこの GitHub リポジトリを import
2. Project Settings > Environment Variables で以下を追加
   - `GITHUB_TOKEN`
   - `WRITE_SECRET`
   - `GITHUB_OWNER=shun2741`
   - `GITHUB_REPO=aote-camp`
   - `GITHUB_BRANCH=main`
3. GitHub で fine-grained token を作成
   - 対象 repo: `shun2741/aote-camp`
   - 権限: `Contents: Read and write`
4. 作成した token を Vercel の `GITHUB_TOKEN` に入れる
5. `WRITE_SECRET` には自分だけが知る長いランダム文字列を入れる
6. 環境変数を追加したら Vercel で再デプロイ

### Notes

- `WRITE_SECRET` は長いランダム文字列にしてください。これを知っている人だけが `GitHubへ反映` できます。
- GitHub の file contents API でファイルを書き換えています。
- GitHub が正本なので、履歴は commit として残ります。

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
