import rss from '@astrojs/rss';
import { getPublished } from '../lib/posts';
import { SITE } from '../config/site';

export async function GET(context) {
  const posts = await getPublished();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/posts/${p.id}`,
    })),
  });
}
