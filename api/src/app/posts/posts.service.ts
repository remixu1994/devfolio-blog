import { seedPosts } from '@devfolio-blog/content-data';
import type { CreatePostDto, Locale, PublicPost, SeriesSummary, TagSummary, UpdatePostDto } from '@devfolio-blog/shared-types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class PostsService {
  private readonly posts = [...seedPosts];

  getAllPosts(): PublicPost[] {
    return [...this.posts].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  getPublishedPosts(locale?: Locale): PublicPost[] {
    return this.getAllPosts().filter(
      (post) => post.published && (!locale || post.locale === locale),
    );
  }

  getPostBySlug(slug: string, locale?: Locale): PublicPost | undefined {
    return this.posts.find((post) => post.slug === slug && (!locale || post.locale === locale));
  }

  createPost(payload: CreatePostDto): PublicPost {
    const post: PublicPost = {
      id: randomUUID(),
      slug: payload.slug,
      locale: payload.locale,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      tags: payload.tags,
      heroImage: payload.heroImage,
      updatedAt: new Date().toISOString().slice(0, 10),
      published: payload.published ?? false,
      status: payload.published ? 'published' : 'draft',
      series: payload.series,
    };

    this.posts.unshift(post);
    return post;
  }

  updatePost(id: string, payload: UpdatePostDto): PublicPost {
    const current = this.posts.find((post) => post.id === id);

    if (!current) {
      throw new NotFoundException(`Post ${id} was not found.`);
    }

    Object.assign(current, payload, {
      updatedAt: new Date().toISOString().slice(0, 10),
      status: payload.published === undefined ? current.status : payload.published ? 'published' : 'draft',
    });

    return current;
  }

  getTagSummaries(): TagSummary[] {
    const counts = new Map<string, number>();

    for (const post of this.getPublishedPosts()) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
  }

  getSeriesSummaries(): SeriesSummary[] {
    const counts = new Map<string, number>();

    for (const post of this.getPublishedPosts()) {
      if (!post.series) {
        continue;
      }
      counts.set(post.series, (counts.get(post.series) ?? 0) + 1);
    }

    return [...counts.entries()].map(([name, count]) => ({
      name,
      count,
      description: `${name} series`,
    }));
  }
}
