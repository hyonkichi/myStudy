#!/usr/bin/env node
/**
 * 記事一覧を自動生成するビルドスクリプト
 * 使い方: node build.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');

// 記事ファイルからメタデータを抽出
function extractMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.html');

  // タイトル抽出
  const titleMatch = content.match(/<h2>([^<]+)<\/h2>/);
  const title = titleMatch ? titleMatch[1] : fileName;

  // 日付抽出
  const dateMatch = content.match(/<p class="date">([^<]+)<\/p>/);
  const dateStr = dateMatch ? dateMatch[1] : '';

  // カテゴリ判定
  const isIdea = fileName.includes('app-idea');
  const category = isIdea ? 'idea' : 'diary';

  // 本文抽出（最初の段落）
  const bodyMatch = content.match(/<h2>[^<]+<\/h2>\s*<p>([^<]+)<\/p>/);
  const excerpt = bodyMatch ? bodyMatch[1].slice(0, 120) + '...' : '';

  // ファイル名から日付をパース (YYYY-MM-DD形式)
  const datePartMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const sortDate = datePartMatch ? datePartMatch[0] : '0000-00-00';

  return {
    fileName,
    filePath: `posts/${fileName}.html`,
    title,
    dateStr,
    sortDate,
    category,
    excerpt
  };
}

// 記事一覧のHTMLを生成
function generateEntryHTML(post) {
  const categoryLabel = post.category === 'idea' ? '💡 アプリ案' : '📝 日記';
  const entryClass = post.category === 'idea' ? 'entry idea' : 'entry';

  return `<article class="${entryClass}">
<h2><a href="${post.filePath}">${post.title}</a></h2>
<p class="date">${post.dateStr}</p>
<p class="category">${categoryLabel}</p>
<p>${post.excerpt}</p>
<a href="${post.filePath}" class="read-more">続きを読む →</a>
</article>`;
}

// 一覧ページを更新
function updateListPage(filePath, posts, category) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // フィルタリング
  const filtered = posts.filter(p => category === 'all' || p.category === category);

  // 記事HTMLを生成
  const entriesHTML = filtered.map(generateEntryHTML).join('\n\n');

  // <!-- POSTS_START --> と <!-- POSTS_END --> の間を置換
  const regex = /<!-- POSTS_START -->[\s\S]*?<!-- POSTS_END -->/;
  const replacement = `<!-- POSTS_START -->\n${entriesHTML}\n<!-- POSTS_END -->`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${path.basename(filePath)} を更新しました`);
  } else {
    console.log(`⚠ ${path.basename(filePath)} にマーカーがありません`);
  }
}

// メイン処理
function main() {
  // postsフォルダの記事を取得
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.html') && !f.startsWith('readme'));

  // メタデータ抽出
  const posts = files
    .map(f => extractMeta(path.join(POSTS_DIR, f)))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate)); // 新しい順

  console.log(`\n📄 ${posts.length} 件の記事を検出\n`);

  // 各ページを更新
  updateListPage(path.join(__dirname, 'index.html'), posts.slice(0, 5), 'all');
  updateListPage(path.join(__dirname, 'diary.html'), posts, 'diary');
  updateListPage(path.join(__dirname, 'idea.html'), posts, 'idea');

  console.log('\n✅ ビルド完了\n');
}

main();
