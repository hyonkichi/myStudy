#!/usr/bin/env node
/**
 * ビルドスクリプト
 * - Markdownファイルを HTMLに変換
 * - 記事一覧を自動生成
 * - 検索用JSONを生成
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const ROOT_DIR = __dirname;

// Markdownのフロントマターを解析
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const metaStr = match[1];
  const body = match[2];
  const meta = {};

  metaStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      // タグをパース
      if (key.trim() === 'tags' && value) {
        value = value.split(',').map(t => t.trim()).filter(t => t);
      }
      meta[key.trim()] = value;
    }
  });

  return { meta, body };
}

// HTMLファイルからメタデータを抽出
function extractMetaFromHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.html');

  const titleMatch = content.match(/<h2>([^<]+)<\/h2>/);
  const title = titleMatch ? titleMatch[1] : fileName;

  const dateMatch = content.match(/<p class="date">([^<]+)<\/p>/);
  const dateStr = dateMatch ? dateMatch[1] : '';

  // タグ抽出
  const tagsMatch = content.match(/data-tags="([^"]+)"/);
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];

  const isIdea = fileName.includes('app-idea');
  const category = isIdea ? 'idea' : 'diary';

  const bodyMatch = content.match(/<h2>[^<]+<\/h2>\s*<p>([^<]+)<\/p>/);
  const excerpt = bodyMatch ? bodyMatch[1].slice(0, 120) + '...' : '';

  const datePartMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const sortDate = datePartMatch ? datePartMatch[0] : '0000-00-00';

  // 本文抽出（検索用）
  const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500);

  return {
    fileName,
    filePath: `posts/${fileName}.html`,
    title,
    dateStr,
    sortDate,
    category,
    excerpt,
    tags,
    textContent
  };
}

// MarkdownをHTMLに変換
function convertMarkdownToHTML(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const { meta, body } = parseFrontMatter(content);
  const fileName = path.basename(mdPath, '.md');

  const title = meta.title || fileName;
  const dateStr = meta.date || '';
  const category = meta.category || '日記';
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const tagsAttr = tags.length > 0 ? ` data-tags="${tags.join(',')}"` : '';

  const categoryEmoji = category === 'アプリ案' ? '💡' : '📝';
  const backLink = category === 'アプリ案'
    ? '<a href="../idea.html" class="back-link">← アプリ案一覧に戻る</a>'
    : '<a href="../diary.html" class="back-link">← 日記一覧に戻る</a>';

  // タグHTML
  const tagsHTML = tags.length > 0
    ? `<div class="post-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
    : '';

  // Markdown→HTML変換
  const htmlBody = marked(body);

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${title} - My Study</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../index.css">
</head>
<body${tagsAttr}>
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
<p class="date">${dateStr}</p>
<p class="category">${categoryEmoji} ${category}</p>
${tagsHTML}
<h2>${title}</h2>
${htmlBody}
${backLink}
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
<script src="../main.js"></script>
</body>
</html>`;

  // HTMLファイルを出力
  const htmlPath = path.join(POSTS_DIR, `${fileName}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`✓ ${fileName}.md → ${fileName}.html`);

  return htmlPath;
}

// 記事一覧のHTMLを生成
function generateEntryHTML(post) {
  const categoryLabel = post.category === 'idea' ? '💡 アプリ案' : '📝 日記';
  const entryClass = post.category === 'idea' ? 'entry idea' : 'entry';
  const tagsHTML = post.tags && post.tags.length > 0
    ? `<div class="entry-tags">${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
    : '';

  return `<article class="${entryClass}" data-tags="${(post.tags || []).join(',')}">
<h2><a href="${post.filePath}">${post.title}</a></h2>
<p class="date">${post.dateStr}</p>
<p class="category">${categoryLabel}</p>
${tagsHTML}
<p>${post.excerpt}</p>
<a href="${post.filePath}" class="read-more">続きを読む →</a>
</article>`;
}

// 一覧ページを更新
function updateListPage(filePath, posts, category) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const filtered = posts.filter(p => category === 'all' || p.category === category);
  const entriesHTML = filtered.map(generateEntryHTML).join('\n\n');
  const regex = /<!-- POSTS_START -->[\s\S]*?<!-- POSTS_END -->/;
  const replacement = `<!-- POSTS_START -->\n${entriesHTML}\n<!-- POSTS_END -->`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${path.basename(filePath)} を更新`);
  }
}

// 検索用JSONを生成
function generateSearchIndex(posts) {
  const searchData = posts.map(p => ({
    title: p.title,
    url: p.filePath,
    date: p.dateStr,
    category: p.category,
    tags: p.tags || [],
    excerpt: p.excerpt,
    content: p.textContent
  }));

  fs.writeFileSync(
    path.join(ROOT_DIR, 'search-index.json'),
    JSON.stringify(searchData, null, 2),
    'utf-8'
  );
  console.log(`✓ search-index.json を生成`);
}

// 全タグを収集
function collectAllTags(posts) {
  const tagSet = new Set();
  posts.forEach(p => {
    (p.tags || []).forEach(t => tagSet.add(t));
  });
  return Array.from(tagSet).sort();
}

// メイン処理
function main() {
  console.log('\n🔨 ビルド開始\n');

  // 1. Markdownファイルを変換
  const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  if (mdFiles.length > 0) {
    console.log('📝 Markdown変換:');
    mdFiles.forEach(f => convertMarkdownToHTML(path.join(POSTS_DIR, f)));
    console.log('');
  }

  // 2. 全HTMLファイルからメタデータ取得
  const htmlFiles = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.html') && !f.startsWith('readme'));

  const posts = htmlFiles
    .map(f => extractMetaFromHTML(path.join(POSTS_DIR, f)))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));

  console.log(`📄 ${posts.length} 件の記事を検出\n`);

  // 3. 一覧ページを更新
  console.log('📋 一覧ページ更新:');
  updateListPage(path.join(ROOT_DIR, 'index.html'), posts.slice(0, 5), 'all');
  updateListPage(path.join(ROOT_DIR, 'diary.html'), posts, 'diary');
  updateListPage(path.join(ROOT_DIR, 'idea.html'), posts, 'idea');

  // 4. 検索インデックス生成
  console.log('\n🔍 検索インデックス:');
  generateSearchIndex(posts);

  // 5. タグ一覧を表示
  const allTags = collectAllTags(posts);
  if (allTags.length > 0) {
    console.log(`\n🏷️  タグ: ${allTags.join(', ')}`);
  }

  console.log('\n✅ ビルド完了\n');
}

main();
