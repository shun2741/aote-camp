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
