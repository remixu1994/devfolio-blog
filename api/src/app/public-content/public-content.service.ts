import { getFeaturedPayload } from '@devfolio-blog/content-data';
import { normalizeLocale } from '@devfolio-blog/i18n';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicContentService {
  constructor(private readonly postsService: PostsService) {}

  getPosts(locale?: string) {
    return this.postsService.getPublishedPosts(locale ? normalizeLocale(locale) : undefined);
  }

  getPost(slug: string, locale?: string) {
    const post = this.postsService.getPostBySlug(slug, locale ? normalizeLocale(locale) : undefined);

    if (!post || !post.published) {
      throw new NotFoundException(`Post ${slug} was not found.`);
    }

    return post;
  }

  getSeries() {
    return this.postsService.getSeriesSummaries();
  }

  getTags() {
    return this.postsService.getTagSummaries();
  }

  getFeatured(locale?: string) {
    const normalizedLocale = normalizeLocale(locale);
    const featured = getFeaturedPayload(normalizedLocale);

    return {
      ...featured,
      recentPosts: this.postsService.getPublishedPosts(normalizedLocale).slice(0, 3),
    };
  }
}
