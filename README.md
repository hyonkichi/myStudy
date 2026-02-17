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
   YYYY-MM-DD-diary.md
   ```
   例: `2026-02-17-diary.md`（アプリ案の場合は `2026-02-17-app-idea-名前.md`）

4. **記事を書く**
   ```markdown
   ---
   title: 記事のタイトル
   date: 2026年2月17日（月）
   category: 日記
   tags: タグ1, タグ2
   ---

   # 記事のタイトル

   本文をここに書く...
   ```

   **注意点:**
   - フロントマター（`---` で囲まれた部分）は必須です
   - `title`, `date`, `category` は必ず記入してください
   - `tags` は空でもOKですが、行自体は残してください
   - `category` は `日記` または `アプリ案` のいずれかを指定

5. **コミット（`main` ブランチに直接コミットする）**
   - 「Commit changes」をタップ
   - **「Commit directly to the `main` branch」が選択されていることを確認**
   - コミットメッセージを入力して確定

6. **GitHub Actions の実行を確認**
   - リポジトリの「Actions」タブを開く
   - 「Build and Deploy」ワークフローが実行中または完了になっていることを確認
   - 緑のチェックマークが付けば成功

7. **ページに反映されたか確認**
   - 数分待ってからブログページにアクセスして、記事が一覧に表示されていることを確認

### 投稿後にページに反映されない場合のチェックリスト

以下を順番に確認してください：

1. **コミット先ブランチの確認**: `main` ブランチに直接コミットしましたか？別ブランチに入っているとCIが動きません
2. **ファイルの配置場所**: `posts/` フォルダ直下に `.md` ファイルがありますか？
3. **ファイル名の形式**: `YYYY-MM-DD-diary.md` の形式になっていますか？
4. **GitHub Actions の状態**: 「Actions」タブでワークフローが実行されていますか？失敗（赤いバツ）の場合はログを確認してください
5. **手動ビルド（最終手段）**: PCからローカルでビルドし直すことで復旧できます
   ```bash
   cd myStudy
   git pull
   node build.js
   git add .
   git commit -m "手動ビルド: HTML再生成"
   git push
   ```

### 方法2: GitHub Mobile アプリ

1. GitHub Mobile アプリをインストール（iOS / Android）
2. リポジトリを開く
3. 「Code」タブ → `posts` フォルダ → 「+」で新規ファイル作成
4. 上記と同様にMarkdownで記事を書く
5. **コミット時に `main` ブランチを選択して確定**
6. 「Actions」タブでビルド成功を確認

> GitHub Mobile アプリではブランチの選択UIが分かりにくい場合があります。コミット後に「Actions」タブでビルドが動いているか必ず確認してください。

### 方法3: Working Copy（iOS）/ Termux（Android）

Git操作ができるアプリを使えば、PCと同様のワークフローが可能です。

**iOS - Working Copy**
1. リポジトリをクローン
2. `posts/` フォルダにファイルを作成・編集
3. コミット & プッシュ（`main` ブランチへ）
4. GitHub Actions の実行完了を確認

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
