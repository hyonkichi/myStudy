# My Study - ソフトウェアアーキテクチャ

## 概要

My Studyは、GitHub Pagesでホスティングされる静的ブログサイトです。Markdownで記事を書き、Node.jsのビルドスクリプトでHTMLに変換する仕組みを採用しています。

## システム構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Pages                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    静的ファイル配信                        │    │
│  │  index.html / diary.html / idea.html / posts/*.html     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ デプロイ
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Actions                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  posts/*.md 変更検知 → build.js 実行 → 自動コミット      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ push
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     ローカル開発 / スマホ                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   PC編集      │    │ GitHub Web   │    │ GitHub Mobile│      │
│  │  + build.js  │    │   直接編集    │    │    アプリ    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
myStudy/
├── .github/
│   └── workflows/
│       └── build.yml        # GitHub Actions ワークフロー
├── archive/                  # 月別アーカイブページ
│   ├── 2025-11.html
│   ├── 2025-12.html
│   └── 2026-01.html
├── posts/                    # 記事ファイル
│   ├── *.md                  # Markdownソース（編集対象）
│   └── *.html                # 変換後HTML（自動生成）
├── node_modules/             # npm依存関係
├── index.html                # トップページ
├── diary.html                # 日記一覧ページ
├── idea.html                 # アプリ案一覧ページ
├── about.html                # Aboutページ
├── index.css                 # スタイルシート
├── main.js                   # フロントエンドJavaScript
├── build.js                  # ビルドスクリプト
├── new.js                    # 記事テンプレート生成スクリプト
├── search-index.json         # 検索用インデックス（自動生成）
├── package.json              # npm設定
├── .nojekyll                 # Jekyll無効化フラグ
├── .gitignore                # Git除外設定
├── README.md                 # プロジェクト説明
└── ARCHITECTURE.md           # 本ドキュメント
```

## コンポーネント詳細

### 1. ビルドスクリプト (`build.js`)

Markdownから静的サイトを生成するコアコンポーネント。

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  posts/*.md │ ──▶ │  build.js   │ ──▶ │ posts/*.html│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ - index.html 更新       │
              │ - diary.html 更新       │
              │ - idea.html 更新        │
              │ - search-index.json生成 │
              └────────────────────────┘
```

**主な機能:**
- Markdownのフロントマター解析
- Markdown → HTML変換（marked.js使用）
- 記事一覧の自動更新
- 検索インデックスの生成
- タグの収集・表示

**処理フロー:**
1. `posts/*.md` ファイルを読み込み
2. フロントマター（メタデータ）を解析
3. Markdown本文をHTMLに変換
4. テンプレートに埋め込んでHTMLファイル出力
5. 一覧ページ（index/diary/idea）を更新
6. 検索用JSONを生成

### 2. 記事テンプレート生成 (`new.js`)

新規記事のMarkdownテンプレートを生成するCLIツール。

```bash
# 使用方法
node new.js <category> <title> [--tags "tag1,tag2"]

# 例
node new.js diary "今日の学び" --tags "React,JavaScript"
```

**出力ファイル名規則:**
```
YYYY-MM-DD-<category>[-<slug>].md
例: 2026-02-04-diary.md
例: 2026-02-04-app-idea-todo.md
```

### 3. フロントエンド (`main.js`)

クライアントサイドの機能を提供。

| 機能 | 説明 |
|------|------|
| `initDarkMode()` | ダークモード切替（OS設定連動 + 手動切替） |
| `initSearch()` | 全文検索（search-index.json使用） |
| `initTagFilter()` | タグによる記事フィルタリング |
| `initTableOfContents()` | 見出しからの目次自動生成 |

### 4. スタイル (`index.css`)

CSS変数を使用したテーマシステム。

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a202c;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #1a202c;
  --text-primary: #f7fafc;
  /* ... */
}
```

**主なスタイル要素:**
- レスポンシブデザイン（モバイル対応）
- カード型レイアウト
- グラデーション背景
- ダークモード対応

### 5. GitHub Actions (`.github/workflows/build.yml`)

自動ビルド・デプロイのCI/CDパイプライン。

```yaml
トリガー: posts/*.md への push
    ↓
ジョブ: build
    ├── actions/checkout@v4
    ├── actions/setup-node@v4 (Node.js 20)
    ├── npm install
    ├── node build.js
    └── git commit & push（変更がある場合）
```

## データフロー

### 記事投稿フロー

```
[ユーザー]
    │
    ├── PC から投稿
    │   └── node new.js → 編集 → node build.js → git push
    │
    └── スマホから投稿
        └── GitHub Web/Mobile で .md 作成 → push
                                              │
                                              ▼
                                    [GitHub Actions]
                                              │
                                              ▼
                                    build.js 自動実行
                                              │
                                              ▼
                                    HTML・インデックス生成
                                              │
                                              ▼
                                    自動コミット・プッシュ
                                              │
                                              ▼
                                    [GitHub Pages 更新]
```

### 検索機能フロー

```
[ユーザー入力]
      │
      ▼
[main.js: initSearch()]
      │
      ▼
[search-index.json 読み込み]
      │
      ▼
[タイトル・本文・タグを検索]
      │
      ▼
[検索結果表示]
```

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| ホスティング | GitHub Pages |
| フロントエンド | HTML5, CSS3, Vanilla JavaScript |
| ビルドツール | Node.js |
| Markdown変換 | marked.js |
| CI/CD | GitHub Actions |
| バージョン管理 | Git |

## ファイル命名規則

### 記事ファイル
```
YYYY-MM-DD-<category>[-<slug>].md

カテゴリ:
- diary: 日記
- app-idea-<name>: アプリ案

例:
- 2026-01-04-diary.md
- 2026-01-04-app-idea-todo.md
```

### フロントマター形式
```yaml
---
title: 記事タイトル
date: YYYY年M月D日（曜日）
category: 日記 | アプリ案
tags: タグ1, タグ2, タグ3
status: 構想段階 | 企画中 | 実装済み  # アプリ案のみ
---
```

## 拡張ポイント

### 新機能追加時の変更箇所

| 機能 | 変更ファイル |
|------|-------------|
| 新カテゴリ追加 | build.js, new.js, 一覧HTML |
| スタイル変更 | index.css |
| フロント機能追加 | main.js |
| ビルド処理変更 | build.js |
| 自動化変更 | .github/workflows/build.yml |

## 制限事項

- **サーバーサイド処理なし**: 静的サイトのため、コメント機能等は外部サービス連携が必要
- **ビルド必須**: Markdownの変更を反映するにはbuild.jsの実行が必要（GitHub Actionsで自動化済み）
- **検索はクライアント側**: 大量の記事ではパフォーマンスに影響する可能性あり
