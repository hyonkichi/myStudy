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

## スマホから記事を投稿する方法

### 方法1: GitHub Web（推奨）

1. **GitHubにアクセス**
   - ブラウザで https://github.com/hyonkichi/myStudy にアクセス
   - ログインする

2. **新しいファイルを作成**
   - `posts` フォルダをタップ
   - 「Add file」→「Create new file」をタップ

3. **ファイル名を入力**
   ```
   2026-02-04-diary.md
   ```
   （形式: `YYYY-MM-DD-カテゴリ.md`）

4. **記事を書く**
   ```markdown
   ---
   title: 記事のタイトル
   date: 2026年2月4日（火）
   category: 日記
   tags: タグ1, タグ2
   ---

   # 記事のタイトル

   本文をここに書く...
   ```

5. **コミット**
   - 「Commit changes」をタップ
   - コミットメッセージを入力して確定

> **注意**: スマホから投稿した場合、`build.js` が実行されないため、一覧ページには自動反映されません。PCで `node build.js` を実行するか、GitHub Actionsを設定する必要があります。

### 方法2: GitHub Mobile アプリ

1. GitHub Mobile アプリをインストール（iOS / Android）
2. リポジトリを開く
3. 「Code」タブ → `posts` フォルダ → 「+」で新規ファイル作成
4. 上記と同様にMarkdownで記事を書いてコミット

### 方法3: Working Copy（iOS）/ Termux（Android）

Git操作ができるアプリを使えば、PCと同様のワークフローが可能です。

**iOS - Working Copy**
- リポジトリをクローン
- ファイルを作成・編集
- コミット & プッシュ

**Android - Termux**
```bash
pkg install git nodejs
git clone https://github.com/hyonkichi/myStudy.git
cd myStudy
node new.js diary "タイトル"
# 編集後
node build.js
git add . && git commit -m "記事追加" && git push
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
