import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 글 머리말(frontmatter) 규격 — gpub.py --pull 이 만든다 (밥체크와 같은 규격)
//   title:       제목
//   description: 한 줄 요약 (첫 굵은 문단)
//   pubDate:     2026-09-20  (발행일. 오늘 이후면 그날까지 숨김)
//   category:    benefit | refund | loan | home | save | work | future
//   thumbnail:   대표 이미지 주소
//   tags:        [태그, …]  글 끝에 칩으로 보임
//   notion_id:   노션 페이지 id (중복 방어)
//   updatedDate: 수정일 (재검토 후 갱신)
//   draft:       true면 숨김
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    category: z.enum(['benefit', 'refund', 'loan', 'home', 'save', 'work', 'future']),
    thumbnail: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    notion_id: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
