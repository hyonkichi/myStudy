#!/usr/bin/env node
/**
 * X (Twitter) 自動投稿スクリプト
 * 新規記事の情報をXに投稿する
 */

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// 環境変数から認証情報を取得
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_KEY_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

// Markdownのフロントマターを解析
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const metaStr = match[1];
  const body = match[2];
  const meta = {};

  metaStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // クォートを除去
      value = value.replace(/^["']|["']$/g, '');
      if (key === 'tags' && value) {
        value = value.split(',').map(t => t.trim()).filter(t => t);
      }
      meta[key] = value;
    }
  });

  return { meta, body };
}

// 本文から要約を抽出（最初の段落、最大100文字）
function extractSummary(body, maxLength = 100) {
  // 見出しや空行を除いた最初の段落を取得
  const lines = body.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*');
  });

  const firstParagraph = lines[0] || '';
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  return firstParagraph.slice(0, maxLength) + '...';
}

// ツイートを投稿
async function postTweet(articlePath) {
  try {
    const content = fs.readFileSync(articlePath, 'utf-8');
    const { meta, body } = parseFrontMatter(content);

    const title = meta.title || path.basename(articlePath, '.md');
    const summary = extractSummary(body);
    const tags = Array.isArray(meta.tags) ? meta.tags.slice(0, 3) : [];

    // ファイル名から記事URLを生成
    const fileName = path.basename(articlePath, '.md');
    const articleUrl = `https://hyonkichi.github.io/myStudy/posts/${fileName}.html`;

    // ハッシュタグを生成
    const hashtags = ['#MyStudy', '#ブログ更新'];

    // ツイート本文を組み立て
    let tweet = `【新着記事】\n${title}\n\n`;
    if (summary) {
      tweet += `${summary}\n\n`;
    }
    tweet += `${articleUrl}\n\n`;
    tweet += hashtags.join(' ');

    // 280文字制限をチェック（日本語は2文字換算の場合あり）
    if (tweet.length > 280) {
      // 要約を短くして調整
      const shortSummary = extractSummary(body, 50);
      tweet = `【新着記事】\n${title}\n\n${shortSummary}\n\n${articleUrl}\n\n${hashtags.join(' ')}`;
    }

    console.log('投稿内容:');
    console.log('---');
    console.log(tweet);
    console.log('---');

    // ツイートを投稿
    const result = await client.v2.tweet(tweet);
    console.log(`✅ ツイート投稿成功: https://x.com/i/status/${result.data.id}`);

    return result;
  } catch (error) {
    console.error('❌ ツイート投稿エラー:', error.message);
    if (error.data) {
      console.error('詳細:', JSON.stringify(error.data, null, 2));
    }
    process.exit(1);
  }
}

// 新規追加されたMarkdownファイルを検出
async function detectNewArticles() {
  // 環境変数から新規ファイルリストを取得（GitHub Actionsから渡される）
  const newFiles = process.env.NEW_ARTICLES;

  if (!newFiles) {
    console.log('新規記事が検出されませんでした');
    return [];
  }

  return newFiles.split('\n').filter(f => f.trim() && f.endsWith('.md'));
}

// メイン処理
async function main() {
  console.log('🐦 X自動投稿スクリプト開始\n');

  // コマンドライン引数からファイルパスを取得、または新規ファイルを検出
  const args = process.argv.slice(2);
  let articlePaths = [];

  if (args.length > 0) {
    // 引数で指定されたファイル
    articlePaths = args.filter(f => fs.existsSync(f));
  } else {
    // 環境変数から新規ファイルを検出
    articlePaths = await detectNewArticles();
  }

  if (articlePaths.length === 0) {
    console.log('投稿対象の記事がありません');
    return;
  }

  console.log(`📝 ${articlePaths.length}件の記事を投稿します\n`);

  for (const articlePath of articlePaths) {
    console.log(`処理中: ${articlePath}`);
    await postTweet(articlePath);
    console.log('');
  }

  console.log('🎉 完了');
}

main();
