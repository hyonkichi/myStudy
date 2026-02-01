# My Study

個人ブログ「My Study」のリポジトリです。

## 記事の投稿方法

### 1. 記事ファイルを作成

`posts/` フォルダにHTMLファイルを追加します。

**ファイル名の規則:**
- 日記: `YYYY-MM-DD-diary.html`
- アプリ案: `YYYY-MM-DD-app-idea-xxxxx.html`

### 2. ビルドを実行

```bash
node build.js
```

一覧ページ（index.html、diary.html、idea.html）が自動更新されます。

### 3. デプロイ

```bash
git add .
git commit -m "新しい記事を追加"
git push
```

## 記事テンプレート

`posts/` 内の既存ファイルをコピーして編集してください。

## ローカル確認

```bash
python -m http.server 8000
```

http://localhost:8000 でプレビューできます。
