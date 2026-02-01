# My Study

個人ブログ「My Study」のリポジトリです。技術への挑戦や日々の気づきを記録しています。

## ディレクトリ構造

```
myStudy/
├── index.html          # トップページ
├── diary.html          # 日記一覧
├── idea.html           # アプリ案一覧
├── tech.html           # 技術メモ一覧
├── about.html          # About ページ
├── index.css           # スタイルシート
├── posts/              # 記事ファイル
│   ├── 2026-01-04-diary.html
│   ├── 2026-01-04-app-idea-todo.html
│   └── ...
└── archive/            # 月別アーカイブ
    ├── 2026-01.html
    └── ...
```

## 記事の投稿方法

### 1. 日記を投稿する

1. `posts/` フォルダに新しいHTMLファイルを作成
   - ファイル名: `YYYY-MM-DD-diary.html`（例: `2026-01-05-diary.html`）

2. 以下のテンプレートを使用:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>YYYY年M月D日の日記 - My Study</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../index.css">
</head>
<body>
<div id="outer">
<header>
<h1>My Study</h1>
<p>日記やら備忘録やら</p>
<nav>
<a href="../index.html">ホーム</a>
<a href="../diary.html">日記一覧</a>
<a href="../idea.html">アプリ案</a>
<a href="../about.html">About</a>
</nav>
</header>

<div id="content">
<div class="inner">
<article class="post-content">
<p class="date">YYYY年M月D日（曜日）</p>
<p class="category">📝 日記</p>
<h2>記事タイトル</h2>

<p>本文をここに書く...</p>

<a href="../diary.html" class="back-link">← 日記一覧に戻る</a>
</article>
</div>
</div>

<aside>
<div class="right-title">カテゴリー</div>
<div class="link">
<ul>
<li><a href="../diary.html">📝 日記</a></li>
<li><a href="../idea.html">💡 アプリ案</a></li>
<li><a href="../tech.html">💻 技術メモ</a></li>
</ul>
</div>
</aside>

<footer>© 2026 My Study | <a href="https://github.com/username/username.github.io">GitHub</a></footer>
</div>
</body>
</html>
```

3. `diary.html` に新しい記事へのリンクを追加

4. `index.html` の最新記事を更新（必要に応じて）

### 2. アプリ案を投稿する

1. `posts/` フォルダに新しいHTMLファイルを作成
   - ファイル名: `YYYY-MM-DD-app-idea-xxxxx.html`（例: `2026-01-05-app-idea-timer.html`）

2. 日記と同様のテンプレートを使用し、以下を変更:
   - `<p class="category">💡 アプリ案</p>`
   - `<article class="entry idea">` （一覧ページ用）
   - 戻りリンクを `<a href="../idea.html" class="back-link">← アプリ案一覧に戻る</a>` に変更

3. `idea.html` に新しい記事へのリンクを追加

### 3. 一覧ページへの追加

`diary.html` や `idea.html` に記事を追加する際のテンプレート:

```html
<article class="entry">
<h2><a href="posts/YYYY-MM-DD-diary.html">記事タイトル</a></h2>
<p class="date">YYYY年M月D日（曜日）</p>
<p class="category">📝 日記</p>
<p>記事の概要（100〜150文字程度）...</p>
<a href="posts/YYYY-MM-DD-diary.html" class="read-more">続きを読む →</a>
</article>
```

アプリ案の場合は `class="entry idea"` を使用。

## デプロイ

GitHub Pages でホスティングしています。`main` ブランチにプッシュすると自動的に公開されます。

```bash
git add .
git commit -m "新しい記事を追加"
git push
```

## ローカルでの確認

ブラウザで `index.html` を直接開くか、ローカルサーバーを起動:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve
```

その後 http://localhost:8000 にアクセス。
