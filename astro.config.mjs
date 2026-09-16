// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';

// 본문 안 외부 링크(http로 시작)는 새 창 + noopener. 내부 링크(/posts/…)는 현재 창 그대로.
function externalLinks() {
  return (tree) => {
    const walk = (n) => {
      if (n.type === 'element' && n.tagName === 'a' && /^https?:\/\//.test(String(n.properties?.href ?? ''))) {
        n.properties.target = '_blank';
        n.properties.rel = 'noopener noreferrer';
      }
      (n.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  // 사이트 주소는 여기와 src/config/site.ts 두 곳. 도메인 바뀌면 둘 다.
  site: 'https://moneychk.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    // 기본 GFM을 끄고 직접 넣는다. singleTilde:false → "100~200만원"의 물결표 한 개는 취소선이 아니다.
    gfm: false,
    smartypants: false,
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [externalLinks],
  },
  integrations: [sitemap()],
});
