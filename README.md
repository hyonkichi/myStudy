# My Study

個人ブログ「My Study」のリポジトリです。

## 記事の投稿方法

### 1. 記事を作成

```bash
# 日記を作成
node new.js diary "今日の学び"

# アプリ案を作成
node new.js idea "便利ツール"

# タグ付きで作成
node new.js diary "React勉強" --tags "React,JavaScript"
```

`posts/` フォルダにMarkdownファイルが生成されます。

### 2. 記事を編集

生成された `.md` ファイルをエディタで編集します。

```markdown
---
title: 今日の学び
date: 2026年2月1日（土）
category: 日記
tags: React, JavaScript
---

# 今日の学び

本文をここに書く...
```

### 3. ビルド & デプロイ

```bash
node build.js    # Markdown→HTML変換 & 一覧更新
git add .
git commit -m "新しい記事を追加"
git push
```

## 機能

- **Markdown対応**: `.md` ファイルで記事を書ける
- **検索機能**: 記事のタイトル・本文・タグを検索
- **タグ機能**: 記事にタグを付けて分類
- **ダークモード**: OS設定に連動 / 手動切替可
- **目次自動生成**: 見出しから目次を自動生成

## ローカル確認

```bash
python -m http.server 8000
```

http://localhost:8000 でプレビューできます。

## ディレクトリ構成

```
myStudy/
├── index.html       # トップページ
├── diary.html       # 日記一覧
├── idea.html        # アプリ案一覧
├── index.css        # スタイル
├── main.js          # JavaScript機能
├── build.js         # ビルドスクリプト
├── new.js           # 記事作成スクリプト
├── search-index.json # 検索用データ（自動生成）
└── posts/           # 記事ファイル
    ├── *.md         # Markdownソース
    └── *.html       # 変換後HTML
```
