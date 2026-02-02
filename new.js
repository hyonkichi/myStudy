#!/usr/bin/env node
/**
 * 記事テンプレート生成スクリプト
 *
 * 使い方:
 *   node new.js diary "記事タイトル"
 *   node new.js idea "アプリ名"
 *   node new.js diary "記事タイトル" --tags "タグ1,タグ2"
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');

// 日付フォーマット
function getDateInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[now.getDay()];

  return {
    dateStr: `${year}-${month}-${day}`,
    displayDate: `${year}年${parseInt(month)}月${parseInt(day)}日（${weekday}）`
  };
}

// ファイル名を生成（slugify）
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
}

// Markdownテンプレート生成
function createTemplate(type, title, tags = []) {
  const { dateStr, displayDate } = getDateInfo();
  const category = type === 'idea' ? 'アプリ案' : '日記';
  const tagsLine = tags.length > 0 ? `tags: ${tags.join(', ')}` : 'tags: ';

  return `---
title: ${title}
date: ${displayDate}
category: ${category}
${tagsLine}
---

# ${title}

ここに本文を書いてください。

## 見出し2

本文...

### 見出し3

本文...
`;
}

// メイン処理
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
📝 記事テンプレート生成

使い方:
  node new.js <type> <title> [--tags "tag1,tag2"]

type:
  diary  - 日記
  idea   - アプリ案

例:
  node new.js diary "今日の学び"
  node new.js idea "便利なツール" --tags "React,Web"
`);
    process.exit(1);
  }

  const type = args[0];
  const title = args[1];

  // タグの解析
  let tags = [];
  const tagsIndex = args.indexOf('--tags');
  if (tagsIndex !== -1 && args[tagsIndex + 1]) {
    tags = args[tagsIndex + 1].split(',').map(t => t.trim());
  }

  if (!['diary', 'idea'].includes(type)) {
    console.error('❌ type は diary または idea を指定してください');
    process.exit(1);
  }

  const { dateStr } = getDateInfo();
  const slug = type === 'idea' ? `app-idea-${slugify(title)}` : 'diary';
  const fileName = `${dateStr}-${slug}.md`;
  const filePath = path.join(POSTS_DIR, fileName);

  // 同名ファイルが存在する場合
  if (fs.existsSync(filePath)) {
    console.error(`❌ ファイルが既に存在します: ${fileName}`);
    process.exit(1);
  }

  // テンプレート生成
  const content = createTemplate(type, title, tags);
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log(`
✅ 記事テンプレートを作成しました

📄 ファイル: posts/${fileName}

次のステップ:
  1. posts/${fileName} を編集
  2. node build.js を実行
  3. git add . && git commit && git push
`);
}

main();
