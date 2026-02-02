/**
 * My Study - メインJavaScript
 * - ダークモード切替
 * - 検索機能
 * - タグ絞り込み
 * - 目次自動生成
 */

(function() {
  'use strict';

  // ========================================
  // ダークモード
  // ========================================
  function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // 保存された設定を読み込み
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true' || (saved === null && prefersDark.matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // トグルボタンがあれば
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('darkMode', !isDark);
      });
    }

    // システム設定の変更を監視
    prefersDark.addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  // ========================================
  // 検索機能
  // ========================================
  async function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    let posts = [];

    // 検索インデックスを読み込み
    try {
      const res = await fetch('/search-index.json');
      posts = await res.json();
    } catch (e) {
      console.log('検索インデックスを読み込めませんでした');
      return;
    }

    // 検索実行
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }

      const results = posts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        (p.tags || []).some(t => t.toLowerCase().includes(query))
      ).slice(0, 10);

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-result">見つかりませんでした</div>';
      } else {
        searchResults.innerHTML = results.map(p => `
          <a href="${p.url}" class="search-result-item">
            <div class="search-result-title">${p.title}</div>
            <div class="search-result-meta">${p.date} | ${p.category === 'idea' ? 'アプリ案' : '日記'}</div>
          </a>
        `).join('');
      }
      searchResults.style.display = 'block';
    });

    // 検索欄外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchResults.style.display = 'none';
      }
    });
  }

  // ========================================
  // タグ絞り込み
  // ========================================
  function initTagFilter() {
    const tagButtons = document.querySelectorAll('.tag-filter');
    const entries = document.querySelectorAll('.entry[data-tags]');

    if (tagButtons.length === 0) return;

    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;

        // ボタンのアクティブ状態を切替
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 記事の表示/非表示
        entries.forEach(entry => {
          const entryTags = (entry.dataset.tags || '').split(',').map(t => t.trim());
          if (tag === 'all' || entryTags.includes(tag)) {
            entry.style.display = '';
          } else {
            entry.style.display = 'none';
          }
        });
      });
    });
  }

  // ========================================
  // 目次自動生成
  // ========================================
  function initTableOfContents() {
    const article = document.querySelector('.post-content');
    const tocContainer = document.getElementById('toc');

    if (!article || !tocContainer) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) {
      tocContainer.style.display = 'none';
      return;
    }

    const toc = document.createElement('ul');
    toc.className = 'toc-list';

    headings.forEach((heading, index) => {
      // IDを付与
      const id = `heading-${index}`;
      heading.id = id;

      const li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });

      li.appendChild(a);
      toc.appendChild(li);
    });

    tocContainer.appendChild(toc);
  }

  // ========================================
  // 初期化
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSearch();
    initTagFilter();
    initTableOfContents();
  });
})();
