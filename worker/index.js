// 머니첵 조회수 카운터. 정적 파일은 Cloudflare Assets가 내주고, /api/* 만 이 코드가 받는다(wrangler.jsonc run_worker_first).
// 저장소 = Durable Object(SQLite). 대시보드에서 만들 것 없이 배포하면 생긴다.
//   POST /api/view/<글id>        → 사람 브라우저가 글 열 때 +1 (봇 UA 제외, 같은 IP+글은 하루 1번) → { ok }  ※ 숫자 안 줌(비공개)
//   GET  /api/top?n=3            → [{ id }, ...] 많이 본 순, 조회 1 이상만. 숫자 없음(홈 순위용)
//   GET  /api/stats?key=…        → [{ id, views }, ...] 상위 50. 비공개: 환경변수 STATS_KEY(Cloudflare 대시보드 Settings→Variables, Secret)와 같아야 함
import { DurableObject } from 'cloudflare:workers';

const BOT = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|facebookexternalhit|whatsapp|telegram|curl|wget|python|java\b|go-http|okhttp|axios/i;
const ID = /^[a-z0-9][a-z0-9-]{1,120}$/;

export class Counter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS views (id TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS seen (k TEXT PRIMARY KEY, t INTEGER NOT NULL);`);
  }
  // 하루 지난 중복방지 키는 가끔 지운다
  sweep() {
    const cut = Math.floor(Date.now() / 1000) - 86400 * 2;
    this.sql.exec('DELETE FROM seen WHERE t < ?', cut);
  }
  view(id, key) {
    const now = Math.floor(Date.now() / 1000);
    if (key) {
      const dup = this.sql.exec('SELECT 1 FROM seen WHERE k = ?', key).toArray().length > 0;
      if (!dup) {
        this.sql.exec('INSERT INTO seen (k, t) VALUES (?, ?)', key, now);
        this.sql.exec('INSERT INTO views (id, n) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET n = n + 1', id);
        if (Math.random() < 0.01) this.sweep();
      }
    }
    return this.get([id])[id] ?? 0;
  }
  get(ids) {
    const out = {};
    for (const id of ids) out[id] = 0;
    if (ids.length) {
      const q = `SELECT id, n FROM views WHERE id IN (${ids.map(() => '?').join(',')})`;
      for (const r of this.sql.exec(q, ...ids)) out[r.id] = r.n;
    }
    return out;
  }
  top(n) {
    return this.sql.exec('SELECT id, n AS views FROM views ORDER BY n DESC, id LIMIT ?', n).toArray();
  }
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 16).map((x) => x.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    const stub = env.COUNTER.getByName('views');

    if (req.method === 'POST' && url.pathname.startsWith('/api/view/')) {
      const id = decodeURIComponent(url.pathname.slice('/api/view/'.length));
      if (!ID.test(id)) return json({ error: 'bad id' }, 400);
      const ua = req.headers.get('user-agent') || '';
      const ip = req.headers.get('cf-connecting-ip') || '';
      const day = new Date().toISOString().slice(0, 10);
      // 봇이거나 IP 없으면 세지 않고 현재 값만 돌려준다
      const key = !ua || BOT.test(ua) || !ip ? null : await sha(`${ip}|${day}|${id}`);
      await stub.view(id, key);
      return json({ ok: true });
    }
    if (req.method === 'GET' && url.pathname === '/api/top') {
      const n = Math.min(20, Math.max(1, Number(url.searchParams.get('n')) || 3));
      const rows = await stub.top(n);
      return json(rows.filter((r) => r.views > 0).map((r) => ({ id: r.id })));
    }
    if (req.method === 'GET' && url.pathname === '/api/stats') {
      const k = url.searchParams.get('key') || req.headers.get('x-stats-key') || '';
      if (!env.STATS_KEY || k !== env.STATS_KEY) return json({ error: 'forbidden' }, 403);
      return json(await stub.top(50));
    }
    return json({ error: 'not found' }, 404);
  },
};
