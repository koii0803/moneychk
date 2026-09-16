export const SITE = {
  name: '머니첵',
  latin: 'moneychk',
  tagline: '돈 문제, 숫자로만 확인한다',
  description:
    '지원금·환급·대출·주거·절약 — 생활 속 돈 문제를 공식 자료의 숫자로만 검증하는 생활경제 팩트체크.',
  url: 'https://moneychk.com', // 도메인 바뀌면 astro.config.mjs와 함께 교체
  lang: 'ko',
  ogImage: '/og-default.png',
  email: 'support@moneychk.com', // Cloudflare 이메일 라우팅으로 받는다 (여기 한 곳만)
};

export type CategoryKey =
  | 'benefit'
  | 'refund'
  | 'loan'
  | 'home'
  | 'save'
  | 'work'
  | 'future';

export const CATEGORIES: Record<
  CategoryKey,
  { name: string; desc: string; color: string; no: string }
> = {
  benefit: { no: '01', name: '받는 돈', desc: '수당 · 지원금 · 바우처', color: '#177a53' },
  refund: { no: '02', name: '돌려받는 돈', desc: '연말정산 · 환급 · 청구', color: '#b07a1e' },
  loan: { no: '03', name: '빌리는 돈', desc: '정책대출 · 금리 · 신용', color: '#35509e' },
  home: { no: '04', name: '사는 집 돈', desc: '전월세 · 청약 · 보증금', color: '#b5533c' },
  save: { no: '05', name: '아끼는 돈', desc: '공과금 · 통신 · 감면', color: '#0e7490' },
  work: { no: '06', name: '버는 돈', desc: '구직 · 창업 · 부업 신고', color: '#5b5f97' },
  future: { no: '07', name: '모으는 돈', desc: '정책 적금 · 연금 · 자산형성', color: '#7c4a6e' },
};

export const catName = (slug: string) => CATEGORIES[slug as CategoryKey]?.name ?? slug;
export const catColor = (slug: string) => CATEGORIES[slug as CategoryKey]?.color ?? '#177a53';
export const fmtDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
