import { getCollection } from 'astro:content';

// 오늘(KST) 이후 날짜 글은 아직 없는 글로 본다. 새벽 빌드가 그날 글을 연다.
export const todayKST = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

export async function getPublished() {
  const today = todayKST();
  const posts = await getCollection('posts', ({ data }) => !data.draft && data.pubDate.toISOString().slice(0, 10) <= today);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
