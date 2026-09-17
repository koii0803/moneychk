export const SITE = {
  name: '머니첵',
  latin: 'moneychk',
  tagline: '정부 지원금, 내 조건의 정확한 숫자로 확인합니다',
  description:
    '정부 지원금·환급금·정책 대출·주거·생활비 감면 — 행정 고시를 자격 체크표와 숫자로 압축한 생활경제 팩트체크.',
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
  { name: string; short: string; desc: string; color: string; badge: string; no: string; icon: string; img: string }
> = {
  benefit: { no: '01', name: '정부 지원금', short: '받는 돈', badge: '#35c48a', desc: '기초생활 · 청년수당 · 바우처', color: '#177a53', icon: '💰', img: '/img/icons/benefit.webp' },
  refund: { no: '02', name: '숨은 환급금', short: '돌려받는 돈', badge: '#f5b544', desc: '연말정산 · 건보료 환급 · 세금 감면', color: '#b07a1e', icon: '💸', img: '/img/icons/refund.webp' },
  loan: { no: '03', name: '정책 대출', short: '빌리는 돈', badge: '#5b8def', desc: '디딤돌 · 버팀목 · 햇살론', color: '#35509e', icon: '🏦', img: '/img/icons/loan.webp' },
  home: { no: '04', name: '주거 · 청약', short: '사는 집 돈', badge: '#ff7a5c', desc: '공공임대 · 보증금 지원 · 특별공급', color: '#b5533c', icon: '🏠', img: '/img/icons/home.webp' },
  save: { no: '05', name: '생활비 감면', short: '아끼는 돈', badge: '#2fc4d6', desc: '공과금 할인 · K-패스 · 통신비 감면', color: '#0e7490', icon: '💡', img: '/img/icons/save.webp' },
  work: { no: '06', name: '구직 · 일자리', short: '버는 돈', badge: '#a78bfa', desc: '국민취업지원제도 · 구직촉진 · 창업', color: '#5b5f97', icon: '💼', img: '/img/icons/work.webp' },
  future: { no: '07', name: '자산 형성', short: '모으는 돈', badge: '#f472b6', desc: '청년도약계좌 · 매칭적금 · 청년드림', color: '#7c4a6e', icon: '🌱', img: '/img/icons/future.webp' },
};

export const catName = (slug: string) => CATEGORIES[slug as CategoryKey]?.name ?? slug;
export const catColor = (slug: string) => CATEGORIES[slug as CategoryKey]?.color ?? '#177a53';
export const fmtDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
